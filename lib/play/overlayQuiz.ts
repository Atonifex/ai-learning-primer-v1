import { prisma } from "../db/prisma";
import { filterTonightSliceCodes } from "../curriculum/tonightSlice";
import { recordStandardObservation } from "../services/standardsProgress";
import { applyCampGrantToLearner } from "../services/camp";
import { TUTORIAL_QUIZ_SLUG } from "./tutorialQuizSlug";
import { WRECK_SALVAGE_GRANT } from "./camp";
import { stampActivityClock } from "../services/timeTracking";
import type { GeneratedActivity } from "../types";
import { hintsFromContent, parseMcItems } from "./quizItems";

export type OverlayQuizPublic = GeneratedActivity & {
  slug: string;
  hints: string[];
  standardCodes: string[];
  completionId: string;
  alreadyCompleted: boolean;
  priorScore: number | null;
  source: "bank" | "generated";
};

async function loadBankActivity(slug: string) {
  const activity = await prisma.learningActivity.findUnique({
    where: { slug },
    include: {
      subject: { select: { slug: true } },
      standardLinks: { include: { standard: { select: { code: true } } } },
    },
  });
  if (!activity) {
    throw new Error(`Activity "${slug}" is not seeded. Run \`npm run db:seed\`.`);
  }
  const mc = parseMcItems(activity.content);
  if (!mc.length) {
    throw new Error(`Activity "${slug}" has no multiple-choice items for the overlay.`);
  }
  const linked = activity.standardLinks.map((l) => l.standard.code);
  const standardCodes = filterTonightSliceCodes(linked);
  if (!standardCodes.length) {
    throw new Error(
      `Activity "${slug}" has no §4.6 codes linked. Linked: ${linked.join(", ") || "(none)"}`
    );
  }
  return { activity, mc, standardCodes, hints: hintsFromContent(activity.content) };
}

export async function hasCompletedActivitySlug(
  learnerProfileId: string,
  slug: string
): Promise<boolean> {
  const activity = await prisma.learningActivity.findUnique({
    where: { slug },
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

export async function listCompletedActivitySlugs(
  learnerProfileId: string,
  slugs: string[]
): Promise<string[]> {
  if (!slugs.length) return [];
  const rows = await prisma.learningActivityCompletion.findMany({
    where: {
      learnerProfileId,
      completedAt: { not: null },
      learningActivity: { slug: { in: slugs } },
    },
    select: { learningActivity: { select: { slug: true } } },
  });
  return [...new Set(rows.map((r) => r.learningActivity.slug))];
}

export async function startBankOverlayQuiz(params: {
  learnerProfileId: string;
  sessionId: string;
  slug: string;
}): Promise<OverlayQuizPublic> {
  const { activity, mc, standardCodes, hints } = await loadBankActivity(params.slug);

  const session = await prisma.session.findUnique({
    where: { id: params.sessionId },
    select: { subject: { select: { slug: true } } },
  });
  if (!session) throw new Error("Session not found");
  if (session.subject.slug !== activity.subject.slug) {
    throw new Error(
      `This job needs a ${activity.subject.slug} session (current: ${session.subject.slug}).`
    );
  }

  const done = await prisma.learningActivityCompletion.findFirst({
    where: {
      learnerProfileId: params.learnerProfileId,
      learningActivityId: activity.id,
      completedAt: { not: null },
    },
    orderBy: { completedAt: "desc" },
  });

  const publicQuiz = {
    id: activity.id,
    slug: activity.slug,
    standardCode: standardCodes[0]!,
    standardCodes,
    title: activity.displayName,
    instructions: activity.description,
    items: mc.map(({ id, question, options }) => ({ id, question, options })),
    hints,
    source: "bank" as const,
  };

  if (done) {
    return {
      ...publicQuiz,
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
        sessionId: params.sessionId,
      },
    });
  } else if (!open.sessionId) {
    open = await prisma.learningActivityCompletion.update({
      where: { id: open.id },
      data: { sessionId: params.sessionId },
    });
  }

  return {
    ...publicQuiz,
    completionId: open.id,
    alreadyCompleted: false,
    priorScore: null,
  };
}

export async function submitBankOverlayQuiz(params: {
  sessionId: string;
  learnerProfileId: string;
  completionId: string;
  slug: string;
  answers: Array<{ itemId: string; selectedIndex: number }>;
}): Promise<{
  score: number;
  total: number;
  correct: number;
  mastery: number;
  missed: string[];
  hints: string[];
  standardCodes: string[];
}> {
  const { activity, mc, standardCodes, hints } = await loadBankActivity(params.slug);

  const completion = await prisma.learningActivityCompletion.findUnique({
    where: { id: params.completionId },
  });
  if (!completion || completion.learnerProfileId !== params.learnerProfileId) {
    throw new Error("Quiz attempt not found");
  }
  if (completion.learningActivityId !== activity.id) {
    throw new Error("Quiz attempt does not match this activity");
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
  const perStandard = Object.fromEntries(standardCodes.map((code) => [code, score]));

  await stampActivityClock({
    completionId: completion.id,
    extra: {
      sessionId: params.sessionId,
      score: score * 100,
      perStandardCorrectness: perStandard,
      evidenceWritten: true,
    },
  });

  let lastMastery = 0;
  for (const standardCode of standardCodes) {
    const observation = await recordStandardObservation({
      sessionId: params.sessionId,
      standardCode,
      evidenceTier: "GUIDED",
      sourceType: "ACTIVITY",
      sourceId: completion.id,
      correctness: score,
      notes: `Overlay quiz ${activity.slug} completed`,
    });
    lastMastery = observation.mastery;
  }

  if (params.slug === TUTORIAL_QUIZ_SLUG) {
    await applyCampGrantToLearner(params.learnerProfileId, WRECK_SALVAGE_GRANT);
  }

  return {
    score: Math.round(score * 100),
    total,
    correct,
    mastery: Math.round(lastMastery),
    missed,
    hints,
    standardCodes,
  };
}
