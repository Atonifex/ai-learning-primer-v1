import { describe, expect, it } from "vitest";
import { buildAgentLearnUrl, isAgentPlaytestEnabled } from "./agentPlaytest";
import { TEST_CAPTAIN_PIN, TEST_CAPTAIN_USERNAME } from "./testCaptain";

describe("agent playtest", () => {
  it("exposes the seeded captain credentials agents should use", () => {
    expect(TEST_CAPTAIN_USERNAME).toBe("testcaptain");
    expect(TEST_CAPTAIN_PIN).toBe("1234");
  });

  it("builds learn URLs that skip first-run friction", () => {
    expect(buildAgentLearnUrl("sess1", "dialogue")).toBe("/learn/sess1?dialogue=1");
    expect(buildAgentLearnUrl("sess1", "board")).toBe("/learn/sess1?board=1");
    expect(buildAgentLearnUrl("sess1", "clip")).toBe("/learn/sess1?clip=1");
    expect(buildAgentLearnUrl("sess1", "none")).toBe("/learn/sess1");
  });

  it("allows playtest in development or localhost with PRIMER_AGENT_PLAYTEST", () => {
    expect(
      isAgentPlaytestEnabled("example.com", { nodeEnv: "development", agentFlag: null })
    ).toBe(true);
    expect(
      isAgentPlaytestEnabled("localhost:3000", { nodeEnv: "production", agentFlag: "1" })
    ).toBe(true);
    expect(
      isAgentPlaytestEnabled("primer.example", { nodeEnv: "production", agentFlag: "1" })
    ).toBe(false);
    expect(
      isAgentPlaytestEnabled("localhost", { nodeEnv: "production", agentFlag: null })
    ).toBe(false);
  });
});
