import { describe, expect, it } from "vitest";
import {
  clamp,
  nextConfidenceAfterObservation,
  nextStandardsMastery,
} from "./standardsMasteryMath";

describe("clamp", () => {
  it("bounds values", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});

describe("nextStandardsMastery", () => {
  it("moves toward correctness with CHECKPOINT weight", () => {
    const next = nextStandardsMastery({
      currentMastery: 40,
      evidenceTier: "CHECKPOINT",
      correctnessNormalized: 1,
      stepSize: 18,
    });
    expect(next).toBeGreaterThan(40);
    expect(next).toBeLessThanOrEqual(100);
  });

  it("respects tier cap", () => {
    const next = nextStandardsMastery({
      currentMastery: 68,
      evidenceTier: "CONVERSATIONAL",
      correctnessNormalized: 1,
    });
    expect(next).toBeLessThanOrEqual(70);
  });
});

describe("nextConfidenceAfterObservation", () => {
  it("blends prior with observed correctness", () => {
    expect(nextConfidenceAfterObservation(0.5, 1)).toBe(0.75);
    expect(nextConfidenceAfterObservation(0, 0)).toBe(0);
  });
});
