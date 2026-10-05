import { describe, expect, it } from "vitest";
import {
  decideSubjectSwitch,
  focusProgressSummary,
  shouldOpenSubjectFocus,
  subjectChoicesForGrade,
} from "./subjectFocus";

describe("subject focus sitting", () => {
  it("offers the four subjects for the captain's catalog grade", () => {
    expect(subjectChoicesForGrade("3").map((choice) => choice.label)).toEqual([
      "Grade 3 Math",
      "Grade 3 Reading & Writing",
      "Grade 3 Science",
      "Grade 3 Social Studies",
    ]);
    expect(subjectChoicesForGrade("6").map((choice) => choice.slug)).toEqual([
      "math_g4",
      "ela_g4",
      "science_g4",
      "social_studies_g4",
    ]);
  });

  it("asks for a deliberate yes before leaving the chosen subject", () => {
    expect(
      decideSubjectSwitch({
        sittingSubject: null,
        requested: "math_g3",
        confirmed: false,
      }).action
    ).toBe("choose");

    const pending = decideSubjectSwitch({
      sittingSubject: "math_g3",
      requested: "science_g3",
      confirmed: false,
    });
    expect(pending.action).toBe("confirm");
    if (pending.action === "confirm") {
      expect(pending.prompt).toContain("Leave Grade 3 Math for Grade 3 Science");
      expect(pending.prompt).toContain("on purpose");
    }

    expect(
      decideSubjectSwitch({
        sittingSubject: "math_g3",
        requested: "science_g3",
        confirmed: true,
      })
    ).toEqual({ action: "choose", slug: "science_g3" });
  });

  it("counts standards the captain has already been seen on", () => {
    expect(
      focusProgressSummary([
        { evidenceCount: 1 },
        { evidenceCount: 0 },
        { evidenceCount: 2 },
      ]).line
    ).toBe("2 of 3 standards seen");
  });

  it("opens the focus view after the wreck lesson unless another mode was requested", () => {
    expect(
      shouldOpenSubjectFocus({
        firstRunStep: "complete",
        dialogueQuery: false,
        boardQuery: false,
        missionQuery: false,
      })
    ).toBe(true);
    expect(
      shouldOpenSubjectFocus({
        firstRunStep: "complete",
        dialogueQuery: true,
        boardQuery: false,
        missionQuery: false,
      })
    ).toBe(false);
    expect(
      shouldOpenSubjectFocus({
        firstRunStep: "move",
        dialogueQuery: false,
        boardQuery: false,
        missionQuery: false,
      })
    ).toBe(false);
  });
});
