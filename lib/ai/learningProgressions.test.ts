import { describe, expect, it } from "vitest";
import { getPromptTemplate } from "./promptTemplates";
import { LEARNING_PROGRESSIONS, progressionForSubject } from "./learningProgressions";

describe("live subject learning progressions", () => {
  it.each([
    ["math", "modelPractice"],
    ["science", "inquiry"],
    ["ela", "evidenceCommunication"],
    ["social_studies", "evidenceCommunication"],
  ] as const)("routes %s in both supported grades into its full teaching contract", (subject, id) => {
    for (const grade of [3, 4]) {
      const slug = `${subject}_g${grade}`;
      expect(progressionForSubject(slug)).toBe(id);
      const instructions = getPromptTemplate(slug).pedagogyInstructions;
      expect(instructions).toContain(LEARNING_PROGRESSIONS[id].stages);
      expect(instructions).toContain(LEARNING_PROGRESSIONS[id].activities);
      expect(instructions).toContain("a chance to revise");
      expect(instructions).toContain("persistent world changes require an existing successful tool result");
      expect(instructions).toContain("A guided revision does not prove mastery");
    }
  });

  it("does not silently claim unsupported grade coverage", () => {
    expect(() => progressionForSubject("math_g7")).toThrow(/No learning progression/);
    expect(() => getPromptTemplate("science_g5")).toThrow(/No prompt template/);
  });
});
