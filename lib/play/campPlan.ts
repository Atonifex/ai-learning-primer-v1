/**
 * Deterministic Camp resource plan (lesson 1).
 * Budget first (no spend). Buy second (one affordable upgrade).
 * No LLM scoring. Same inputs always yield the same result.
 *
 * Lesson 1 codes (catalog, standards_math_grade3.ts):
 *   MA.3.NSO.2.1 add/subtract multi-digit
 *   MA.3.NSO.2.4 ×/÷ facts, factors 0–12
 *   MA.3.AR.1.2 one- and two-step real-world (× factors within 12)
 * Later, not scored here: MA.3.NSO.2.2 equal groups, MA.3.NSO.2.3 × tens.
 */

import { higherStage, type CampState } from "./camp";

export const CAMP_PLAN_ACTIVITY_SLUG = "g3-ma-camp-resource-plan" as const;
export const CAMP_PLAN_LEARNER_GOAL = "Plan what camp can afford" as const;
export const CAMP_PLAN_STANDARD_CODES = ["MA.3.NSO.2.1", "MA.3.NSO.2.4", "MA.3.AR.1.2"] as const;
export const CAMP_PLAN_LATER_CODES = ["MA.3.NSO.2.2", "MA.3.NSO.2.3"] as const;
export const CAMP_PLAN_STOCK_GRANT_ID = "camp-plan-stock" as const;

export const RESOURCE_KINDS = ["rations", "scrap", "timber", "canvas"] as const;
export type ResourceKind = (typeof RESOURCE_KINDS)[number];
export type ResourcePile = Record<ResourceKind, number>;

export const LESSON1_STOCK: ResourcePile = {
  rations: 48,
  scrap: 30,
  timber: 40,
  canvas: 16,
};

/** Meals that stay in camp and are not free to spend. 4 × 6 = 24. */
export const LESSON1_RATION_KEEP = { people: 4, days: 6 } as const;

export type UpgradeId =
  | "cook-fire"
  | "rain-cover"
  | "ration-stores"
  | "welcome-feast"
  | "storm-shelter";

export type CampUpgradeDef = {
  id: UpgradeId;
  label: string;
  blurb: string;
  cost: ResourcePile;
  /** Pixi / atlas token. Null when this rung cannot be bought in lesson 1. */
  world: "cook-fire" | "rain-cover" | "ration-stores" | null;
  /** Existing camp stage to raise when this upgrade is built. */
  worldStage: "fire" | null;
};

export const LESSON1_UPGRADES: readonly CampUpgradeDef[] = [
  {
    id: "cook-fire",
    label: "Cook fire",
    blurb: "A stone ring so we can cook.",
    cost: { rations: 0, scrap: 6, timber: 18, canvas: 0 },
    world: "cook-fire",
    worldStage: "fire",
  },
  {
    id: "rain-cover",
    label: "Rain cover",
    blurb: "Canvas over the crates.",
    cost: { rations: 0, scrap: 12, timber: 0, canvas: 8 },
    world: "rain-cover",
    worldStage: null,
  },
  {
    id: "ration-stores",
    label: "Ration stores",
    blurb: "A dry shelf for meals.",
    cost: { rations: 8, scrap: 15, timber: 24, canvas: 0 },
    world: "ration-stores",
    worldStage: null,
  },
  {
    id: "welcome-feast",
    label: "Welcome feast",
    blurb: "A big meal for a search party. It spends a lot of rations.",
    cost: { rations: 30, scrap: 4, timber: 0, canvas: 0 },
    world: null,
    worldStage: null,
  },
  {
    id: "storm-shelter",
    label: "Storm shelter",
    blurb: "A bigger roof. It needs a lot of canvas.",
    cost: { rations: 0, scrap: 24, timber: 28, canvas: 20 },
    world: null,
    worldStage: null,
  },
] as const;

export type BudgetFieldId =
  | "rationsToKeep"
  | "freeRations"
  | "extraDays"
  | "cookFireTimber"
  | "timberLeftAfterFire"
  | "stormCanvasNeeded"
  | "stormCanvasShort";

export type LessonOp = "multiply" | "divide" | "subtract";

export type LessonProblem = {
  id: BudgetFieldId;
  op: LessonOp;
  /** Catalog codes this item actually practices. */
  standards: readonly (typeof CAMP_PLAN_STANDARD_CODES)[number][];
  label: string;
  answer: number;
  hint: string;
};

