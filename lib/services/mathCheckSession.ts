import { NextResponse } from "next/server";
import { prisma } from "../db/prisma";
import {
  mathFiveChildLine,
  openingMathFiveItem,
  scoreMathFiveCheck,
  type MathFiveAnswer,
} from "../play/mathFiveCheck";
import type { MathPlacement } from "../play/mathDiagnostic";
import { recordStandardObservation } from "./standardsProgress";
import { applyCampGrantToLearner } from "./camp";
import { MATH_CHECK_CAMP_LINE, MATH_CHECK_GRANT } from "../play/camp";

const MATH_CATALOG = "math_g3";
export const mathCheckMemoryId = (profileId: string) => `${profileId}:math-check:v1`;

function readMathAnswers(content: string): MathFiveAnswer[] {
  const parsed = JSON.parse(content);
  const result = scoreMathFiveCheck(parsed.answers);
  if (!result.ok) throw new Error("This saved check could not be read.");
  return parsed.answers;
}

export async function loadMathCheck(profileId: string, sessionId: string) {
  const snapshot = await prisma.memoryItem.findUnique({ where: { id: mathCheckMemoryId(profileId) } });
  if (snapshot) {
    const result = await submitMathFiveCheck({ profileId, sessionId: snapshot.sourceSessionId ?? sessionId, answers: readMathAnswers(snapshot.content) });
    if (result.status === 400) throw new Error("This saved check could not be read.");
    return result.body;
  }
  const saved = await loadMathPlacement(profileId);
  const placement = restoredPlacement(saved.code, saved.status);
  return placement ? savedMathCheckPayload(placement) : openingMathCheckPayload();
}

export async function loadMathPlacement(profileId: string): Promise<{
  code: string | null;
  status: string | null;
}> {
  const row = await prisma.learnerProfile.findUnique({
    where: { id: profileId },
    select: { mathPlacementCode: true, mathPlacementStatus: true },
  });
  return {
    code: row?.mathPlacementCode ?? null,
    status: row?.mathPlacementStatus ?? null,
  };
}

export function restoredPlacement(code: string | null, status: string | null): MathPlacement | null {
  if (status === "below_catalog") return { status: "below_catalog" };
  if ((status === "ready" || status === "above_ladder") && code?.trim()) {
    return { status, standardCode: code, rung: 0 };
  }
  return null;
}

export function openingMathCheckPayload() {
  return {
    item: openingMathFiveItem(),
    placement: { status: "in_progress" as const },
    childLine: null,
    lastCorrect: null,
    questionNumber: 1,
    asked: 0,
    total: 5,
    saved: false,
    answers: [],
  };
}

export async function submitMathFiveCheck(input: {
  sessionId: string;
  profileId: string;
  answers: MathFiveAnswer[];
}) {
  const scored = scoreMathFiveCheck(input.answers);
  if (!scored.ok) return { error: scored.error, status: 400 as const };

  const id = mathCheckMemoryId(input.profileId);
  await prisma.$transaction(async (tx) => {
    const previous = await tx.memoryItem.findUnique({ where: { id } });
    const answers = previous ? readMathAnswers(previous.content) : [];
    if (input.answers.length < answers.length || input.answers.length > answers.length + 1 || answers.some((answer, index) => answer.itemId !== input.answers[index]?.itemId || answer.choiceIndex !== input.answers[index]?.choiceIndex)) {
      throw new Error("This check changed in another window. Reopen it to continue.");
    }
    await tx.memoryItem.upsert({ where: { id }, create: { id, learnerProfileId: input.profileId, type: "PREFERENCE", sourceSessionId: input.sessionId, content: JSON.stringify({ answers: input.answers }) }, update: { content: JSON.stringify({ answers: input.answers }) } });
  }, { isolationLevel: "Serializable" });

  if (scored.placement.status === "in_progress") {
    return {
      status: 200 as const,
      body: {
        item: scored.nextItem,
        placement: scored.placement,
        childLine: scored.childLine,
        lastCorrect: scored.lastCorrect,
        feedback: scored.feedback,
        questionNumber: scored.questionNumber,
        asked: scored.asked,
        total: scored.total,
        saved: true,
        answers: input.answers,
      },
    };
  }

  for (const row of scored.scored) {
    const notes = `math-five:${row.itemId}`;
    const existing = await prisma.standardsEvidence.findFirst({
      where: { learnerProfileId: input.profileId, notes },
      select: { id: true },
    });
    if (existing) continue;
    await recordStandardObservation({
      sessionId: input.sessionId,
      standardCode: row.standardCode,
      evidenceTier: "GUIDED",
      sourceType: "ASSESSMENT",
      sourceId: row.itemId,
      correctness: row.correct ? 1 : 0,
      notes,
      catalogSubjectSlug: MATH_CATALOG,
      idempotencyKey: `${input.profileId}:math-five:v1:${row.itemId}`,
    });
  }

  await prisma.learnerProfile.update({
    where: { id: input.profileId },
    data: {
      mathPlacementStatus: scored.placement.status,
      mathPlacementCode:
        scored.placement.status === "below_catalog" ? null : scored.placement.standardCode,
    },
  });
  await applyCampGrantToLearner(input.profileId, MATH_CHECK_GRANT);

  return {
    status: 200 as const,
    body: {
      item: null,
      placement: scored.placement,
      childLine: scored.childLine,
      campLine: MATH_CHECK_CAMP_LINE,
      lastCorrect: scored.lastCorrect,
      feedback: scored.feedback,
      questionNumber: scored.questionNumber,
      asked: scored.asked,
      total: scored.total,
      saved: true,
      answers: input.answers,
    },
  };
}

export function savedMathCheckPayload(placement: MathPlacement) {
  return {
    item: null,
    placement,
    childLine: mathFiveChildLine(placement),
    campLine: MATH_CHECK_CAMP_LINE,
    lastCorrect: null,
    questionNumber: 5,
    asked: 5,
    total: 5,
    saved: true,
    answers: [],
  };
}

export function mathCheckError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
