import { describe, expect, it } from "vitest";
import { MAPMAKERS_WORLD_BIBLE } from "../ai/promptTemplates/_shared_castaway_world";
describe("onboarding and Rho share one premise", () => {
  it("allows the planet trade already disclosed while preserving later discoveries", () => {
    expect(MAPMAKERS_WORLD_BIBLE).toContain("Merchant Corporation");
    expect(MAPMAKERS_WORLD_BIBLE).toContain("Trade between planets is explained in the opening");
    expect(MAPMAKERS_WORLD_BIBLE).not.toContain("do not foreshadow space");
    expect(MAPMAKERS_WORLD_BIBLE).toContain("MUST NOT reveal early");
    expect(MAPMAKERS_WORLD_BIBLE).toContain("no settlements at arrival");
  });
  it("requires the actual saved share instead of assigning every captain twenty percent", () => {
    expect(MAPMAKERS_WORLD_BIBLE).toContain("saved STORY_CONTINUITY acceptedShare");
    expect(MAPMAKERS_WORLD_BIBLE).toContain("never assume which offer they accepted or change it");
    expect(MAPMAKERS_WORLD_BIBLE).toContain("not an implemented payout system");
  });
});