export const LESSON1_PROBLEMS: readonly LessonProblem[] = [
  {
    id: "rationsToKeep",
    op: "multiply",
    standards: ["MA.3.NSO.2.4", "MA.3.AR.1.2"],
    label: "Rations to keep (4 people × 6 days)",
    answer: 24,
    hint: "4 people for 6 days. Multiply the two numbers.",
  },
  {
    id: "freeRations",
    op: "subtract",
    standards: ["MA.3.NSO.2.1", "MA.3.AR.1.2"],
    label: "Free rations (48 on hand − rations kept)",
    answer: 24,
    hint: "Start from 48 rations and subtract the rations you keep.",
  },
  {
    id: "extraDays",
    op: "divide",
    standards: ["MA.3.NSO.2.4", "MA.3.AR.1.2"],
    label: "Extra days if 4 people share the free rations",
    answer: 6,
    hint: "Share the free rations among 4 people. Divide.",
  },
  {
    id: "cookFireTimber",
    op: "multiply",
    standards: ["MA.3.NSO.2.4", "MA.3.AR.1.2"],
    label: "Cook fire timber (3 packs × 6)",
    answer: 18,
    hint: "3 packs with 6 timber in each pack. Multiply.",
  },
  {
    id: "timberLeftAfterFire",
    op: "subtract",
    standards: ["MA.3.NSO.2.1", "MA.3.AR.1.2"],
    label: "Timber left after the cook fire (40 − that timber)",
    answer: 22,
    hint: "Start from 40 timber and subtract the cook-fire timber.",
  },
  {
    id: "stormCanvasNeeded",
    op: "multiply",
    standards: ["MA.3.NSO.2.4", "MA.3.AR.1.2"],
    label: "Storm shelter canvas (5 packs × 4)",
    answer: 20,
    hint: "5 packs with 4 canvas in each pack. Multiply.",
  },
  {
    id: "stormCanvasShort",
    op: "subtract",
    standards: ["MA.3.NSO.2.1", "MA.3.AR.1.2"],
    label: "Canvas still short (canvas needed − 16 we have)",
    answer: 4,
    hint: "Subtract the 16 canvas we have from the canvas the shelter needs.",
  },
] as const;

/** Not part of lesson 1 scoring. Present so a later lesson can append a line. */
export type FutureCostLine =
  | {
      id: string;
      standard: "MA.3.NSO.2.2";
      kind: "equal_groups";
      groups: number;
      size: number;
    }
  | {
      id: string;
      standard: "MA.3.NSO.2.3";
      kind: "times_tens";
      digit: number;
      multipleOfTen: number;
    };

export const FUTURE_COST_LINES: readonly FutureCostLine[] = [
  { id: "equal-groups-example", standard: "MA.3.NSO.2.2", kind: "equal_groups", groups: 4, size: 3 },
  { id: "tens-example", standard: "MA.3.NSO.2.3", kind: "times_tens", digit: 6, multipleOfTen: 10 },
] as const;

export type CampBudgetAnswers = Record<BudgetFieldId, number> & {
  affordableIds: string[];
};

export const LESSON1_BUDGET_KEY: CampBudgetAnswers = {
  rationsToKeep: 24,
  freeRations: 24,
  extraDays: 6,
  cookFireTimber: 18,
  timberLeftAfterFire: 22,
  stormCanvasNeeded: 20,
  stormCanvasShort: 4,
  affordableIds: ["cook-fire", "rain-cover", "ration-stores"],
};

export type CampPlanState = {
  version: 1;
  layoutId: "camp-resource-v1";
  teachCompleted: boolean;
  budgetPassed: boolean;
  purchasedUpgradeId: UpgradeId | null;
};

export type BudgetFieldResult = { correct: boolean; feedback: string | null };

export type BudgetEvaluation = {
  pass: boolean;
  fields: Record<BudgetFieldId, BudgetFieldResult>;
  affordableCorrect: boolean;
  affordableFeedback: string | null;
  /** Set only after a correct plan, so the buy step can name real choices. */
  summary: string | null;
};

const UPGRADE_BY_ID = new Map(LESSON1_UPGRADES.map((row) => [row.id, row]));

export function emptyCampPlan(): CampPlanState {
  return {
    version: 1,
    layoutId: "camp-resource-v1",
    teachCompleted: false,
    budgetPassed: false,
    purchasedUpgradeId: null,
  };
}

