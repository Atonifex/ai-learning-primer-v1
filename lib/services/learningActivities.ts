import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import { recordStandardObservation } from "./standardsProgress";

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface PublicQuizItem {
  id: string;
  question: string;
  options: string[];
}

export interface GeneratedActivityPublic {
  id: string;
  standardCode: string;
  title: string;
  instructions: string;
  items: PublicQuizItem[];
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 40);
}

function parseItems(raw: unknown): QuizItem[] {
  if (!Array.isArray(raw)) return [];
  const out: QuizItem[] = [];
  for (let idx = 0; idx < raw.length; idx++) {
    const row = raw[idx];
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const question = typeof r.question === "string" ? r.question.trim() : "";
    const options = Array.isArray(r.options)
      ? r.options.filter((o): o is string => typeof o === "string").map((o) => o.trim())
      : [];
    const correctOptionIndex =
      typeof r.correct_option_index === "number"
        ? r.correct_option_index
        : typeof r.correctOptionIndex === "number"
          ? r.correctOptionIndex
          : -1;
    if (!question || options.length < 2) continue;
    if (correctOptionIndex < 0 || correctOptionIndex >= options.length) continue;
    out.push({
      id: `q${idx + 1}`,
      question,
      options,
      correctOptionIndex,
      explanation: typeof r.explanation === "string" ? r.explanation : undefined,
    });
  }
  return out;
}

export async function createGeneratedMiniQuiz(params: {
  sessionId: string;
  standardCode: string;
  title: string;
  instructions: string;
  items: unknown;
  mapLocationId?: string;
}): Promise<GeneratedActivityPublic> {
  const session = await prisma.session.findUnique({
    where: { id: params.sessionId },
    select: { subjectId: true },
  });
  if (!session) throw new Error("Session not found");

  const standard = await prisma.standard.findFirst({
    where: { code: params.standardCode, catalog: { subjectId: session.subjectId } },
    select: { id: true, code: true },
  });
  if (!standard) {
    throw new Error(`Standard not found for current subject: ${params.standardCode}`);
  }

  const parsedItems = parseItems(params.items).slice(0, 5);
  if (!parsedItems.length) {
    throw new Error("Generated quiz contained no valid items");
  }

  const safeTitle = params.title?.trim() || `Mini quiz: ${standard.code}`;
  const safeInstructions =
    params.instructions?.trim() || "Pick the best answer for each question.";
  const slug = `ai-${slugify(standard.code)}-${Date.now()}-${randomUUID().slice(0, 6)}`;

  const activity = await prisma.learningActivity.create({
    data: {
      slug,
      displayName: safeTitle,
      kind: "MINI_QUIZ",
      subjectId: session.subjectId,
      description: `AI-generated quiz for ${standard.code}`,
      content: {
        standardCode: standard.code,
        instructions: safeInstructions,
        items: parsedItems,
        mapLocationId: params.mapLocationId ?? "camp",
      } as unknown as Prisma.InputJsonValue,
      authoring: "AI_GENERATED",
      generatedFromSessionId: params.sessionId,
      generatedAt: new Date(),
      standardLinks: {
        create: [{ standardId: standard.id }],
      },
    },
    include: {
      standardLinks: { include: { standard: { select: { code: true } } } },
    },
  });

  return {
    id: activity.id,
    standardCode: standard.code,
    title: activity.displayName,
    instructions: safeInstructions,
    items: parsedItems.map((item) => ({
      id: item.id,
      question: item.question,
      options: item.options,
    })),
  };
}

export async function submitGeneratedMiniQuiz(params: {
  sessionId: string;
  learnerProfileId: string;
  activityId: string;
  answers: Array<{ itemId: string; selectedIndex: number }>;
}): Promise<{ score: number; total: number; correct: number; mastery: number }> {
  const owner = await prisma.session.findFirst({
    where: { id: params.sessionId, learnerProfileId: params.learnerProfileId },
    select: { id: true },
  });
  if (!owner) throw new Error("Session not found");
  const activity = await prisma.learningActivity.findUnique({
    where: { id: params.activityId },
    include: {
      standardLinks: { include: { standard: { select: { code: true } } } },
    },
  });
  if (!activity) throw new Error("Activity not found");
  if (activity.generatedFromSessionId !== params.sessionId) {
    throw new Error("Activity does not belong to this session");
  }
  if (activity.kind !== "MINI_QUIZ") throw new Error("Unsupported activity kind");

  const content = (activity.content ?? {}) as { items?: QuizItem[] };
  const items = Array.isArray(content.items) ? content.items : [];
  if (!items.length) throw new Error("Activity has no items");

  const answerMap = new Map(params.answers.map((a) => [a.itemId, a.selectedIndex]));
  let correct = 0;
  for (const item of items) {
    if (answerMap.get(item.id) === item.correctOptionIndex) correct += 1;
  }
  const total = items.length;
  const score = total > 0 ? correct / total : 0;

  const completion = await prisma.learningActivityCompletion.create({
    data: {
      learnerProfileId: params.learnerProfileId,
      learningActivityId: activity.id,
      completedAt: new Date(),
      score: score * 100,
      perStandardCorrectness: {
        [activity.standardLinks[0]?.standard.code ?? "unknown"]: score,
      },
      evidenceWritten: true,
    },
  });

  const standardCode = activity.standardLinks[0]?.standard.code;
  if (!standardCode) throw new Error("Activity has no linked standard");

  const observation = await recordStandardObservation({
    sessionId: params.sessionId,
    standardCode,
    evidenceTier: "GUIDED",
    sourceType: "ACTIVITY",
    sourceId: completion.id,
    correctness: score,
    notes: `Mini quiz ${activity.id} completed`,
  });

  return {
    score: Math.round(score * 100),
    total,
    correct,
    mastery: Math.round(observation.mastery),
  };
}
