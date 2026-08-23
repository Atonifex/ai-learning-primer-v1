import { prisma } from "../db/prisma";
import {
  decorateMissions,
  formatMissionsForPrompt,
  missionById,
  stubRationsFromMissions,
  stubXpFromMissions,
  TUTORIAL_MISSIONS,
  type MissionPublic,
} from "../play/missions";
import { hasCompletedActivitySlug, listCompletedActivitySlugs } from "../play/overlayQuiz";
import { TUTORIAL_QUIZ_SLUG } from "../play/tutorialQuizSlug";
import { hasCompletedChapterReflection } from "../play/chapterReflection";
import { remapCoreSubjectToGrade } from "../constants/subjects";
import { completeSession, startSession } from "./session";
import { ensureLearnerStoryChain } from "./storyCurriculum";

export type MissionBoardPayload = {
  missions: MissionPublic[];
  wreckQuizDone: boolean;
  chapter1ReflectionDone: boolean;
  activeChapterTitle: string | null;
  activeChapterStatus: string | null;
  xp: number;
  rations: number;
};

export async function getMissionBoard(learnerProfileId: string): Promise<MissionBoardPayload> {
  const slugs = TUTORIAL_MISSIONS.map((m) => m.activitySlug);
  const [completedSlugs, wreckQuizDone, chapter1ReflectionDone, chain] = await Promise.all([
    listCompletedActivitySlugs(learnerProfileId, slugs),
    hasCompletedActivitySlug(learnerProfileId, TUTORIAL_QUIZ_SLUG),
    hasCompletedChapterReflection(learnerProfileId),
    ensureLearnerStoryChain(learnerProfileId),
  ]);

  const chapter = await prisma.chapter.findUnique({
    where: { id: chain.chapterId },
    select: { title: true, status: true },
  });

  const missions = decorateMissions({
    wreckQuizDone,
    chapter1ReflectionDone,
    completedSlugs: new Set(completedSlugs),
  });

  return {
    missions,
    wreckQuizDone,
    chapter1ReflectionDone,
    activeChapterTitle: chapter?.title ?? null,
    activeChapterStatus: chapter?.status ?? null,
    xp: stubXpFromMissions(missions),
    rations: stubRationsFromMissions(missions),
  };
}

export async function getMissionPromptBlock(learnerProfileId: string): Promise<string> {
  const board = await getMissionBoard(learnerProfileId);
  return formatMissionsForPrompt(board.missions);
}

export async function startOrContinueSubjectSession(
  profileId: string,
  subjectSlug: string
): Promise<{ sessionId: string; switched: boolean }> {
  const active = await prisma.session.findFirst({
    where: { learnerProfileId: profileId, status: "ACTIVE" },
    orderBy: { startedAt: "desc" },
    include: { subject: { select: { slug: true } } },
  });
  if (active && active.subject.slug === subjectSlug) {
    return { sessionId: active.id, switched: false };
  }
  if (active) {
    await completeSession(
      active.id,
      `Switched subject lens from ${active.subject.slug} to ${subjectSlug} for a new mission.`
    );
  }
  const sessionId = await startSession(profileId, subjectSlug);
  return { sessionId, switched: true };
}

export async function startMissionForLearner(params: {
  learnerProfileId: string;
  missionId: string;
}): Promise<{
  sessionId: string;
  switched: boolean;
  mission: MissionPublic;
}> {
  const def = missionById(params.missionId);
  if (!def) throw new Error("Unknown mission");

  const board = await getMissionBoard(params.learnerProfileId);
  const mission = board.missions.find((m) => m.id === def.id);
  if (!mission) throw new Error("Unknown mission");
  if (mission.status === "locked") {
    throw new Error(mission.lockReason || "That job is still locked.");
  }

  const profile = await prisma.learnerProfile.findUnique({
    where: { id: params.learnerProfileId },
    select: { gradeBand: true },
  });
  const sessionSubjectSlug = remapCoreSubjectToGrade(
    mission.subjectSlug,
    profile?.gradeBand ?? "3"
  );

  const { sessionId, switched } = await startOrContinueSubjectSession(
    params.learnerProfileId,
    sessionSubjectSlug
  );
  return { sessionId, switched, mission };
}

export type SagaProgressPayload = {
  worldTitle: string;
  arcTitle: string;
  chapters: Array<{
    id: string;
    title: string;
    orderIndex: number;
    status: string;
  }>;
  missions: MissionPublic[];
  wreckQuizDone: boolean;
  chapter1ReflectionDone: boolean;
};

export async function getSagaProgress(learnerProfileId: string): Promise<SagaProgressPayload> {
  await ensureLearnerStoryChain(learnerProfileId);
  const world = await prisma.storyWorld.findUniqueOrThrow({
    where: { learnerProfileId },
    select: {
      title: true,
      storyArcs: {
        where: { status: "ACTIVE" },
        orderBy: { orderIndex: "desc" },
        take: 1,
        select: {
          title: true,
          chapters: {
            orderBy: { orderIndex: "asc" },
            select: { id: true, title: true, orderIndex: true, status: true },
          },
        },
      },
    },
  });
  const arc = world.storyArcs[0];
  const board = await getMissionBoard(learnerProfileId);
  return {
    worldTitle: world.title,
    arcTitle: arc?.title ?? "The Mapmaker's Expedition",
    chapters: arc?.chapters ?? [],
    missions: board.missions,
    wreckQuizDone: board.wreckQuizDone,
    chapter1ReflectionDone: board.chapter1ReflectionDone,
  };
}