export function upgradeById(id: string): CampUpgradeDef | null {
  return UPGRADE_BY_ID.get(id as UpgradeId) ?? null;
}

export function lesson1ScoredStandards(): string[] {
  const found = new Set<string>();
  for (const problem of LESSON1_PROBLEMS) {
    for (const code of problem.standards) found.add(code);
  }
  return CAMP_PLAN_STANDARD_CODES.filter((code) => found.has(code));
}

export function rationsToKeep(): number {
  return LESSON1_RATION_KEEP.people * LESSON1_RATION_KEEP.days;
}

export function freePile(stock: ResourcePile = LESSON1_STOCK): ResourcePile {
  return { ...stock, rations: stock.rations - rationsToKeep() };
}

export function canAfford(cost: ResourcePile, stock: ResourcePile = LESSON1_STOCK): boolean {
  const free = freePile(stock);
  return RESOURCE_KINDS.every((kind) => cost[kind] <= free[kind]);
}

export function affordableUpgradeIds(stock: ResourcePile = LESSON1_STOCK): UpgradeId[] {
  return LESSON1_UPGRADES.filter((row) => canAfford(row.cost, stock)).map((row) => row.id);
}

export function subtractPile(stock: ResourcePile, cost: ResourcePile): ResourcePile {
  const next = { ...stock };
  for (const kind of RESOURCE_KINDS) next[kind] = stock[kind] - cost[kind];
  return next;
}

export function remainderAfterPurchase(upgradeId: string): ResourcePile | null {
  const upgrade = upgradeById(upgradeId);
  if (!upgrade || !canAfford(upgrade.cost)) return null;
  return subtractPile(LESSON1_STOCK, upgrade.cost);
}

function sameIdSet(left: readonly string[], right: readonly string[]): boolean {
  const a = [...new Set(left)].sort();
  const b = [...new Set(right)].sort();
  return a.length === b.length && a.every((id, index) => id === b[index]);
}

function affordableFeedback(submitted: readonly string[]): string {
  if (submitted.includes("welcome-feast")) {
    return "The welcome feast spends rations we must keep for meals. It does not fit.";
  }
  if (submitted.includes("storm-shelter")) {
    return "The storm shelter needs more canvas than we have. It does not fit.";
  }
  const truth = affordableUpgradeIds();
  if (truth.some((id) => !submitted.includes(id))) {
    return "One upgrade we can pay for is still unmarked.";
  }
  return "Compare each cost with what we can spend. Kept meals are not free.";
}

export function evaluateBudget(answers: CampBudgetAnswers): BudgetEvaluation {
  const fields = {} as Record<BudgetFieldId, BudgetFieldResult>;
  let fieldsOk = true;
  for (const problem of LESSON1_PROBLEMS) {
    const correct = answers[problem.id] === problem.answer;
    if (!correct) fieldsOk = false;
    fields[problem.id] = { correct, feedback: correct ? null : problem.hint };
  }
  const affordableCorrect = sameIdSet(answers.affordableIds, LESSON1_BUDGET_KEY.affordableIds);
  const pass = fieldsOk && affordableCorrect;
  return {
    pass,
    fields,
    affordableCorrect,
    affordableFeedback: affordableCorrect ? null : affordableFeedback(answers.affordableIds),
    summary: pass
      ? "We can afford the cook fire, the rain cover, and the ration stores. The welcome feast spends kept meals. The storm shelter needs more canvas. Choose one upgrade to build."
      : null,
  };
}

export function parseBudgetAnswers(raw: unknown): CampBudgetAnswers | null {
  if (!raw || typeof raw !== "object") return null;
  const body = raw as Record<string, unknown>;
  const answers = {} as CampBudgetAnswers;
  for (const problem of LESSON1_PROBLEMS) {
    const value = body[problem.id];
    if (typeof value !== "number" || !Number.isInteger(value)) return null;
    answers[problem.id] = value;
  }
  if (!Array.isArray(body.affordableIds) || body.affordableIds.some((id) => typeof id !== "string")) {
    return null;
  }
  answers.affordableIds = body.affordableIds as string[];
  return answers;
}

export function markTeachCompleted(state: CampPlanState): CampPlanState {
  return { ...state, teachCompleted: true };
}

export function markBudgetPassed(state: CampPlanState): CampPlanState {
  return { ...state, budgetPassed: true };
}

