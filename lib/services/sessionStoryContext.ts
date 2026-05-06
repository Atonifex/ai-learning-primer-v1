import { prisma } from "../db/prisma";
import type { BranchPointUi, SessionStoryUi, StorySpineContext } from "../types";
import { getPendingBranchForChapter, seedDemoBranchIfRequested } from "./storyBranches";

/** Loads world / arc / chapter fields for system prompt injection (Phase 3). */
export async function getStorySpineForSession(sessionId: string): Promise<StorySpineContext | null> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: {
      sceneIndex: true,
      chapter: {
        select: {
          id: true,
          title: true,
          focusTags: true,
          actCurrent: true,
          actTotal: true,
          pathAheadWhisper: true,
          plannerJson: true,
          storyArc: {
            select: {
              id: true,
              title: true,
              focusTags: true,
              summary: true,
              storyWorld: {
                select: { title: true, bible: true },
              },
            },
          },
        },
      },
    },
  });

  if (!session?.chapter) return null;

  const ch = session.chapter;
  const arc = ch.storyArc;
  const world = arc.storyWorld;

  return {
    worldTitle: world.title,
    worldBible: world.bible,
    arcTitle: arc.title,
    arcSummary: arc.summary,
    arcFocusTags: arc.focusTags,
    chapterTitle: ch.title,
    chapterFocusTags: ch.focusTags,
    actCurrent: ch.actCurrent,
    actTotal: ch.actTotal,
    pathAheadWhisper: ch.pathAheadWhisper,
    sceneIndex: session.sceneIndex,
    plannerJson: ch.plannerJson,
  };
}

/** Prior completed session in the same chapter (for "Previously On"). */
export async function getPreviouslyOnRecap(sessionId: string): Promise<string | null> {
  const s = await prisma.session.findUnique({
    where: { id: sessionId },
    select: {
      chapterId: true,
      startedAt: true,
      learnerProfileId: true,
    },
  });
  if (!s?.chapterId) return null;

  const prior = await prisma.session.findFirst({
    where: {
      chapterId: s.chapterId,
      learnerProfileId: s.learnerProfileId,
      status: "COMPLETED",
      arcSummary: { not: null },
      id: { not: sessionId },
      startedAt: { lt: s.startedAt },
    },
    orderBy: { completedAt: "desc" },
    select: { arcSummary: true },
  });

  return prior?.arcSummary ?? null;
}

/** UI payload: world copy, recap line, optional branch cards (Phase 4). */
export async function buildSessionStoryUi(sessionId: string): Promise<SessionStoryUi> {
  const spine = await getStorySpineForSession(sessionId);
  const previouslyOn = await getPreviouslyOnRecap(sessionId);

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { chapterId: true },
  });

  let branchPoint: BranchPointUi | null = null;
  if (session?.chapterId) {
    await seedDemoBranchIfRequested(session.chapterId);
    branchPoint = await getPendingBranchForChapter(session.chapterId);
  }

  return {
    worldTitle: spine?.worldTitle ?? "Your story",
    worldBible: spine?.worldBible ?? "",
    previouslyOn,
    showPreviouslyOn: Boolean(previouslyOn),
    branchPoint,
  };
}
