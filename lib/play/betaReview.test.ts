import { describe, expect, it, vi, afterEach } from "vitest";
import { nextCampAction } from "./nextCampAction";
import { decorateMissions, TUTORIAL_MISSIONS, formatMissionsForPrompt } from "./missions";
import { childStoryRecap, STORY_RECAP_RULE } from "./storyRecap";
import { CURRICULUM_COVERAGE, EVIDENCE_EXPLANATION, evidenceLabel, ledgerLabel, observationNote, masteryEstimate } from "./progressCopy";
import { isClientAiDebug } from "./clientAiDebug";
import { expandHiddenTurn, HIDDEN_TURN, isHiddenTurn } from "./hiddenTurns";

afterEach(() => vi.unstubAllEnvs());
describe("beta learning direction and trust", () => {
  it("the check-review handoff requests saved support without fabricating a child's message", () => {
    expect(isHiddenTurn(HIDDEN_TURN.subjectCheckReview)).toBe(true);
    const prompt = expandHiddenTurn(HIDDEN_TURN.subjectCheckReview, "Captain");
    expect(prompt).toContain("SAVED SUBJECT STARTER");
    expect(prompt).toContain("do not invent a result");
    expect(prompt).toContain("not independent mastery");
  });
  it("offers salvage, then the check, then a real job, then subject choice", () => {
    const completedSlugs = new Set<string>();
    expect(nextCampAction(decorateMissions({ wreckQuizDone: false, completedSlugs }), false).kind).toBe("mission");
    completedSlugs.add(TUTORIAL_MISSIONS[0].activitySlug);
    const locked = decorateMissions({ wreckQuizDone: true, completedSlugs });
    expect(nextCampAction(locked, false).kind).toBe("check");
    expect(formatMissionsForPrompt(locked)).not.toContain("invite a recap");
    expect(formatMissionsForPrompt(locked)).not.toMatch(/\d+ XP, \d+ ration/);
    expect(nextCampAction([], true).title).not.toContain("complete");
    expect(nextCampAction(decorateMissions({ wreckQuizDone: true, completedSlugs, placementReady: true }), true).kind).toBe("mission");
    TUTORIAL_MISSIONS.forEach((m) => completedSlugs.add(m.activitySlug));
    expect(nextCampAction(decorateMissions({ wreckQuizDone: true, completedSlugs, placementReady: true }), true).kind).toBe("focus");
  });
  it("omits contaminated recaps without inventing accomplishments", () => {
    for (const text of ["The captain checked the next overlay.", "The session ends with Rho prompting a recap.", "Please open camp-math.", "Must reuse the crew_log."]) expect(childStoryRecap(text)).toBeNull();
    expect(childStoryRecap("The crew saved dry crates. The engineer is still missing.")).toBe("The crew saved dry crates. The engineer is still missing.");
    expect(STORY_RECAP_RULE).toContain("Do not invent");
  });
  it("translates system metadata and keeps ordinary observation notes", () => {
    expect(ledgerLabel("crew_log", "ARTIFACT")).toBe("Note to carry forward");
    expect(ledgerLabel("map_note:wreck", "DECISION")).toBe("Map note · Wreck");
    expect(evidenceLabel("GUIDED", "ASSESSMENT")).toBe("With support · Starting check");
    expect(evidenceLabel("CHECKPOINT", "ACTIVITY")).toBe("Checkpoint · Learning activity");
    expect(masteryEstimate(0, 0)).toBe("Not observed");
    expect(masteryEstimate(14, 2)).toBe("14/100 estimate");
    expect(EVIDENCE_EXPLANATION).toContain("not grades");
    expect(observationNote("math-five:forms-a")).toBeNull();
    expect(observationNote("Explained the tens place clearly.")).toBe("Explained the tens place clearly.");
    expect(CURRICULUM_COVERAGE).toContain("Grades 5–8 curriculum is not available");
  });
  it("never shows debugging in a production build", () => {
    vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("NEXT_PUBLIC_PRIMER_AI_DEBUG", "1");
    expect(isClientAiDebug()).toBe(false);
  });
});
