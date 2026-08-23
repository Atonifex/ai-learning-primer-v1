import { describe, expect, it } from "vitest";
import { extensionForAudioMime, speechFilenameForMime } from "./sttAudio";

describe("sttAudio extension mapping", () => {
  it("maps Chrome webm mime to .webm", () => {
    expect(extensionForAudioMime("audio/webm;codecs=opus")).toBe("webm");
    expect(speechFilenameForMime("audio/webm")).toBe("speech.webm");
  });

  it("maps Safari mp4/aac mime to .m4a (Whisper rejects .webm for these bytes)", () => {
    expect(extensionForAudioMime("audio/mp4")).toBe("m4a");
    expect(extensionForAudioMime("audio/aac")).toBe("m4a");
    expect(speechFilenameForMime("audio/mp4")).toBe("speech.m4a");
  });

  it("defaults unknown mime to webm", () => {
    expect(extensionForAudioMime("")).toBe("webm");
    expect(extensionForAudioMime(undefined)).toBe("webm");
  });
});
