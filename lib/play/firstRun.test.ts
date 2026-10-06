import { describe, expect, it } from "vitest";
import {
  applyFirstRunEvent,
  firstRunChrome,
  firstRunCoach,
  parseFirstRunStep,
} from "./firstRun";

describe("firstRun director", () => {
  it("parses unknown steps as video", () => {
    expect(parseFirstRunStep("nope")).toBe("video");
    expect(parseFirstRunStep("talk")).toBe("talk");
    expect(parseFirstRunStep("purpose")).toBe("purpose");
    expect(parseFirstRunStep("name")).toBe("move");
  });

  it("advances one verb at a time, with a learning card after the movie", () => {
    expect(applyFirstRunEvent("video", "video_done")).toBe("purpose");
    expect(applyFirstRunEvent("purpose", "purpose_done")).toBe("move");
    expect(applyFirstRunEvent("name", "name_saved")).toBe("move");
    expect(applyFirstRunEvent("move", "walked_to_wreck")).toBe("talk");
    expect(applyFirstRunEvent("talk", "spoke_to_rho")).toBe("work");
    expect(applyFirstRunEvent("work", "work_done")).toBe("complete");
  });

  it("ignores out-of-order events", () => {
    expect(applyFirstRunEvent("video", "spoke_to_rho")).toBe("video");
    expect(applyFirstRunEvent("complete", "video_done")).toBe("complete");
    expect(applyFirstRunEvent("talk", "walked_to_wreck")).toBe("talk");
    expect(applyFirstRunEvent("purpose", "name_saved")).toBe("purpose");
  });

  it("hides Camp needs until the first work verb is done", () => {
    expect(firstRunChrome("move").jobs).toBe(false);
    expect(firstRunChrome("complete").jobs).toBe(true);
    expect(firstRunChrome("talk").radio).toBe(true);
  });

  it("coaches move/talk/work in crew voice", () => {
    expect(firstRunCoach("move", "Maya")).toMatch(/Maya/);
    expect(firstRunCoach("talk", "Maya")).toMatch(/mic/i);
    expect(firstRunCoach("work", "Maya")).toMatch(/Salvage/);
    expect(firstRunCoach("video", "Maya")).toBeNull();
  });
});