export function purchaseUpgrade(
  state: CampPlanState,
  upgradeId: string
): { ok: true; state: CampPlanState } | { ok: false; error: string } {
  if (!state.budgetPassed) return { ok: false, error: "Finish the budget before you build." };
  if (state.purchasedUpgradeId) {
    if (state.purchasedUpgradeId === upgradeId) return { ok: true, state };
    return { ok: false, error: "Camp already built an upgrade from this plan." };
  }
  const upgrade = upgradeById(upgradeId);
  if (!upgrade || !upgrade.world) return { ok: false, error: "That upgrade is not one we can build from this plan." };
  if (!canAfford(upgrade.cost)) return { ok: false, error: "That upgrade costs more than camp can spend." };
  return { ok: true, state: { ...state, purchasedUpgradeId: upgrade.id } };
}

export function parseCampPlan(raw: unknown): CampPlanState {
  const base = emptyCampPlan();
  if (!raw || typeof raw !== "object") return base;
  const row = raw as Record<string, unknown>;
  const purchased = typeof row.purchasedUpgradeId === "string" ? upgradeById(row.purchasedUpgradeId) : null;
  return {
    version: 1,
    layoutId: "camp-resource-v1",
    teachCompleted: row.teachCompleted === true || row.budgetPassed === true || Boolean(purchased),
    budgetPassed: row.budgetPassed === true || Boolean(purchased),
    purchasedUpgradeId: purchased?.id ?? null,
  };
}

export function campUpgradeKind(state: CampPlanState): "none" | "cook-fire" | "rain-cover" | "ration-stores" {
  const upgrade = state.purchasedUpgradeId ? upgradeById(state.purchasedUpgradeId) : null;
  return upgrade?.world ?? "none";
}

export function campUpgradeDescription(kind: ReturnType<typeof campUpgradeKind>): string | null {
  if (kind === "cook-fire") return "Cook fire is lit. We spent timber and scrap the plan could afford.";
  if (kind === "rain-cover") return "Rain cover is up. We spent canvas and scrap the plan could afford.";
  if (kind === "ration-stores") return "Ration stores are built. Meals have a dry shelf we could afford.";
  return null;
}

/** × tens only when the multiple is 10–90 or 100–900, matching MA.3.NSO.2.3. */
export function evaluateFutureCostLine(line: FutureCostLine): number {
  if (line.kind === "equal_groups") {
    if (line.groups < 0 || line.groups > 12 || line.size < 0 || line.size > 12) {
      throw new Error("equal_groups factors must be from 0 to 12");
    }
    return line.groups * line.size;
  }
  const tensOk =
    (line.multipleOfTen >= 10 && line.multipleOfTen <= 90 && line.multipleOfTen % 10 === 0) ||
    (line.multipleOfTen >= 100 && line.multipleOfTen <= 900 && line.multipleOfTen % 100 === 0);
  if (line.digit < 1 || line.digit > 9 || !tensOk) {
    throw new Error("times_tens needs a one-digit factor and a multiple of 10 or 100 in the catalog range");
  }
  return line.digit * line.multipleOfTen;
}

export function lessonStockOnCamp(camp: CampState): CampState {
  if (camp.appliedGrantIds.includes(CAMP_PLAN_STOCK_GRANT_ID)) return camp;
  return {
    ...camp,
    rations: LESSON1_STOCK.rations,
    scrap: LESSON1_STOCK.scrap,
    timber: LESSON1_STOCK.timber,
    canvas: LESSON1_STOCK.canvas,
    appliedGrantIds: [...camp.appliedGrantIds, CAMP_PLAN_STOCK_GRANT_ID],
  };
}

export function applyPurchaseToCamp(camp: CampState, upgradeId: string): CampState {
  const upgrade = upgradeById(upgradeId);
  const remainder = remainderAfterPurchase(upgradeId);
  if (!upgrade || !remainder) return camp;
  const marked = lessonStockOnCamp(camp);
  return {
    ...marked,
    rations: remainder.rations,
    scrap: remainder.scrap,
    timber: remainder.timber,
    canvas: remainder.canvas,
    stage: upgrade.worldStage ? higherStage(marked.stage, upgrade.worldStage) : marked.stage,
  };
}

/** Stock while budgeting. After a purchase, camp shows the remainder and does not jump back. */
export function syncCampToPlan(camp: CampState, plan: CampPlanState): CampState {
  if (plan.purchasedUpgradeId) return applyPurchaseToCamp(camp, plan.purchasedUpgradeId);
  if (plan.teachCompleted) return lessonStockOnCamp(camp);
  return camp;
}
