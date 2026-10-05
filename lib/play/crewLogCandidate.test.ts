import { describe, expect, it } from "vitest";
import {
  findCrewLogNoteCandidate,
  shouldOpenCrewLogAfterWreckQuiz,
} from "./crewLogCandidate";

describe("findCrewLogNoteCandidate", () => {
  it("uses the current turn when it looks like a note", () => {
    const note =
      "We counted crates and wrote the numbers in standard, expanded, and word form.";
    expect(findCrewLogNoteCandidate(note, [])).toBe(note);
  });

  it("skips short affirms and open-camp keywords", () => {
    expect(findCrewLogNoteCandidate("Yes", [])).toBeNull();
    expect(findCrewLogNoteCandidate("open camp math", [])).toBeNull();
    expect(findCrewLogNoteCandidate("Open camp-math", [])).toBeNull();
  });

  it("falls back to an earlier user note when the latest turn is just yes", () => {
    const note =
      "We counted crates and wrote the numbers in standard, expanded, and word form.";
    expect(
      findCrewLogNoteCandidate("yes", [
        { role: "USER", content: note },
        { role: "ASSISTANT", content: "Should I open camp-math?" },
      ])
    ).toBe(note);
  });
});

describe("shouldOpenCrewLogAfterWreckQuiz", () => {
  it("opens after wreck quiz when the crew log is not done", () => {
    expect(
      shouldOpenCrewLogAfterWreckQuiz({
        isWreckQuiz: true,
        reflectionDone: false,
      })
    ).toBe(true);
  });

  it("does not depend on firstRun.complete (avoids stale dismiss race)", () => {
    expect(
      shouldOpenCrewLogAfterWreckQuiz({
        isWreckQuiz: true,
        reflectionDone: false,
      })
    ).toBe(true);
  });

  it("skips when already done or not the wreck quiz", () => {
    expect(
      shouldOpenCrewLogAfterWreckQuiz({
        isWreckQuiz: true,
        reflectionDone: true,
      })
    ).toBe(false);
    expect(
      shouldOpenCrewLogAfterWreckQuiz({
        isWreckQuiz: false,
        reflectionDone: false,
      })
    ).toBe(false);
  });
});
