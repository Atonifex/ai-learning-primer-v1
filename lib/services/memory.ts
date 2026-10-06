import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import type {
  MemoryItemData,
  SkillUpdate,
  StoryStateData,
  RecurringCharacterEntry,
} from "../types";

export async function getRelevantMemory(
  profileId: string,
  limit = 20
): Promise<MemoryItemData[]> {
  const items = await prisma.memoryItem.findMany({
    where: { learnerProfileId: profileId, NOT: [{ id: { startsWith: `${profileId}:subject-check:` } }, { id: `${profileId}:math-check:v1` }] },
    orderBy: [{ confidence: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });
  return items.map((i) => ({
    type: i.type as MemoryItemData["type"],
    content: i.content,
    confidence: i.confidence,
  }));
}

export async function upsertMemoryItems(
  profileId: string,
  sessionId: string,
  items: MemoryItemData[]
): Promise<void> {
  for (const item of items) {
    const existing = await prisma.memoryItem.findFirst({
      where: {
        learnerProfileId: profileId,
        type: item.type,
        content: { contains: item.content.substring(0, 30) },
      },
    });

    if (existing) {
      await prisma.memoryItem.update({
        where: { id: existing.id },
        data: {
          confidence: Math.min(1.0, (existing.confidence + item.confidence) / 2),
          content: item.content,
        },
      });
    } else {
      await prisma.memoryItem.create({
        data: {
          learnerProfileId: profileId,
          type: item.type,
          content: item.content,
          confidence: item.confidence,
          sourceSessionId: sessionId,
        },
      });
    }
  }
}

export async function upsertSkillProgress(
  profileId: string,
  skills: SkillUpdate[]
): Promise<void> {
  for (const skill of skills) {
    const slug = skill.skillName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 64);
    if (!slug) continue;

    const skillRow = await prisma.skill.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        displayName: skill.skillName,
        description: `Auto-captured skill: ${skill.skillName}`,
      },
    });

    await prisma.skillProgress.upsert({
      where: {
        learnerProfileId_skillId: {
          learnerProfileId: profileId,
          skillId: skillRow.id,
        },
      },
      update: {
        mastery: Math.max(0, Math.min(100, skill.estimatedLevel * 100)),
        confidence: skill.confidence,
        evidenceCount: { increment: 1 },
        lastObservedAt: new Date(),
      },
      create: {
        learnerProfileId: profileId,
        skillId: skillRow.id,
        mastery: Math.max(0, Math.min(100, skill.estimatedLevel * 100)),
        confidence: skill.confidence,
        evidenceCount: 1,
      },
    });
  }
}

export async function upsertStoryState(
  profileId: string,
  sessionId: string,
  state: StoryStateData
): Promise<void> {
  await prisma.storyState.upsert({
    where: { sessionId },
    update: {
      arcName: state.arcName,
      currentState: state.currentState,
      recurringCharacters: state.recurringCharacters as unknown as Prisma.InputJsonValue,
      activeThemes: state.activeThemes,
    },
    create: {
      learnerProfileId: profileId,
      sessionId,
      arcName: state.arcName,
      currentState: state.currentState,
      recurringCharacters: state.recurringCharacters as unknown as Prisma.InputJsonValue,
      activeThemes: state.activeThemes,
    },
  });
}

export async function getRecentSummaries(
  profileId: string,
  limit = 3
): Promise<string[]> {
  const sessions = await prisma.session.findMany({
    where: {
      learnerProfileId: profileId,
      status: "COMPLETED",
      arcSummary: { not: null },
    },
    orderBy: { completedAt: "desc" },
    take: limit,
    select: { arcSummary: true },
  });
  return sessions.map((s) => s.arcSummary!);
}

function mapStoryStateRow(state: {
  arcName: string;
  currentState: string;
  recurringCharacters: unknown;
  activeThemes: string[];
}): StoryStateData {
  const raw = state.recurringCharacters as unknown;
  const recurringCharacters: RecurringCharacterEntry[] = Array.isArray(raw)
    ? raw.map((c: unknown) => {
        if (c && typeof c === "object" && "name" in c) {
          const o = c as { name: string; description?: string; characterKey?: string };
          return {
            name: o.name,
            description: o.description ?? "",
            ...(o.characterKey ? { characterKey: o.characterKey } : {}),
          };
        }
        return { name: String(c), description: "" };
      })
    : [];

  return {
    arcName: state.arcName,
    currentState: state.currentState,
    recurringCharacters,
    activeThemes: state.activeThemes,
  };
}

export async function getLatestStoryState(profileId: string): Promise<StoryStateData | null> {
  const state = await prisma.storyState.findFirst({
    where: { learnerProfile: { id: profileId } },
    orderBy: { lastUpdatedAt: "desc" },
  });
  if (!state) return null;
  return mapStoryStateRow(state);
}

/**
 * Story continuity for prompts: prefer the latest `StoryState` among sessions in the same chapter
 * so we do not bleed arc state from unrelated sessions.
 */
export async function getStoryStateForSessionContext(
  sessionId: string
): Promise<StoryStateData | null> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { learnerProfileId: true, chapterId: true },
  });
  if (!session) return null;

  if (!session.chapterId) {
    return getLatestStoryState(session.learnerProfileId);
  }

  const state = await prisma.storyState.findFirst({
    where: { session: { chapterId: session.chapterId } },
    orderBy: { lastUpdatedAt: "desc" },
  });
  if (!state) return null;
  return mapStoryStateRow(state);
}
