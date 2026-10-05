import { describe, expect, it } from "vitest";
import { rhoSpeechPlan, storedRhoAutoRead } from "./rhoAutoRead";

describe("rhoSpeechPlan", () => {
  it("skips the paid speech request when automatic reading is off", () => {
    expect(
      rhoSpeechPlan({ mode: "automatic", autoRead: false, muted: false })
    ).toBe("skip");
  });

  it("still speaks a manual Hear Rho tap when automatic reading is off", () => {
    expect(rhoSpeechPlan({ mode: "manual", autoRead: false, muted: false })).toBe(
      "speak"
    );
  });

  it("speaks a finished turn when automatic reading is on", () => {
    expect(rhoSpeechPlan({ mode: "automatic", autoRead: true, muted: false })).toBe(
      "speak"
    );
  });

  it("skips both automatic and manual speech when the voice is muted", () => {
    expect(rhoSpeechPlan({ mode: "automatic", autoRead: true, muted: true })).toBe(
      "skip"
    );
    expect(rhoSpeechPlan({ mode: "manual", autoRead: false, muted: true })).toBe(
      "skip"
    );
  });
});

describe("storedRhoAutoRead", () => {
  it("keeps automatic reading on when nothing is saved", () => {
    expect(storedRhoAutoRead(null)).toBe(true);
    expect(storedRhoAutoRead("1")).toBe(true);
    expect(storedRhoAutoRead("0")).toBe(false);
  });

  it("starts off on a dev machine when nothing is saved, and still honors an explicit on", () => {
    expect(storedRhoAutoRead(null, true)).toBe(false);
    expect(storedRhoAutoRead("1", true)).toBe(true);
    expect(storedRhoAutoRead("0", true)).toBe(false);
  });
});
