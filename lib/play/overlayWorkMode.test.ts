import { describe, expect, it } from "vitest";
import { shouldHideDialogueForOverlay } from "./overlayWorkMode";

describe("shouldHideDialogueForOverlay", () => {
  it("hides dialogue when a quiz or crew-log overlay is open", () => {
    expect(shouldHideDialogueForOverlay({ showQuiz: true, showReflection: false })).toBe(
      true
    );
    expect(shouldHideDialogueForOverlay({ showQuiz: false, showReflection: true })).toBe(
      true
    );
    expect(shouldHideDialogueForOverlay({ showQuiz: false, showReflection: false })).toBe(
      false
    );
  });
});
