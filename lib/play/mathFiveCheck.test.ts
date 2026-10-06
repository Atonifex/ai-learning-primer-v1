import { describe, expect, it } from "vitest";
import { MATH_FIVE_CODES, mathFiveCodesAreTonightSlice, scoreMathFiveCheck, type MathFiveAnswer } from "./mathFiveCheck";

function choose(itemId: string, choiceIndex: number) {
  return { itemId, choiceIndex };
}

describe("five-question math check", () => {
  it("uses five tonight-slice codes and never a Grade 2 code", () => {
    expect(MATH_FIVE_CODES).toEqual([
      "MA.3.NSO.1.1",
      "MA.3.NSO.2.2",
      "MA.3.NSO.1.2",
      "MA.3.NSO.1.3",
      "MA.3.NSO.2.1",
    ]);
    expect(mathFiveCodesAreTonightSlice()).toBe(true);
    expect(MATH_FIVE_CODES.join(" ")).not.toMatch(/MA\.2/);
  });

  it("stops below the catalog after two floor misses", () => {
    const first = scoreMathFiveCheck([choose("forms-a", 1)]);
    expect(first.ok && first.placement.status).toBe("in_progress");
    expect(first.ok && first.nextItem?.id).toBe("forms-b");

    const second = scoreMathFiveCheck([choose("forms-a", 1), choose("forms-b", 0)]);
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    expect(second.placement).toEqual({ status: "below_catalog" });
    expect(second.nextItem).toBeNull();
    expect(second.childLine).toMatch(/build this together/i);
    expect(JSON.stringify(second)).not.toMatch(/MA\.2/);
    expect(second.scored.map((row) => row.standardCode)).toEqual(["MA.3.NSO.1.1", "MA.3.NSO.1.1"]);
  });

  it("places above the ladder when all five are correct", () => {
    const result = scoreMathFiveCheck([
      choose("forms-a", 0),
      choose("groups", 1),
      choose("compose", 2),
      choose("compare", 0),
      choose("add", 1),
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.placement).toEqual({
      status: "above_ladder",
      standardCode: "MA.3.NSO.2.1",
      rung: 4,
    });
    expect(result.asked).toBe(5);
    expect(result.childLine).toMatch(/adding multi-digit numbers/);
  });

  it("starts at the first missed code after a correct floor", () => {
    const result = scoreMathFiveCheck([
      choose("forms-a", 0),
      choose("groups", 1),
      choose("compose", 1),
      choose("compare", 0),
      choose("add", 1),
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.placement).toEqual({
      status: "ready",
      standardCode: "MA.3.NSO.1.2",
      rung: 2,
    });
  });

  it("rejects a question that is not next", () => {
    const result = scoreMathFiveCheck([choose("groups", 0)]);
    expect(result.ok).toBe(false);
  });
  it("rejects malformed answers without crashing the check endpoint", () => {
    expect(scoreMathFiveCheck([null] as unknown as MathFiveAnswer[]).ok).toBe(false);
    expect(scoreMathFiveCheck([choose("forms-a", 4)]).ok).toBe(false);
  });
  it("does not reward clicking the first choice throughout", () => {
    const result = scoreMathFiveCheck(["forms-a", "groups", "compose", "compare", "add"].map((id) => choose(id, 0)));
    expect(result.ok && result.placement.status).toBe("ready");
    expect(result.ok && result.scored.filter((row) => row.correct).length).toBe(2);
  });
  it("uses a different worked example for the floor retry", () => {
    const result = scoreMathFiveCheck([choose("forms-a", 1)]);
    expect(result.ok && result.nextItem?.example).not.toContain("432");
    expect(result.ok && result.nextItem?.example).not.toContain("400 + 30 + 2");
  });
});
