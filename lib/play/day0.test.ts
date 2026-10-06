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

    const wreckOnly = day0Checklist({ firstRunStep: "complete", wreckQuizDone: true, campFounded: true });
    expect(wreckOnly.find((box) => box.id === "mathCheck")?.done).toBe(false);
    expect(day0AllDone(wreckOnly)).toBe(false);

    const done = day0Checklist({
      firstRunStep: "complete",
      wreckQuizDone: true,
      campFounded: true,
      mathPlacementCode: "MA.3.NSO.1.1",
      mathPlacementStatus: "ready",
    });
    expect(day0AllDone(done)).toBe(true);

    const below = day0Checklist({
      firstRunStep: "complete",
      wreckQuizDone: false,
      campFounded: true,
      mathPlacementStatus: "below_catalog",
    });
    expect(below.find((box) => box.id === "mathCheck")?.done).toBe(true);
  });

  it("keeps Camp needs to wreck salvage until a math starting point is saved", () => {
    const missions = decorateMissions({
      wreckQuizDone: true,
      completedSlugs: new Set(["g3-ma-wreck-number-forms"]),
    });
    expect(missions.find((m) => m.id === "dune-ela")?.status).toBe("locked");
    expect(missions.find((m) => m.id === "camp-math")?.status).toBe("locked");
    expect(missions.find((m) => m.id === "dune-ela")?.lockReason).toMatch(/starting point/i);
    expect(campNeedsMissions(missions, false)).toHaveLength(5);
    expect(campNeedsMissions(missions, false).filter((m) => m.status === "available")).toHaveLength(0);
    expect(campNeedsTitle(false)).toBe("Camp needs");
    expect(campNeedsMissions(missions, true).some((m) => m.id === "dune-ela")).toBe(true);
    expect(canGenerateLearningActivity()).toBe(false);
    expect(hasSavedMathPlacement("MA.3.NSO.1.1")).toBe(true);
    expect(hasSavedMathPlacement(null, "below_catalog")).toBe(true);
    expect(canGenerateLearningActivity(null, "below_catalog")).toBe(false);
    expect(CHAPTER_PROBLEM).toMatch(/Food will not last/);
    expect(LEARNING_PURPOSE_PAGES[0]?.body).toMatch(/not a scored test/i);
    expect(LEARNING_PURPOSE_PAGES[1]?.body).not.toMatch(/MA\.\d/);
  });
});
