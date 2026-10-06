import { describe, expect, it } from "vitest";
import {
  decodeCaptainChoices,
  formatCaptainChoiceReply,
  isCaptainChoiceReply,
  parseCaptainChoiceReply,
} from "./captainChoices";
import { presentCaptainChoicesTool } from "../ai/captainChoicesTool";
import { buildSystemPrompt } from "../ai/contextBuilder";
import type { LearnerProfileData } from "../types";

const profile: LearnerProfileData = {
  id: "learner",
  displayName: "Aaron",
  gradeBand: "3",
  readingLevel: "3",
  firstRunStep: "complete",
  introSeenAt: null,
  householdId: "house",
  primarySubjectSlug: "math_g3",
  goals: "",
  interests: [],
  activeLanguage: null,
  currentLevel: null,
  enrolledSubjects: [],
};

describe("captainChoices contract", () => {
  it("exposes present_captain_choices as a structured A/B/C tool", () => {
    expect(presentCaptainChoicesTool.function.name).toBe("present_captain_choices");
    expect(presentCaptainChoicesTool.function.description.toLowerCase()).toContain(
      "decision buttons"
    );
    expect(presentCaptainChoicesTool.function.description.toLowerCase()).toContain(
      "never only write"
    );
  });

  it("decodes valid 2–3 option tool args and rejects junk", () => {
    const ok = decodeCaptainChoices({
      decision_prompt: "Where first?",
      options: [
        { id: "A", label: "Check the wreck" },
        { id: "b", label: "Walk inland" },
        { id: "C", label: "Listen for the radio" },
      ],
    });
    expect(ok).toEqual({
      prompt: "Where first?",
      options: [
        { id: "A", label: "Check the wreck" },
        { id: "B", label: "Walk inland" },
        { id: "C", label: "Listen for the radio" },
      ],
    });

    expect(decodeCaptainChoices({ options: [{ id: "A", label: "Only one" }] })).toBeNull();
    expect(
      decodeCaptainChoices({
        options: [
          { id: "A", label: "One" },
          { id: "A", label: "Dup" },
        ],
      })
    ).toBeNull();
    expect(decodeCaptainChoices({ options: "not-an-array" })).toBeNull();
    expect(
      decodeCaptainChoices({
        options: [
          { id: "A", label: "" },
          { id: "B", label: "Ok" },
        ],
      })
    ).toBeNull();
  });

  it("formats and parses the click reply delimiter", () => {
    const reply = formatCaptainChoiceReply({
      id: "B",
      label: "Walk inland",
    });
    expect(reply).toBe("I choose B — Walk inland");
    expect(isCaptainChoiceReply(reply)).toBe(true);
    expect(parseCaptainChoiceReply(reply)).toEqual({
      id: "B",
      label: "Walk inland",
    });
    expect(parseCaptainChoiceReply("Walk inland")).toBeNull();
  });

  it("instructs Rho to call present_captain_choices instead of listing A/B/C only", () => {
    const prompt = buildSystemPrompt(profile, [], null, [], {
      subjectSlug: "math_g3",
    });
    expect(prompt).toContain("present_captain_choices");
    expect(prompt.toLowerCase()).toContain("decision buttons");
    expect(prompt).toContain("Do not only write A/B/C in chat");
  });
});
