import { prisma } from "../db/prisma";
import { recordStandardObservation } from "../services/standardsProgress";
import type { GeneratedActivity } from "../types";
import { hintsFromContent, parseMcItems } from "./quizItems";

/** Frozen Chapter 1 overlay quiz from the activity bank (A7). */
export const TUTORIAL_QUIZ_SLUG = "g3-ma-wreck-number-forms";

export type TutorialQuizPublic = GeneratedActivity & {
  hints: string[];
  completionId: string;
  alreadyCompleted: boolean;
  priorScore: number | null;
};

async function loadTutorialActivity() {
  const activity = await prisma.learningActivity.findUnique({
    where: { slug: TUTORIAL_QUIZ_SLUG },
    include: {
      standardLinks: { include: { standard: { select: { code: true } } } },
    },
  });
  if (!activity) {
    throw new Error(
      `Tutorial quiz "${TUTORIAL_QUIZ_SLUG}" is not seeded. Run \`npm run db:seed\`.`
    );
  }
  const mc = parseMcItems(activity.content);
  if (!mc.length) {
    throw new Error(`Tutorial quiz "${TUTORIAL_QUIZ_SLUG}" has no multiple-choice items.`);
  }
  const standardCode = activity.standardLinks[0]?.standard.code ?? "MA.3.NSO.1.1";
  return { activity, mc, standardCode, hints: hintsFromContent(activity.content) };
}

export async function hasCompletedTutorialQuiz(
  learnerProfileId: string
): Promise<boolean> {
  const activity = await prisma.learningActivity.findUnique({
    where: { slug: TUTORIAL_QUIZ_SLUG },
    select: { id: true },
  });
  if (!activity) return false;
  const done = await prisma.learningActivityCompletion.findFirst({
    where: {
      learnerProfileId,
      learningActivityId: activity.id,
      completedAt: { not: null },
    },
    select: { id: true },
  });
  return Boolean(done);
}

export async function startTutorialOverlayQuiz(params: {
  learnerProfileId: string;
}): Promise<TutorialQuizPublic> {
  const { activity, mc, standardCode, hints } = await loadTutorialActivity();

  const done = await prisma.learningActivityCompletion.findFirst({
    where: {
      learnerProfileId: params.learnerProfileId,
      learningActivityId: activity.id,
      completedAt: { not: null },
    },
    orderBy: { completedAt: "desc" },
  });

  if (done) {
    return {
      id: activity.id,
      standardCode,
      title: activity.displayName,
      instructions: activity.description,
      items: mc.map(({ id, question, options }) => ({ id, question, options })),
      hints,
      completionId: done.id,
      alreadyCompleted: true,
      priorScore: done.score,
    };
  }

  let open = await prisma.learningActivityCompletion.findFirst({
    where: {
      learnerProfileId: params.learnerProfileId,
      learningActivityId: activity.id,
      completedAt: null,
    },
    orderBy: { startedAt: "desc" },
  });
  if (!open) {
    open = await prisma.learningActivityCompletion.create({
      data: {
        learnerProfileId: params.learnerProfileId,
        learningActivityId: activity.id,
      },
    });
  }

  return {
    id: activity.id,
    standardCode,
    title: activity.displayName,
    instructions: activity.description,
    items: mc.map(({ id, question, options }) => ({ id, question, options })),
    hints,
    completionId: open.id,
    alreadyCompleted: false,
    priorScore: null,
  };
}

export async function submitTutorialOverlayQuiz(params: {
  sessionId: string;
  learnerProfileId: string;
  completionId: string;
  answers: Array<{ itemId: string; selectedIndex: number }>;
}): Promise<{
  score: number;
  total: number;
  correct: number;
  mastery: number;
  missed: string[];
  hints: string[];
}> {
  const { activity, mc, standardCode, hints } = await loadTutorialActivity();

  const completion = await prisma.learningActivityCompletion.findUnique({
    where: { id: params.completionId },
  });
  if (!completion || completion.learnerProfileId !== params.learnerProfileId) {
    throw new Error("Quiz attempt not found");
  }
  if (completion.learningActivityId !== activity.id) {
    throw new Error("Quiz attempt does not match tutorial activity");
  }
  if (completion.completedAt) {
    throw new Error("Quiz already submitted");
  }

  const answerMap = new Map(params.answers.map((a) => [a.itemId, a.selectedIndex]));
  let correct = 0;
  const missed: string[] = [];
  for (const item of mc) {
    if (answerMap.get(item.id) === item.correctIndex) {
      correct += 1;
    } else {
      missed.push(item.id);
    }
  }
  const total = mc.length;
  const score = total > 0 ? correct / total : 0;

  const updated = await prisma.learningActivityCompletion.update({
    where: { id: completion.id },
    data: {
      completedAt: new Date(),
      score: score * 100,
      perStandardCorrectness: { [standardCode]: score },
      evidenceWritten: true,
    },
  });

  const observation = await recordStandardObservation({
    sessionId: params.sessionId,
    standardCode,
    evidenceTier: "GUIDED",
    sourceType: "ACTIVITY",
    sourceId: updated.id,
    correctness: score,
    notes: `Tutorial overlay quiz ${activity.slug} completed`,
  });

  return {
    score: Math.round(score * 100),
    total,
    correct,
    mastery: Math.round(observation.mastery),
    missed,
    hints,
  };
}
