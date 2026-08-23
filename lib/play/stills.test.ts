import { describe, expect, it } from "vitest";
import { stillLabel, stillSrc, TUTORIAL_STILLS } from "./stills";
import {
  expandHiddenTurn,
  HIDDEN_TURN,
  isHiddenTurn,
} from "./hiddenTurns";
import { overlayMcItemsFromBankContent } from "./quizItems";

describe("stills catalog", () => {
  it("points every still at public/stills/tutorial with a label", () => {
    expect(stillSrc("rhoPortraitNeutral")).toBe(
      "/stills/tutorial/rho_portrait_neutral.webp"
    );
    expect(stillLabel("cinematicPoster")).toContain("Crash");
    expect(Object.keys(TUTORIAL_STILLS).length).toBeGreaterThanOrEqual(8);
  });
});

describe("hidden turns", () => {
  it("hides tutorial signals and expands them for luna", () => {
    expect(isHiddenTurn(HIDDEN_TURN.wreckApproach)).toBe(true);
    expect(isHiddenTurn("__quiz_result__ score=0")).toBe(true);
    expect(isHiddenTurn("__zpd_hint__ crate")).toBe(true);
    expect(isHiddenTurn("__reflection__ note")).toBe(true);
    expect(isHiddenTurn("__mission_start__ dune-ela")).toBe(true);
    expect(isHiddenTurn("hello Rho")).toBe(false);
    const expanded = expandHiddenTurn(HIDDEN_TURN.wreckApproach, "Hanzo");
    expect(expanded).toContain("Hanzo");
    expect(expanded).toContain("First Mate");
    expect(expanded).not.toContain("__wreck_approach__");
  });
});

describe("tutorial overlay quiz parser", () => {
  it("keeps multiple-choice items and drops free response", () => {
    const items = overlayMcItemsFromBankContent({
      quizItems: [
        {
          itemType: "multiple_choice",
          prompt: "Crate A?",
          choices: ["246", "2,406"],
          correctIndex: 1,
        },
        {
          itemType: "free_response",
          prompt: "Write 5,109 in expanded form.",
        },
      ],
    });
    expect(items).toHaveLength(1);
    expect(items[0]?.options).toHaveLength(2);
  });
});
