import { describe, expect, it } from "vitest";
import { parseMcItems } from "./quizItems";

describe("parseMcItems", () => {
  it("includes only multiple_choice bank rows (skips free_response until overlay supports it)", () => {
    const raw = {
      quizItems: [
        {
          itemType: "multiple_choice",
          prompt: "Q1",
          choices: ["a", "b"],
          correctIndex: 0,
        },
        {
          itemType: "free_response",
          prompt: "Write it in words.",
          sampleAnswer: "five",
        },
        {
          itemType: "multiple_choice",
          prompt: "Q2",
          choices: ["x", "y"],
          correctIndex: 1,
        },
      ],
    };
    expect(parseMcItems(raw)).toHaveLength(2);
    expect(parseMcItems(raw).map((i) => i.question)).toEqual(["Q1", "Q2"]);
  });
});
