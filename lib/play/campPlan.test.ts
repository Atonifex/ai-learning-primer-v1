import { describe, expect, it } from "vitest";
import { emptyCamp, higherStage } from "./camp";
import {
  affordableUpgradeIds,
  applyPurchaseToCamp,
  CAMP_PLAN_LATER_CODES,
  CAMP_PLAN_LEARNER_GOAL,
  CAMP_PLAN_STANDARD_CODES,
  canAfford,
  evaluateBudget,
  evaluateFutureCostLine,
  FUTURE_COST_LINES,
  lesson1ScoredStandards,
  LESSON1_BUDGET_KEY,
  LESSON1_PROBLEMS,
  LESSON1_STOCK,
  LESSON1_UPGRADES,
  parseCampPlan,
  purchaseUpgrade,
  remainderAfterPurchase,
  syncCampToPlan,
  upgradeById,
  markBudgetPassed,
  markTeachCompleted,
  emptyCampPlan,
} from "./campPlan";

describe("campPlan", () => {
  it("locks lesson 1 to catalog add/subtract, fact fluency, and two-step problems", () => {
    expect(CAMP_PLAN_LEARNER_GOAL).toBe("Plan what camp can afford");
    expect([...CAMP_PLAN_STANDARD_CODES]).toEqual(["MA.3.NSO.2.1", "MA.3.NSO.2.4", "MA.3.AR.1.2"]);
    expect(lesson1ScoredStandards()).toEqual([...CAMP_PLAN_STANDARD_CODES]);
    expect([...CAMP_PLAN_LATER_CODES]).toEqual(["MA.3.NSO.2.2", "MA.3.NSO.2.3"]);
    expect(lesson1ScoredStandards().some((code) => CAMP_PLAN_LATER_CODES.includes(code as "MA.3.NSO.2.2"))).toBe(
      false
    );
    expect(LESSON1_PROBLEMS.every((problem) => problem.standards.every((code) => CAMP_PLAN_STANDARD_CODES.includes(code)))).toBe(
      true
    );
  });

  it("keeps later equal-groups and times-tens lines out of the lesson and ready to score", () => {
    expect(FUTURE_COST_LINES.map((line) => line.standard)).toEqual(["MA.3.NSO.2.2", "MA.3.NSO.2.3"]);
    expect(LESSON1_PROBLEMS.map((problem) => problem.id)).not.toContain("equal-groups-example");
    const groups = FUTURE_COST_LINES[0];
    const tens = FUTURE_COST_LINES[1];
    expect(groups.kind).toBe("equal_groups");
    expect(tens.kind).toBe("times_tens");
    if (groups.kind === "equal_groups") expect(evaluateFutureCostLine(groups)).toBe(12);
    if (tens.kind === "times_tens") expect(evaluateFutureCostLine(tens)).toBe(60);
  });

  it("marks the same three upgrades affordable every time", () => {
    expect(affordableUpgradeIds()).toEqual(["cook-fire", "rain-cover", "ration-stores"]);
    expect(canAfford(upgradeById("welcome-feast")!.cost)).toBe(false);
    expect(canAfford(upgradeById("storm-shelter")!.cost)).toBe(false);
    expect(affordableUpgradeIds(LESSON1_STOCK)).toEqual(affordableUpgradeIds());
  });

  it("passes only the authored budget key", () => {
    expect(evaluateBudget(LESSON1_BUDGET_KEY).pass).toBe(true);
    expect(evaluateBudget(LESSON1_BUDGET_KEY).summary).toMatch(/cook fire/i);
    const wrong = { ...LESSON1_BUDGET_KEY, rationsToKeep: 20 };
    const missed = evaluateBudget(wrong);
    expect(missed.pass).toBe(false);
    expect(missed.summary).toBeNull();
    expect(missed.fields.rationsToKeep.feedback).toMatch(/multiply/i);
    const feast = evaluateBudget({ ...LESSON1_BUDGET_KEY, affordableIds: [...LESSON1_BUDGET_KEY.affordableIds, "welcome-feast"] });
    expect(feast.pass).toBe(false);
    expect(feast.affordableFeedback).toMatch(/rations we must keep/i);
  });

  it("spends one affordable upgrade and leaves the authored remainder", () => {
    const planned = markBudgetPassed(markTeachCompleted(emptyCampPlan()));
    const bought = purchaseUpgrade(planned, "cook-fire");
    expect(bought.ok).toBe(true);
    if (!bought.ok) return;
    expect(bought.state.purchasedUpgradeId).toBe("cook-fire");
    expect(remainderAfterPurchase("cook-fire")).toEqual({ rations: 48, scrap: 24, timber: 22, canvas: 16 });
    expect(purchaseUpgrade(bought.state, "rain-cover").ok).toBe(false);
    expect(purchaseUpgrade(planned, "storm-shelter").ok).toBe(false);
    expect(purchaseUpgrade(emptyCampPlan(), "cook-fire").ok).toBe(false);
  });

  it("sets camp to the counted pile, then to the remainder, and does not refill after a purchase", () => {
    const camp = emptyCamp();
    const teaching = syncCampToPlan(camp, markTeachCompleted(emptyCampPlan()));
    expect(teaching.rations).toBe(48);
    expect(teaching.timber).toBe(40);
    const bought = syncCampToPlan(teaching, {
      ...markBudgetPassed(markTeachCompleted(emptyCampPlan())),
      purchasedUpgradeId: "cook-fire",
    });
    expect(bought.timber).toBe(22);
    expect(bought.scrap).toBe(24);
    expect(bought.stage).toBe("fire");
    expect(bought.stage).toBe(higherStage("tent", "fire"));
    const again = syncCampToPlan(bought, parseCampPlan({ purchasedUpgradeId: "cook-fire", budgetPassed: true }));
    expect(again.timber).toBe(22);
    expect(applyPurchaseToCamp(bought, "rain-cover").canvas).toBe(8);
  });

  it("round-trips a saved plan", () => {
    const parsed = parseCampPlan({
      teachCompleted: true,
      budgetPassed: true,
      purchasedUpgradeId: "rain-cover",
    });
    expect(parsed.purchasedUpgradeId).toBe("rain-cover");
    expect(parseCampPlan({ purchasedUpgradeId: "not-real" }).purchasedUpgradeId).toBeNull();
    expect(LESSON1_UPGRADES).toHaveLength(5);
  });
});
