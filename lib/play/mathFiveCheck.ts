/**
 * Fixed five-question math check. Codes are the tonight slice only.
 * MA.3.NSO.1.1, MA.3.NSO.2.2, MA.3.NSO.1.2, MA.3.NSO.1.3, MA.3.NSO.2.1.
 * A first miss on place-value forms asks one more item of that same code.
 * Two misses there stop. This module never returns a Grade 2 code.
 */

import type { MathPlacement } from "./mathDiagnostic";
import { isTonightSliceCode } from "../curriculum/tonightSlice";

export const MATH_FIVE_TOTAL = 5;

export const MATH_FIVE_CODES = [
  "MA.3.NSO.1.1",
  "MA.3.NSO.2.2",
  "MA.3.NSO.1.2",
  "MA.3.NSO.1.3",
  "MA.3.NSO.2.1",
] as const;

export type MathCheckItem = {
  id: string;
  standardCode: (typeof MATH_FIVE_CODES)[number];
  floor: boolean;
  skill: string;
  example: string;
  prompt: string;
  choices: [string, string, string];
  correctIndex: 0 | 1 | 2;
};

export type PublicMathCheckItem = {
  id: string;
  skill: string;
  example: string;
  prompt: string;
  choices: [string, string, string];
};

export type MathFiveAnswer = {
  itemId: string;
  choiceIndex: number;
};

const FLOOR: MathCheckItem = {
  id: "forms-a",
  standardCode: "MA.3.NSO.1.1",
  floor: true,
  skill: "writing numbers in different forms",
  example: "2,000 + 300 + 40 + 6 is written 2,346.",
  prompt: "How do you write 1,000 + 200 + 30 + 5?",
  choices: ["1,235", "12,305", "1,200,305"],
  correctIndex: 0,
};

const FLOOR_RETRY: MathCheckItem = {
  id: "forms-b",
  standardCode: "MA.3.NSO.1.1",
  floor: true,
  skill: "writing numbers in different forms",
  example: "Five hundred sixty-one is 500 + 60 + 1.",
  prompt: "Which is 432 in expanded form?",
  choices: ["4 + 3 + 2", "400 + 3 + 2", "400 + 30 + 2"],
  correctIndex: 2,
};

const GROUPS: MathCheckItem = {
  id: "groups",
  standardCode: "MA.3.NSO.2.2",
  floor: false,
  skill: "equal groups",
  example: "6 groups of 4 biscuits is 6 × 4 = 24.",
  prompt: "3 groups of 5 biscuits is which equation?",
  choices: ["3 + 5 = 8", "3 × 5 = 15", "3 × 5 = 35"],
  correctIndex: 1,
};

const COMPOSE: MathCheckItem = {
  id: "compose",
  standardCode: "MA.3.NSO.1.2",
  floor: false,
  skill: "building four-digit numbers",
  example: "2,340 is 2 thousands + 3 hundreds + 4 tens.",
  prompt: "Which is another way to show 1,250?",
  choices: [
    "12 thousands + 5 tens",
    "1 thousand + 25 hundreds",
    "1 thousand + 2 hundreds + 5 tens",
  ],
  correctIndex: 2,
};

const COMPARE: MathCheckItem = {
  id: "compare",
  standardCode: "MA.3.NSO.1.3",
  floor: false,
  skill: "comparing numbers to 10,000",
  example: "3,420 is less than 3,510, so 3,420 < 3,510.",
  prompt: "Which symbol makes this true?  4,080 ___ 4,800",
  choices: ["<", ">", "="],
  correctIndex: 0,
};

const ADD: MathCheckItem = {
  id: "add",
  standardCode: "MA.3.NSO.2.1",
  floor: false,
  skill: "adding multi-digit numbers",
  example: "240 + 130 = 370.",
  prompt: "What is 356 + 120?",
  choices: ["466", "476", "376"],
  correctIndex: 1,
};

/** Pass the first item: the other four codes. Miss it: one retry, then three codes. */
const PASS_PATH: readonly MathCheckItem[] = [FLOOR, GROUPS, COMPOSE, COMPARE, ADD];
const RETRY_PATH: readonly MathCheckItem[] = [FLOOR, FLOOR_RETRY, GROUPS, COMPOSE, COMPARE];

const BY_ID = new Map<string, MathCheckItem>(
  [FLOOR, FLOOR_RETRY, GROUPS, COMPOSE, COMPARE, ADD].map((item) => [item.id, item])
);

export function mathFiveCodesAreTonightSlice(): boolean {
  return MATH_FIVE_CODES.every((code) => isTonightSliceCode(code));
}

export function toPublicMathCheckItem(item: MathCheckItem): PublicMathCheckItem {
  return {
    id: item.id,
    skill: item.skill,
    example: item.example,
    prompt: item.prompt,
    choices: item.choices,
  };
}

