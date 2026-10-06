import { describe, expect, it } from "vitest";
import { validCaptainName } from "./captainName";

describe("captain name validation", () => {
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
