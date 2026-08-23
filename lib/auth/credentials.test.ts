import { describe, expect, it } from "vitest";
import {
  normalizeUsername,
  parsePin,
  pinError,
  usernameError,
} from "./credentials";

describe("captain credentials", () => {
  it("normalizes usernames", () => {
    expect(normalizeUsername("Maya_8")).toBe("maya_8");
    expect(normalizeUsername("ab")).toBeNull();
    expect(normalizeUsername("Bad Name")).toBeNull();
  });

  it("requires a 4-digit PIN", () => {
    expect(parsePin("1234")).toBe("1234");
    expect(parsePin("12")).toBeNull();
    expect(parsePin("abcd")).toBeNull();
    expect(pinError("12")).toMatch(/4 digits/);
  });

  it("explains username rules", () => {
    expect(usernameError("")).toMatch(/login/i);
    expect(usernameError("ok_name")).toBeNull();
  });
});
