import { describe, expect, it } from "vitest";
import { HIDDEN_TURN } from "./hiddenTurns";
import { changeWorkspace, latestExchange, visibleDialogue, WORKSPACE_PANELS, RHO_SPEAKER } from "./dialogueLayout";

describe("bottom dialogue presentation", () => {
  const user = (content: string) => ({ role: "USER" as const, content });
  const rho = (content: string) => ({ role: "ASSISTANT" as const, content });
  it("shows the latest learner exchange while hiding orchestration turns", () => {
    const messages = [user("old question"), rho("old reply"), user(HIDDEN_TURN.subjectCheckReview), user("new question"), rho("first part"), { ...rho(""), streaming: true }];
    expect(latestExchange(messages)).toEqual(messages.slice(3));
    expect(visibleDialogue(messages)).not.toContain(messages[2]);
  });
  it("shows a greeting, then a pending learner turn without repeating old replies", () => {
    expect(latestExchange([rho("earlier"), rho("hello")])).toEqual([rho("hello")]);
    expect(latestExchange([rho("hello"), user("why?")])).toEqual([user("why?")]);
    expect(latestExchange([user(HIDDEN_TURN.subjectCheckReview)])).toEqual([]);
  });
  it("allows only one workspace and ignores stale close callbacks", () => {
    const opened = changeWorkspace("history", "quiz", true);
    expect(opened).toBe("quiz");
    expect(changeWorkspace(opened, "history", false)).toBe("quiz");
    expect(changeWorkspace(opened, "quiz", false)).toBeNull();
  });
  it("gives spatial tools more room and keeps a speaker's voice explicit", () => {
    expect(WORKSPACE_PANELS.map.wide).toBe(true);
    expect(WORKSPACE_PANELS.garden.wide).toBe(true);
    expect(WORKSPACE_PANELS.history.wide).toBe(false);
    expect(RHO_SPEAKER).toMatchObject({ name: "Rho", role: "First Mate", voice: "rho" });
  });
});
