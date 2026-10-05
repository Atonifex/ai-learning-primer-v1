import { describe, expect, it } from "vitest";
import { isTonightSliceCode } from "../curriculum/tonightSlice";
import { freshMathDiagnostic } from "./mathDiagnostic";
import {
  MATH_PRACTICE,
  practiceFeedback,
  practiceForPlacement,
  practiceIsANewCase,
} from "./mathPractice";

describe("math practice after placement", () => {
  it("waits for a starting point and uses a new case on a seeded code", () => {
    expect(practiceForPlacement(freshMathDiagnostic().placement)).toBeNull();
    expect(practiceForPlacement({ status: "below_catalog" })).toBeNull();
    expect(practiceForPlacement({ status: "in_progress" })).toBeNull();

    for (const item of MATH_PRACTICE) {
      expect(isTonightSliceCode(item.standardCode)).toBe(true);
      expect(practiceIsANewCase(item)).toBe(true);
      expect(item.choices[item.correctIndex]?.length).toBeGreaterThan(0);
    }

    const groups = practiceForPlacement({
      status: "ready",
      standardCode: "MA.3.NSO.2.2",
      rung: 1,
    });
    expect(groups?.prompt).toContain("4 equal groups of 3");
    expect(practiceFeedback(groups!, false)).toContain("4 × 3 = 12");
    expect(practiceFeedback(groups!, true)).toContain("12 biscuits");
  });

  it("gives the top-ladder idea when the check is already solid", () => {
    const item = practiceForPlacement({
      status: "above_ladder",
      standardCode: "MA.3.NSO.1.2",
      rung: 2,
    });
    expect(item?.prompt).toContain("3,205");
    expect(practiceFeedback(item!, false)).toContain("hundreds");
  });
});
