import { describe, expect, it } from "vitest";
import { formatHiddenMinutes, secondsBetween } from "./timeMath";

describe("time tracking", () => {
  it("records wall-clock seconds and never goes negative", () => {
    const start = new Date("2026-08-23T12:00:00.000Z");
    const end = new Date("2026-08-23T12:07:30.000Z");
    expect(secondsBetween(start, end)).toBe(450);
    expect(secondsBetween(end, start)).toBe(0);
  });

  it("formats minutes without a daily cap", () => {
    expect(formatHiddenMinutes(20)).toBe("under a minute");
    expect(formatHiddenMinutes(60)).toBe("1 minute");
    expect(formatHiddenMinutes(15 * 60)).toBe("15 minutes");
  });
});
