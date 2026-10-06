import { prisma } from "../db/prisma";
import { getMissionBoard } from "./missions";
import { buildWorldSnapshot, MAP_NOTE_PREFIX, mapNoteInput } from "../play/worldMap";
import { gardenVisualKind, parseGardenState } from "../play/gardenPlot";
import { campUpgradeKind, parseCampPlan } from "../play/campPlan";

export async function getWorldSnapshot(learnerProfileId: string) {
  const board = await getMissionBoard(learnerProfileId);
  const [world, sessions, notes, campRow] = await Promise.all([
    prisma.storyWorld.findUniqueOrThrow({ where: { learnerProfileId }, select: { id: true,
      storyArcs: { where: { status: "ACTIVE" }, orderBy: { orderIndex: "desc" }, take: 1,
        select: { chapters: { orderBy: { orderIndex: "asc" },
          select: { id: true, title: true, orderIndex: true, status: true, plannerJson: true } } } } } }),
    prisma.session.findMany({ where: { learnerProfileId }, select: { id: true } }),
    prisma.worldLedgerEntry.findMany({
      where: { learnerProfileId, label: { startsWith: MAP_NOTE_PREFIX } },
      orderBy: { createdAt: "asc" },
      select: { label: true, text: true },
    }),
    prisma.campState.findUnique({ where: { learnerProfileId }, select: { garden: true, campPlan: true } }),
  ]);
  const activities = await prisma.learningActivity.findMany({
    where: { authoring: "AI_GENERATED", generatedFromSessionId: { in: sessions.map((s) => s.id) } },
    orderBy: { generatedAt: "asc" },
    select: { id: true, displayName: true, generatedFromSessionId: true, content: true,
      completions: { where: { learnerProfileId, completedAt: { not: null } }, select: { id: true }, take: 1 } },
  });
  const gardenVisual = gardenVisualKind(parseGardenState(campRow?.garden));
  const campUpgrade = campUpgradeKind(parseCampPlan(campRow?.campPlan));
  return buildWorldSnapshot({ worldId: world.id, missions: board.missions,
    chapters: world.storyArcs[0]?.chapters ?? [], notes, camp: board.camp,
    gardenVisual,
    campUpgrade,
    products: [],
    tasks: activities.map((a) => {
      const content = a.content as { mapLocationId?: unknown } | null;
      return { id: a.id, title: a.displayName, sessionId: a.generatedFromSessionId!,
        locationId: typeof content?.mapLocationId === "string" ? content.mapLocationId : "camp",
        completed: a.completions.length > 0 };
    }),
  });
}

export async function saveMapNote(learnerProfileId: string, raw: unknown) {
  const input = mapNoteInput.parse(raw);
  const world = await getWorldSnapshot(learnerProfileId);
  const node = world.nodes.find((n) => n.id === input.nodeId);
  if (!node || node.status === "locked") throw new Error("Choose an available place on your map.");
  // Deterministic ID makes retries and concurrent tool/UI saves one note per place.
  const id = `map-note:${learnerProfileId}:${node.id}`;
  await prisma.worldLedgerEntry.upsert({ where: { id },
    create: { id, learnerProfileId, kind: "DECISION", label: MAP_NOTE_PREFIX + node.id, text: input.note },
    update: { text: input.note },
  });
  return getWorldSnapshot(learnerProfileId);
}

/** Public questions only; the originating session must belong to this captain. */
export async function getWorldActivity(learnerProfileId: string, activityId: string) {
  const row = await prisma.learningActivity.findUnique({ where: { id: activityId },
    select: { id: true, displayName: true, authoring: true, generatedFromSessionId: true, content: true } });
  if (!row || row.authoring !== "AI_GENERATED" || !row.generatedFromSessionId) return null;
  const owner = await prisma.session.findFirst({ where: { id: row.generatedFromSessionId, learnerProfileId }, select: { id: true } });
  if (!owner) return null;
  const content = row.content as { standardCode: string; instructions: string;
    items: Array<{ id: string; question: string; options: string[] }> };
  return { sessionId: owner.id, activity: { id: row.id, title: row.displayName,
    standardCode: content.standardCode, instructions: content.instructions,
    items: content.items.map(({ id, question, options }) => ({ id, question, options })) } };
}
