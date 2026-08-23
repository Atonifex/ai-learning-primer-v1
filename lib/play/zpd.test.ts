import { describe, expect, it } from "vitest";
import { nextZpdStage, zpdSupportLevel } from "./zpd";

describe("ZPD ladder", () => {
  it("skips support when nothing was missed", () => {
    expect(nextZpdStage(null, 0)).toBe("done");
  });

  it("walks hint → example → fade → done", () => {
    expect(nextZpdStage(null, 2)).toBe("hint");
    expect(nextZpdStage("hint", 2)).toBe("example");
    expect(nextZpdStage("example", 2)).toBe("fade");
    expect(nextZpdStage("fade", 2)).toBe("done");
    expect(zpdSupportLevel("hint")).toBe("full");
    expect(zpdSupportLevel("fade")).toBe("faded");
  });
});
