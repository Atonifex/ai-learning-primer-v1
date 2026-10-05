import { describe, expect, it } from "vitest";
import { isTonightSliceCode } from "../curriculum/tonightSlice";
import { freshMathDiagnostic } from "./mathDiagnostic";
import { practiceFeedback } from "./mathPractice";
import { SUBJECT_CHECK_LADDERS } from "./subjectChecks";
import { SUBJECT_PRACTICE, practiceForLadder, practiceIsNewCase } from "./subjectPractice";

describe("practice after a subject starting point", () => {
  it("waits for a starting point and uses a new case of a seeded code", () => {
    const science = SUBJECT_CHECK_LADDERS.science;
    expect(practiceForLadder(freshMathDiagnostic().placement, science)).toBeNull();
    expect(practiceForLadder({ status: "below_catalog" }, science)).toBeNull();
    expect(practiceForLadder({ status: "in_progress" }, science)).toBeNull();

    for (const [key, items] of Object.entries(SUBJECT_PRACTICE)) {
      const ladder = SUBJECT_CHECK_LADDERS[key as keyof typeof SUBJECT_PRACTICE];
      for (const item of items) {
        expect(isTonightSliceCode(item.standardCode)).toBe(true);
        expect(practiceIsNewCase(item, ladder)).toBe(true);
        expect(item.choices[item.correctIndex]?.length).toBeGreaterThan(0);
      }
    }
  });

  it("offers the plant idea only after science is placed, and names roots when the try misses", () => {
    const science = SUBJECT_CHECK_LADDERS.science;
    const item = practiceForLadder(
      { status: "above_ladder", standardCode: "SC.3.L.14.1", rung: 2 },
      science
    );
    expect(item?.prompt).toContain("takes in water");
    expect(practiceFeedback(item!, false)).toContain("roots");
    expect(
      practiceForLadder(
        { status: "above_ladder", standardCode: "MA.3.NSO.1.2", rung: 2 },
        science
      )
    ).toBeNull();
  });
});
