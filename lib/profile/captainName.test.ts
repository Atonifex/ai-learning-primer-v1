import { describe, expect, it } from "vitest";
import { validCaptainName, captainDisplayName } from "./captainName";

describe("captain name validation", () => {
  it("keeps chosen names and falls back to login for old nameless accounts", () => {
    expect(captainDisplayName("Maya Nova", "maya")).toBe("Maya Nova");
    expect(captainDisplayName(null, "maya")).toBe("maya");
    expect(captainDisplayName(null, null)).toBe("Captain");
  });
  it("preserves names and trims surrounding space", () => {
    expect(validCaptainName("  Zoë O'Neil  ")).toBe("Zoë O'Neil");
    expect(validCaptainName("船長")).toBe("船長");
    expect(validCaptainName("a".repeat(40))).toHaveLength(40);
  });
  it("rejects empty, invalid and oversized names", () => {
    for (const value of [null, 5, {}, "", "   ", "a".repeat(41), "Sam\n"])
      expect(validCaptainName(value)).toBeNull();
  });
});
