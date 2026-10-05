import { describe, expect, it } from "vitest";
import { EMPTY_INTRO_DEAL, advanceIntroDeal, introChoices, introMedia, parseIntroDeal, type IntroShare } from "./introDeal";
describe("captain's opening deal", () => {
  for (const share of [10, 15, 20] as IntroShare[]) it(`preserves the accepted ${share}% through completion and replay`, () => {
    let state = advanceIntroDeal(EMPTY_INTRO_DEAL, "ended");
    if (share >= 15) { state = advanceIntroDeal(state, "no"); expect(introChoices(state.phase)).toEqual([]); state = advanceIntroDeal(state, "ended"); }
    if (share === 20) { state = advanceIntroDeal(state, "no"); state = advanceIntroDeal(state, "ended"); }
    state = advanceIntroDeal(state, "yes");
    expect(state).toMatchObject({ phase: "continuation", acceptedShare: share });
    expect(advanceIntroDeal(state, "no")).toEqual(state);
    state = advanceIntroDeal(state, "ended");
    expect(parseIntroDeal(JSON.parse(JSON.stringify(state)))).toEqual({ version: 3, phase: "complete", acceptedShare: share });
    expect(advanceIntroDeal(state, "yes")).toEqual(state);
  });
  it("only permits Yes at the final offer and no clicks during speech", () => {
    expect(introChoices("offer20")).toEqual(["yes"]);
    for (const phase of ["briefing", "counter15", "counter20", "continuation", "complete"] as const) expect(introChoices(phase)).toEqual([]);
    expect(advanceIntroDeal({ version: 3, phase: "offer20", acceptedShare: null }, "no").phase).toBe("offer20");
  });
  it("loops only silent waiting media; spoken offers play once", () => {
    expect(introMedia("offer10")).toMatchObject({ id: "waiting-loop", loop: true });
    expect(introMedia("offer15").src).toBe(introMedia("offer20").src);
    expect(introMedia("counter15")).toMatchObject({ id: "offer15", loop: false });
    expect(introMedia("continuation").loop).toBe(false);
  });
  it("rejects corrupt persisted or impossible accepted states", () => {
    expect(parseIntroDeal({ version: 3, phase: "continuation", acceptedShare: null })).toEqual(EMPTY_INTRO_DEAL);
    expect(parseIntroDeal({ version: 3, phase: "offer10", acceptedShare: 20 })).toEqual(EMPTY_INTRO_DEAL);
    expect(parseIntroDeal({ version: 3, phase: "complete", acceptedShare: 99 })).toEqual(EMPTY_INTRO_DEAL);
  });
});
