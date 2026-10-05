import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "../ai/contextBuilder";
import { buildTurnDebugPacket } from "../ai/turnDebugPacket";
import type { LearnerProfileData } from "../types";
import { formatAuthoritativeState, salvageTalkIsClosed } from "./authoritativeState";
import { expandHiddenTurn, HIDDEN_TURN } from "./hiddenTurns";
import { reconcileFirstRunStep } from "./firstRun";
import { decorateMissions } from "./missions";

const profile: LearnerProfileData = {
  id: "learner",
  displayName: "Aaron",
  gradeBand: "4",
  readingLevel: "4",
  firstRunStep: "work",
  introSeenAt: null,
  householdId: "house",
  primarySubjectSlug: "math_g4",
  goals: "",
  interests: [],
  activeLanguage: null,
  currentLevel: null,
  enrolledSubjects: [],
};

describe("authoritative chapter and jobs", () => {
  const missions = decorateMissions({
    wreckQuizDone: false,
    completedSlugs: new Set(),
  });

  it("closes the wreck talk once Chapter 1 is no longer the active row", () => {
    expect(salvageTalkIsClosed({ chapterOrderIndex: 0, wreckQuizDone: false })).toBe(false);
    expect(salvageTalkIsClosed({ chapterOrderIndex: 1, wreckQuizDone: false })).toBe(true);
    expect(salvageTalkIsClosed({ chapterOrderIndex: 0, wreckQuizDone: true })).toBe(true);
  });

  it("does not let a recap finish a job the board still lists as available", () => {
    const authority = formatAuthoritativeState({
      chapterTitle: "Chapter 2 — Divide the Supplies",
      chapterOrderIndex: 1,
      missions,
    });
    expect(authority).toContain("AUTHORITATIVE STATE");
    expect(authority).toContain("wreck-math is available");
    expect(authority).toContain("not saved");
    expect(authority).toContain("not open");
    const prompt = buildSystemPrompt(profile, [], null, [], {
      subjectSlug: "math_g4",
      spine: {
        worldTitle: "Island",
        worldBible: "",
        arcTitle: "Expedition",
        arcSummary: null,
        arcFocusTags: [],
        chapterTitle: "Chapter 2 — Divide the Supplies",
        chapterFocusTags: [],
        chapterOrderIndex: 1,
        chapterStatus: "ACTIVE",
        actCurrent: 1,
        actTotal: 3,
        pathAheadWhisper: null,
        sceneIndex: 0,
        plannerJson: null,
      },
      previouslyOn:
        "The captain completed Chapter 2 and moved into Chapter 3. Next measurement: creek width.",
      missionBoard: missions,
    });
    expect(prompt).toContain("wreck-math is available");
    expect(prompt).toContain("color only");
    expect(prompt).toContain("unless generate_learning_activity just returned success");
  });

  it("rewrites the wreck greeting after Chapter 1 and shows that rewrite in the packet", () => {
    const expanded = expandHiddenTurn(HIDDEN_TURN.wreckApproach, "Aaron", {
      salvageClosed: true,
      chapterTitle: "Chapter 2 — Divide the Supplies",
    });
    expect(expanded).toContain("Do not restart the wreck");
    expect(expanded).not.toContain("Ask one short question about the salvage");
    expect(expanded).toContain("CAMP NEEDS");
    const packet = buildTurnDebugPacket({
      expandedUser: expanded,
      previouslyOn: "moved into Chapter 3",
      chapterHandoff: "Must reuse the crew log.",
      authority: formatAuthoritativeState({
        chapterTitle: "Chapter 2 — Divide the Supplies",
        chapterOrderIndex: 1,
        missions,
      }),
      campNeeds: "- wreck-math is available",
      memoryItems: [{ type: "STORY_BEAT", content: "Vey was found." }],
    });
    expect(packet.blocks.find((block) => block.label === "This turn")?.text).toContain(
      "CONTINUE THE CHAPTER"
    );
    expect(packet.blocks.find((block) => block.label === "Previously on")?.text).toContain(
      "Chapter 3"
    );
    expect(packet.blocks.find((block) => block.label === "Authority")?.text).toContain(
      "wreck-math is available"
    );
    expect(packet.blocks.find((block) => block.label === "Memory")?.text).toContain("Vey");
  });

  it("lets a captain who already left Chapter 1 out of the wreck tutorial", () => {
    expect(reconcileFirstRunStep("work", 1)).toBe("complete");
    expect(reconcileFirstRunStep("talk", 1)).toBe("complete");
    expect(reconcileFirstRunStep("move", 1)).toBe("complete");
    expect(reconcileFirstRunStep("video", 1)).toBe("video");
    expect(reconcileFirstRunStep("purpose", 1)).toBe("purpose");
    expect(reconcileFirstRunStep("name", 1)).toBe("name");
    expect(reconcileFirstRunStep("work", 0)).toBe("work");
    expect(reconcileFirstRunStep("complete", 2)).toBe("complete");
    expect(reconcileFirstRunStep("video", null)).toBe("video");
  });
});
