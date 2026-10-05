import { describe, expect, it } from "vitest";
import {
  campNeedsMissions,
  campNeedsTitle,
  CHAPTER_PROBLEM,
  day0AllDone,
  day0Checklist,
  LEARNING_PURPOSE_PAGES,
} from "./day0";
import { canGenerateLearningActivity, hasSavedMathPlacement } from "./mathPlacement";
import { decorateMissions } from "./missions";

describe("Day 0 checklist and camp needs", () => {
  it("starts with five empty boxes and fills them in order", () => {
    const start = day0Checklist({ firstRunStep: "purpose", wreckQuizDone: false, campFounded: false });
    expect(start.map((box) => box.id)).toEqual(["name", "walk", "talk", "mathCheck", "camp"]);
    expect(start.every((box) => !box.done)).toBe(true);
    expect(day0AllDone(start)).toBe(false);

    const named = day0Checklist({ firstRunStep: "move", wreckQuizDone: false, campFounded: false });
    expect(named.find((box) => box.id === "name")?.done).toBe(true);
    expect(named.find((box) => box.id === "walk")?.done).toBe(false);

    const talked = day0Checklist({ firstRunStep: "work", wreckQuizDone: false, campFounded: false });
    expect(talked.filter((box) => box.done).map((box) => box.id)).toEqual(["name", "walk", "talk"]);

    const done = day0Checklist({ firstRunStep: "complete", wreckQuizDone: true, campFounded: true });
    expect(day0AllDone(done)).toBe(true);
  });

  it("keeps Camp needs to wreck salvage until a math starting point is saved", () => {
    const missions = decorateMissions({
      wreckQuizDone: true,
      completedSlugs: new Set(["g3-ma-wreck-number-forms"]),
    });
    expect(missions.find((m) => m.id === "dune-ela")?.status).toBe("locked");
    expect(missions.find((m) => m.id === "camp-math")?.status).toBe("locked");
    expect(missions.find((m) => m.id === "dune-ela")?.lockReason).toMatch(/starting point/i);
    expect(campNeedsMissions(missions, false).map((m) => m.id)).toEqual(["wreck-math"]);
    expect(campNeedsTitle(false)).toBe("Camp needs");
    expect(campNeedsMissions(missions, true).some((m) => m.id === "dune-ela")).toBe(true);
    expect(canGenerateLearningActivity()).toBe(false);
    expect(hasSavedMathPlacement("MA.3.NSO.1.1")).toBe(true);
    expect(CHAPTER_PROBLEM).toMatch(/Food will not last/);
    expect(LEARNING_PURPOSE_PAGES[0]?.body).toMatch(/not a scored test/i);
    expect(LEARNING_PURPOSE_PAGES[1]?.body).not.toMatch(/MA\.\d/);
  });
});
