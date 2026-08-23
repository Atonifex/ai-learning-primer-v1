import { describe, expect, it } from "vitest";
import {
  curriculumGradeForLearner,
  defaultPrimarySubjectSlug,
  remapCoreSubjectToGrade,
  storySpineSubjectSlug,
  coreSubjectSlugsForGrade,
} from "./subjects";

describe("grade-aware core subjects", () => {
  it("maps onboarding grade to a seeded curriculum catalog", () => {
    expect(curriculumGradeForLearner("3")).toBe("3");
    expect(curriculumGradeForLearner("4")).toBe("4");
    expect(curriculumGradeForLearner("7")).toBe("4");
    expect(defaultPrimarySubjectSlug("3")).toBe("math_g3");
    expect(defaultPrimarySubjectSlug("4")).toBe("math_g4");
  });

  it("enrolls four domains at the learner's catalog grade", () => {
    expect([...coreSubjectSlugsForGrade("3")]).toEqual([
      "math_g3",
      "ela_g3",
      "science_g3",
      "social_studies_g3",
    ]);
    expect([...coreSubjectSlugsForGrade("4")]).toEqual([
      "math_g4",
      "ela_g4",
      "science_g4",
      "social_studies_g4",
    ]);
  });

  it("remaps island jobs onto the captain's catalog without changing the G3 saga keys", () => {
    expect(remapCoreSubjectToGrade("math_g3", "4")).toBe("math_g4");
    expect(remapCoreSubjectToGrade("ela_g3", "3")).toBe("ela_g3");
    expect(storySpineSubjectSlug("science_g4")).toBe("science_g3");
  });
});
