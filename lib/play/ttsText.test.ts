import { describe, expect, it } from "vitest";
import { TTS_MAX_CHARS, prepareTtsText } from "./ttsText";

describe("prepareTtsText", () => {
  it("returns null for empty or punctuation-only input", () => {
    expect(prepareTtsText("")).toBeNull();
    expect(prepareTtsText("   \n  ")).toBeNull();
    expect(prepareTtsText("*")).toBeNull();
  });

  it("strips markdown so Rho does not read asterisks", () => {
    expect(prepareTtsText("**Captain**, the *crate* is `[open]`.")).toBe(
      "Captain, the crate is [open]."
    );
  });

  it("unwraps links and drops fenced code", () => {
    expect(prepareTtsText("See [the map](https://x.test) then ```js\n1\n``` go.")).toBe(
      "See the map then go."
    );
  });

  it("clamps long text on a word boundary", () => {
    const long = `${"salvage ".repeat(400)}end`;
    const out = prepareTtsText(long);
    expect(out).not.toBeNull();
    expect(out!.length).toBeLessThanOrEqual(TTS_MAX_CHARS + 1);
    expect(out!.endsWith(".")).toBe(true);
  });
});
