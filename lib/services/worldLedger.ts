import { prisma } from "../db/prisma";
import {
  buildHandoffSummary,
  ch1CrewLogFacts,
  formatChapterHandoffBlock,
  type LedgerFact,
} from "../play/chapterHandoff";
import {
  completeActiveChapterAndActivateNext,
  ensureLearnerStoryChain,
} from "./storyCurriculum";

export type ChapterHandoffView = {
  fromChapterTitle: string;
  summary: string;
  block: string;
};

/**
 * Writes the Ch1 crew-log artifact + open thread, stores handoffSummary on
 * the completed chapter, then activates the next chapter.
 * Returns null when this learner is not on tutorial chapter 1.
 */
export async function recordCh1CrewLogHandoff(params: {
  learnerProfileId: string;
  note: string;
  sourceCompletionId: string;
  activitySlug: string;
  standardCodes: string[];
}): Promise<{ summary: string; completedTitle: string; nextTitle: string | null } | null> {
  const { chapterId } = await ensureLearnerStoryChain(params.learnerProfileId);
  const current = await prisma.chapter.findUnique({
    where: { id: chapterId },
    select: { id: true, title: true, status: true, orderIndex: true, storyArcId: true },
  });
  if (!current || current.status !== "ACTIVE" || current.orderIndex !== 0) return null;

  const next = await prisma.chapter.findFirst({
    where: { storyArcId: current.storyArcId, status: "PLANNED" },
    orderBy: { orderIndex: "asc" },
    select: { title: true },
  });

  const facts = ch1CrewLogFacts({
    note: params.note,
    standardCodes: params.standardCodes,
  });
  const summary = buildHandoffSummary({
    completedChapterTitle: current.title,
    nextChapterTitle: next?.title ?? null,
    facts,
  });

  const existing = await prisma.worldLedgerEntry.findUnique({
    where: { sourceCompletionId: params.sourceCompletionId },
    select: { id: true },
  });
  if (!existing) {
    await prisma.worldLedgerEntry.createMany({
      data: facts.map((fact) => ({
        learnerProfileId: params.learnerProfileId,
        chapterId: current.id,
        kind: fact.kind,
        label: fact.label,
        text: fact.text,
        standardCodes: fact.standardCodes,
        activitySlug: fact.label === "crew_log" ? params.activitySlug : null,
        sourceCompletionId:
          fact.label === "crew_log" ? params.sourceCompletionId : null,
        mustReuse: fact.mustReuse,
      })),
    });
  }

  const advanced = await completeActiveChapterAndActivateNext(params.learnerProfileId, {
    handoffSummary: summary,
  });
  if (!advanced) return null;
  return {
    summary,
    completedTitle: advanced.completedTitle,
    nextTitle: advanced.nextTitle,
  };
}

function toFact(row: {
  kind: LedgerFact["kind"];
  label: string;
  text: string;
  standardCodes: string[];
  mustReuse: boolean;
}): LedgerFact {
  return {
    kind: row.kind,
    label: row.label,
    text: row.text,
    standardCodes: row.standardCodes,
    mustReuse: row.mustReuse,
  };
}

/** Prompt block for the chapter that follows a stored handoff. Null on chapter 1. */
export async function getChapterHandoffForSession(
  sessionId: string
): Promise<ChapterHandoffView | null> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: {
      learnerProfileId: true,
      chapter: {
        select: { orderIndex: true, storyArcId: true },
      },
    },
  });
  const chapter = session?.chapter;
  if (!session || !chapter || chapter.orderIndex < 1) return null;

  const previous = await prisma.chapter.findFirst({
    where: {
      storyArcId: chapter.storyArcId,
      orderIndex: chapter.orderIndex - 1,
      handoffSummary: { not: null },
    },
    select: { id: true, title: true, handoffSummary: true },
  });
  if (!previous?.handoffSummary) return null;

  const rows = await prisma.worldLedgerEntry.findMany({
    where: {
      learnerProfileId: session.learnerProfileId,
      chapterId: previous.id,
      mustReuse: true,
      label: { not: "camp_product" },
    },
    orderBy: { createdAt: "asc" },
  });

  const mustReuse = rows.map(toFact);
  return {
    fromChapterTitle: previous.title,
    summary: previous.handoffSummary,
    block: formatChapterHandoffBlock({
      fromChapterTitle: previous.title,
      summary: previous.handoffSummary,
      mustReuse,
    }),
  };
}

export type LearnerLedgerEntry = {
  id: string;
  kind: string;
  label: string;
  text: string;
  standardCodes: string[];
  mustReuse: boolean;
  chapter: { title: string } | null;
};

export type LearnerLedgerView = {
  entries: LearnerLedgerEntry[];
  handoffTitle: string | null;
  handoffSummary: string | null;
};

export async function getLearnerLedger(
  learnerProfileId: string
): Promise<LearnerLedgerView> {
  const [entries, handoff] = await Promise.all([
    prisma.worldLedgerEntry.findMany({
      where: { learnerProfileId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        kind: true,
        label: true,
        text: true,
        standardCodes: true,
        mustReuse: true,
        chapter: { select: { title: true } },
      },
    }),
    prisma.chapter.findFirst({
      where: {
        handoffSummary: { not: null },
        storyArc: { storyWorld: { learnerProfileId } },
      },
      orderBy: { orderIndex: "desc" },
      select: { title: true, handoffSummary: true },
    }),
  ]);

  return {
    entries: entries.filter((entry) => entry.label !== "camp_product"),
    handoffTitle: handoff?.title ?? null,
    handoffSummary: handoff?.handoffSummary ?? null,
  };
}
