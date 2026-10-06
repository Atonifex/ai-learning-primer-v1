import { describe, expect, it } from "vitest";
import {
  GARDEN_LEARNER_GOAL,
  GARDEN_STANDARD_CODE,
  GARDEN_TEACH_BEATS,
  gardenTeachBeatCount,
  isCorrectTeachChoice,
} from "./gardenTeach";

describe("gardenTeach", () => {
  it("faces SC.3.L.17.2 with a fixed learner goal and authored practice", () => {
    expect(GARDEN_STANDARD_CODE).toBe("SC.3.L.17.2");
    expect(GARDEN_LEARNER_GOAL).toBe("What plants need to grow");
    expect(gardenTeachBeatCount()).toBeGreaterThanOrEqual(6);
    expect(GARDEN_TEACH_BEATS.some((b) => b.kind === "model")).toBe(true);
    expect(GARDEN_TEACH_BEATS.filter((b) => b.kind === "practice").length).toBeGreaterThanOrEqual(3);
    expect(GARDEN_TEACH_BEATS.some((b) => b.kind === "revise")).toBe(true);
    expect(GARDEN_TEACH_BEATS.at(-1)?.kind).toBe("ready");
  });

  it("scores practice choices deterministically", () => {
    expect(isCorrectTeachChoice("case-dark", "no")).toBe(true);
    expect(isCorrectTeachChoice("case-dark", "yes")).toBe(false);
    expect(isCorrectTeachChoice("case-salt", "bad")).toBe(true);
    expect(isCorrectTeachChoice("revise-dirt", "sun")).toBe(true);
  });

  it("never asks plants-vs-path mission choice in the teach copy", () => {
    const text = GARDEN_TEACH_BEATS.map((b) => `${b.title} ${b.body}`).join(" ");
    expect(text.toLowerCase()).not.toMatch(/path first|plants or/);
  });
});
