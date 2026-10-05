import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "../ai/contextBuilder";
import type { LearnerProfileData } from "../types";
import {
  buildHandoffSummary,
  ch1CrewLogFacts,
  formatChapterHandoffBlock,
  handoffInstructionsAreBinding,
} from "./chapterHandoff";

const NOTE = "34 is 3 tens and 4 ones so the engineer can count the crates.";

const profile: LearnerProfileData = {
  id: "learner",
  displayName: "Ada",
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

describe("chapter handoff", () => {
  it("stores the crew log as a fact the next chapter must reuse", () => {
    const facts = ch1CrewLogFacts({
      note: NOTE,
      standardCodes: ["ELA.3.C.1.4"],
    });
    const summary = buildHandoffSummary({
      completedChapterTitle: "Wreck",
      nextChapterTitle: "Food",
      facts,
    });
    const block = formatChapterHandoffBlock({
      fromChapterTitle: "Wreck",
      summary,
      mustReuse: facts.filter((fact) => fact.mustReuse),
    });

    expect(summary).toContain(NOTE);
    expect(summary).toContain("Must reuse that note in Food");
    expect(summary).toContain("ELA.3.C.1.4");
    expect(block).toContain("The engineer is still missing.");
    expect(handoffInstructionsAreBinding(block, NOTE)).toBe(true);
  });

  it("puts the handoff in Rho's prompt only when a previous chapter closed", () => {
    const facts = ch1CrewLogFacts({ note: NOTE, standardCodes: [] });
    const block = formatChapterHandoffBlock({
      fromChapterTitle: "Wreck",
      summary: buildHandoffSummary({
        completedChapterTitle: "Wreck",
        nextChapterTitle: "Food",
        facts,
      }),
      mustReuse: facts,
    });

    const withHandoff = buildSystemPrompt(profile, [], null, [], {
      subjectSlug: "math_g3",
      chapterHandoff: block,
    });
    const without = buildSystemPrompt(profile, [], null, [], {
      subjectSlug: "math_g3",
    });

    expect(handoffInstructionsAreBinding(withHandoff, NOTE)).toBe(true);
    expect(without.includes("CHAPTER HANDOFF")).toBe(false);
    expect(without.includes(NOTE)).toBe(false);
  });
});
