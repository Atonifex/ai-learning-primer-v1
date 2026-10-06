import { describe, expect, it } from "vitest";
import {
  applyCampGrant,
  emptyCamp,
  formatCampForPrompt,
  foundCrewCount,
  parseStoredCamp,
  toCampPublic,
  MATH_CHECK_CAMP_LINE,
  MATH_CHECK_GRANT,
  WRECK_SALVAGE_GRANT,
} from "./camp";

describe("camp engine", () => {
  it("starts as a bare clearing with five missing crew and no stockpiles", () => {
    const camp = emptyCamp();
    expect(camp.stage).toBe("clearing");
    expect(camp.rations).toBe(0);
    expect(camp.scrap).toBe(0);
    expect(camp.timber).toBe(0);
    expect(camp.canvas).toBe(0);
    expect(camp.crew).toHaveLength(5);
    expect(camp.crew.every((slot) => slot.status === "missing")).toBe(true);
    expect(foundCrewCount(camp.crew)).toBe(0);
    const pub = toCampPublic(camp);
    expect(pub.founded).toBe(false);
    expect(pub.stageLabel).toBe("Clearing");
    expect(pub.crewTotal).toBe(5);
  });

  it("wreck salvage founds a crate pile once and will not double-pay", () => {
    const first = applyCampGrant(emptyCamp(), WRECK_SALVAGE_GRANT);
    expect(first.stage).toBe("crates");
    expect(first.rations).toBe(2);
    expect(first.scrap).toBe(1);
    expect(first.appliedGrantIds).toEqual(["wreck-salvage"]);
    expect(toCampPublic(first).founded).toBe(true);

    const second = applyCampGrant(first, WRECK_SALVAGE_GRANT);
    expect(second).toEqual(first);
  });

  it("math check pitches a tent, sets one ration aside, and does not find a crew member", () => {
    const afterWreck = applyCampGrant(emptyCamp(), WRECK_SALVAGE_GRANT);
    const first = applyCampGrant(afterWreck, MATH_CHECK_GRANT);
    expect(first.stage).toBe("tent");
    expect(first.rations).toBe(3);
    expect(first.canvas).toBe(1);
    expect(foundCrewCount(first.crew)).toBe(0);
    expect(applyCampGrant(first, MATH_CHECK_GRANT)).toEqual(first);
    expect(MATH_CHECK_CAMP_LINE).toMatch(/tent/i);
    expect(MATH_CHECK_CAMP_LINE).toMatch(/still missing/i);
  });

  it("keeps the higher camp stage and can ping then recover a crew slot", () => {
    const signaled = applyCampGrant(emptyCamp(), {
      id: "math-check",
      canvas: 1,
      timber: 1,
      minStage: "tent",
      signalCrewId: "tem",
    });
    expect(signaled.stage).toBe("tent");
    expect(signaled.crew.find((slot) => slot.id === "tem")?.status).toBe("signaled");
    expect(foundCrewCount(signaled.crew)).toBe(0);

    const found = applyCampGrant(signaled, {
      id: "search-party",
      minStage: "crates",
      findCrewId: "tem",
    });
    expect(found.stage).toBe("tent");
    expect(found.crew.find((slot) => slot.id === "tem")?.status).toBe("found");
    expect(foundCrewCount(found.crew)).toBe(1);
  });

  it("rebuilds five named slots from stored json and ignores unknown crew", () => {
    const parsed = parseStoredCamp({
      stage: "fire",
      rations: 4,
      appliedGrantIds: ["wreck-salvage"],
      crew: [
        { id: "mara", status: "found" },
        { id: "ghost", status: "found" },
        { id: "pell", status: "nope" },
      ],
    });
    expect(parsed.stage).toBe("fire");
    expect(parsed.rations).toBe(4);
    expect(parsed.crew).toHaveLength(5);
    expect(parsed.crew.find((slot) => slot.id === "mara")?.status).toBe("found");
    expect(parsed.crew.find((slot) => slot.id === "pell")?.status).toBe("missing");
    expect(parsed.crew.map((slot) => slot.id)).not.toContain("ghost");
  });

  it("tells Rho the saved camp so invented buildings fail the prompt test", () => {
    const prompt = formatCampForPrompt(toCampPublic(applyCampGrant(emptyCamp(), WRECK_SALVAGE_GRANT)));
    expect(prompt).toContain("Crate pile");
    expect(prompt).toContain("Rations 2");
    expect(prompt).toContain("Still missing: Bosun Mara");
    expect(prompt).toContain("Do not invent extra buildings");
    expect(prompt).toContain("radio ping");
    expect(prompt).toContain("crafting tree");
  });
});
