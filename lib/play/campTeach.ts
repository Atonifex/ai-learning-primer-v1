/**
 * Teach/practice beats before the camp budget apply step.
 * Codes: MA.3.NSO.2.1, MA.3.NSO.2.4, MA.3.AR.1.2.
 */

import {
  CAMP_PLAN_LEARNER_GOAL,
  CAMP_PLAN_STANDARD_CODES,
  LESSON1_BUDGET_KEY,
  LESSON1_PROBLEMS,
  type BudgetFieldId,
} from "./campPlan";

export { CAMP_PLAN_LEARNER_GOAL, CAMP_PLAN_STANDARD_CODES };

export type CampTeachBeat = {
  id: string;
  kind: "hook" | "model" | "practice" | "ready";
  title: string;
  body: string;
  /** Practice beats require this integer before continue. */
  answer?: number;
  fieldId?: BudgetFieldId;
  standards?: readonly (typeof CAMP_PLAN_STANDARD_CODES)[number][];
  hint?: string;
  continueLabel: string;
};

const problem = (id: BudgetFieldId) => LESSON1_PROBLEMS.find((row) => row.id === id)!;

export const CAMP_TEACH_BEATS: readonly CampTeachBeat[] = [
  {
    id: "hook",
    kind: "hook",
    title: "Food and materials",
    body:
      "Food will not last, and the camp still needs a real upgrade. We counted a salvage pile: 48 rations, 30 scrap, 40 timber, and 16 canvas. First we plan what we can afford. Then we build one upgrade.",
    continueLabel: "How do we plan?",
  },
  {
    id: "model",
    kind: "model",
    title: "Keep meals, then spend",
    body:
      "4 people need meals for 6 days. 4 × 6 = 24 rations stay for meals. 48 − 24 = 24 rations are free to spend. An upgrade fits only when every material it needs is no more than what we can spend.",
    standards: ["MA.3.NSO.2.1", "MA.3.NSO.2.4", "MA.3.AR.1.2"],
    continueLabel: "Try the operations",
  },
  {
    id: "practice-timber-packs",
    kind: "practice",
    title: "Cook fire timber",
    body: "The cook fire uses 3 packs of timber, with 6 timber in each pack. How much timber is that?",
    fieldId: "cookFireTimber",
    answer: LESSON1_BUDGET_KEY.cookFireTimber,
    standards: problem("cookFireTimber").standards,
    hint: problem("cookFireTimber").hint,
    continueLabel: "Next",
  },
  {
    id: "practice-timber-left",
    kind: "practice",
    title: "Timber left",
    body: "We have 40 timber. The cook fire uses 18. How much timber is left?",
    fieldId: "timberLeftAfterFire",
    answer: LESSON1_BUDGET_KEY.timberLeftAfterFire,
    standards: problem("timberLeftAfterFire").standards,
    hint: problem("timberLeftAfterFire").hint,
    continueLabel: "Next",
  },
  {
    id: "practice-extra-days",
    kind: "practice",
    title: "Share the free rations",
    body: "24 free rations are shared by 4 people. How many extra days is that?",
    fieldId: "extraDays",
    answer: LESSON1_BUDGET_KEY.extraDays,
    standards: problem("extraDays").standards,
    hint: problem("extraDays").hint,
    continueLabel: "Next",
  },
  {
    id: "practice-canvas",
    kind: "practice",
    title: "Storm shelter canvas",
    body: "The storm shelter needs 5 packs of canvas, with 4 canvas in each pack. How much canvas is that?",
    fieldId: "stormCanvasNeeded",
    answer: LESSON1_BUDGET_KEY.stormCanvasNeeded,
    standards: problem("stormCanvasNeeded").standards,
    hint: problem("stormCanvasNeeded").hint,
    continueLabel: "Next",
  },
  {
    id: "practice-canvas-short",
    kind: "practice",
    title: "Canvas short",
    body: "The shelter needs 20 canvas. We have 16. How many canvas are we short?",
    fieldId: "stormCanvasShort",
    answer: LESSON1_BUDGET_KEY.stormCanvasShort,
    standards: problem("stormCanvasShort").standards,
    hint: problem("stormCanvasShort").hint,
    continueLabel: "Ready to budget",
  },
  {
    id: "ready",
    kind: "ready",
    title: "Budget, then build",
    body:
      "Goal: Plan what camp can afford. Next you work the whole pile, mark which upgrades fit, and only then spend on one we can build.",
    continueLabel: "Open the budget",
  },
] as const;

export function campTeachBeatCount(): number {
  return CAMP_TEACH_BEATS.length;
}

export function campTeachStandards(): string[] {
  const found = new Set<string>();
  for (const beat of CAMP_TEACH_BEATS) {
    for (const code of beat.standards ?? []) found.add(code);
  }
  return CAMP_PLAN_STANDARD_CODES.filter((code) => found.has(code));
}

export function isCorrectCampTeachAnswer(beatId: string, value: number): boolean {
  const beat = CAMP_TEACH_BEATS.find((row) => row.id === beatId);
  return beat?.answer === value;
}
