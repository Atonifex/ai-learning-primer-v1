import { describe, expect, it } from "vitest";
import {
  CAMP_PLAN_LATER_CODES,
  CAMP_PLAN_STANDARD_CODES,
} from "./campPlan";
import {
  CAMP_PLAN_LEARNER_GOAL,
  CAMP_TEACH_BEATS,
  campTeachBeatCount,
  campTeachStandards,
  isCorrectCampTeachAnswer,
} from "./campTeach";

describe("campTeach", () => {
  it("faces the camp goal and the locked codes before the budget", () => {
    expect(CAMP_PLAN_LEARNER_GOAL).toBe("Plan what camp can afford");
    expect(campTeachStandards()).toEqual([...CAMP_PLAN_STANDARD_CODES]);
    expect(campTeachBeatCount()).toBeGreaterThanOrEqual(6);
    expect(CAMP_TEACH_BEATS.some((beat) => beat.kind === "practice" && beat.answer != null)).toBe(true);
    expect(CAMP_TEACH_BEATS.at(-1)?.continueLabel).toMatch(/budget/i);
    expect(campTeachStandards().some((code) => (CAMP_PLAN_LATER_CODES as readonly string[]).includes(code))).toBe(
      false
    );
  });

  it("accepts the cook-fire timber product and rejects a wrong product", () => {
    expect(isCorrectCampTeachAnswer("practice-timber-packs", 18)).toBe(true);
    expect(isCorrectCampTeachAnswer("practice-timber-packs", 9)).toBe(false);
    expect(isCorrectCampTeachAnswer("practice-canvas-short", 4)).toBe(true);
  });
});