export function mathFiveChildLine(placement: MathPlacement): string | null {
  if (placement.status === "in_progress") return null;
  if (placement.status === "below_catalog") {
    return "Let's build this together. Start with hundreds, tens, and ones. You can use the example below, then try a new number. This short check does not decide your school grade.";
  }
  const skill = BY_ID.get(
    [...BY_ID.values()].find((item) => item.standardCode === placement.standardCode)?.id ?? ""
  )?.skill;
  const words = skill ?? "the next math idea";
  if (placement.status === "above_ladder") {
    return `You used these examples well, through ${words}. A fresh problem is next; five answers do not tell us everything yet.`;
  }
  return `We'll start with ${words}.`;
}

type Scored = { item: MathCheckItem; correct: boolean };

function pathFor(scored: Scored[]): readonly MathCheckItem[] {
  if (scored.length === 0 || scored[0]?.correct) return PASS_PATH;
  return RETRY_PATH;
}

function twoFloorMisses(scored: Scored[]): boolean {
  return (
    scored.length >= 2 &&
    scored[0]?.item.floor === true &&
    scored[1]?.item.floor === true &&
    !scored[0].correct &&
    !scored[1].correct
  );
}

export function placementFromFive(scored: Scored[]): MathPlacement {
  if (scored.length === 0) return { status: "in_progress" };
  if (twoFloorMisses(scored)) return { status: "below_catalog" };
  const path = pathFor(scored);
  if (scored.length < path.length) return { status: "in_progress" };
  const floorClearedAt = scored[0]?.correct ? 0 : 2;
  const miss = scored.find((row, index) => index >= floorClearedAt && !row.correct);
  if (!miss) {
    const last = scored[scored.length - 1];
    if (!last) return { status: "in_progress" };
    if (scored[0]?.correct) {
      return { status: "above_ladder", standardCode: last.item.standardCode, rung: scored.length - 1 };
    }
    return { status: "ready", standardCode: "MA.3.NSO.2.1", rung: 4 };
  }
  return { status: "ready", standardCode: miss.item.standardCode, rung: MATH_FIVE_CODES.indexOf(miss.item.standardCode) };
}

export type MathFiveScore =
  | {
      ok: true;
      scored: { itemId: string; standardCode: string; correct: boolean }[];
      placement: MathPlacement;
      nextItem: PublicMathCheckItem | null;
      asked: number;
      questionNumber: number;
      total: number;
      lastCorrect: boolean | null;
      childLine: string | null;
      feedback: string | null;
    }
  | { ok: false; error: string };

export function scoreMathFiveCheck(answers: MathFiveAnswer[]): MathFiveScore {
  if (!Array.isArray(answers) || answers.length > MATH_FIVE_TOTAL) return { ok: false, error: "This check has up to five questions." };
  const scored: Scored[] = [];
  for (const answer of answers) {
    if (!answer || typeof answer !== "object") return { ok: false, error: "Pick one of the three choices." };
    if (placementFromFive(scored).status !== "in_progress") {
      return { ok: false, error: "The check is already finished." };
    }
    const expected = pathFor(scored)[scored.length];
    if (!expected || answer.itemId !== expected.id) {
      return { ok: false, error: "That question is not next." };
    }
    if (answer.choiceIndex !== 0 && answer.choiceIndex !== 1 && answer.choiceIndex !== 2) {
      return { ok: false, error: "Pick one of the three choices." };
    }
    scored.push({ item: expected, correct: answer.choiceIndex === expected.correctIndex });
  }

  const placement = placementFromFive(scored);
  const next = placement.status === "in_progress" ? pathFor(scored)[scored.length] : undefined;
  const last = scored[scored.length - 1];
  return {
    ok: true,
    scored: scored.map((row) => ({
      itemId: row.item.id,
      standardCode: row.item.standardCode,
      correct: row.correct,
    })),
    placement,
    nextItem: next ? toPublicMathCheckItem(next) : null,
    asked: scored.length,
    questionNumber: next ? scored.length + 1 : Math.min(scored.length, MATH_FIVE_TOTAL),
    total: MATH_FIVE_TOTAL,
    lastCorrect: last ? last.correct : null,
    childLine: mathFiveChildLine(placement),
    feedback: last ? (last.correct ? "That works. Try the next idea." : `Let's look: ${last.item.choices[last.item.correctIndex]} is the answer. ${last.item.example}`) : null,
  };
}

export function openingMathFiveItem(): PublicMathCheckItem {
  return toPublicMathCheckItem(FLOOR);
}

export function mathFiveItemForCode(code: string): MathCheckItem | null {
  return [...BY_ID.values()].find((item) => item.standardCode === code) ?? null;
}
