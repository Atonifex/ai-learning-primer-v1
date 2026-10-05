import { describe, expect, it } from "vitest";
import { isTonightSliceCode } from "../curriculum/tonightSlice";
import {
  MATH_DIAGNOSTIC_LADDER,
  applyMathDiagnosticAnswer,
  exampleIsNotTheScoredPrompt,
  freshMathDiagnostic,
  mathPlacementCopy,
} from "./mathDiagnostic";

describe("math diagnostic", () => {
  it("shows an example that is not the scored question, on seeded codes only", () => {
    for (const item of MATH_DIAGNOSTIC_LADDER) {
      expect(exampleIsNotTheScoredPrompt(item)).toBe(true);
      expect(isTonightSliceCode(item.standardCode)).toBe(true);
      expect(item.choices[item.correctIndex]?.length).toBeGreaterThan(0);
    }
  });

  it("steps up after two correct answers and stops above the ladder", () => {
    let state = freshMathDiagnostic();
    state = applyMathDiagnosticAnswer(state, true);
    expect(state.placement.status).toBe("in_progress");
    expect(state.rung).toBe(0);
    state = applyMathDiagnosticAnswer(state, true);
    expect(state.rung).toBe(1);
    state = applyMathDiagnosticAnswer(state, true);
    state = applyMathDiagnosticAnswer(state, true);
    expect(state.rung).toBe(2);
    state = applyMathDiagnosticAnswer(state, true);
    state = applyMathDiagnosticAnswer(state, true);
    expect(state.placement).toEqual({
      status: "above_ladder",
      standardCode: "MA.3.NSO.1.2",
      rung: 2,
    });
  });

  it("stops below the catalog instead of inventing an easier code", () => {
    let state = freshMathDiagnostic();
    state = applyMathDiagnosticAnswer(state, false);
    state = applyMathDiagnosticAnswer(state, false);
    expect(state.placement.status).toBe("below_catalog");
  });

  it("tells the child the floor without naming a grade 2 code", () => {
    const copy = mathPlacementCopy({ status: "below_catalog" });
    expect(copy).toContain("will not guess a grade 2 code");
    expect(copy).not.toMatch(/MA\.2\./);
  });
});
