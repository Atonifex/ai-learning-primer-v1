import { describe, expect, it } from "vitest";
import { isTonightSliceCode } from "../curriculum/tonightSlice";
import {
  applyMathDiagnosticAnswer,
  exampleIsNotTheScoredPrompt,
  freshMathDiagnostic,
  mathPlacementCopy,
} from "./mathDiagnostic";
import { SUBJECT_CHECK_LADDERS, ladderForSubject } from "./subjectChecks";

describe("subject starting-point checks", () => {
  it("uses a fresh example and a seeded code on every rung", () => {
    for (const ladder of Object.values(SUBJECT_CHECK_LADDERS)) {
      expect(ladder.map((item) => item.rung)).toEqual([0, 1, 2]);
      for (const item of ladder) {
        expect(exampleIsNotTheScoredPrompt(item)).toBe(true);
        expect(isTonightSliceCode(item.standardCode)).toBe(true);
        expect(item.choices).toHaveLength(3);
      }
    }
  });

  it("stops below the catalog for ELA without inventing an earlier code", () => {
    const ladder = ladderForSubject("ela_g3");
    expect(ladder?.[0]?.standardCode).toBe("ELA.3.V.1.3");
    let state = freshMathDiagnostic();
    state = applyMathDiagnosticAnswer(state, false, ladder!);
    state = applyMathDiagnosticAnswer(state, false, ladder!);
    expect(state.placement.status).toBe("below_catalog");
    const copy = mathPlacementCopy(state.placement);
    expect(copy).toContain("will not guess a grade 2 code");
    expect(copy).not.toMatch(/ELA\.2\.|SC\.2\.|SS\.2\./);
  });

  it("climbs science to the plant rung and social studies to sources", () => {
    let science = freshMathDiagnostic();
    const scienceLadder = ladderForSubject("science_g3")!;
    for (let i = 0; i < 6; i += 1) science = applyMathDiagnosticAnswer(science, true, scienceLadder);
    expect(science.placement).toEqual({
      status: "above_ladder",
      standardCode: "SC.3.L.14.1",
      rung: 2,
    });

    let social = freshMathDiagnostic();
    const socialLadder = ladderForSubject("social_studies_g3")!;
    for (let i = 0; i < 6; i += 1) social = applyMathDiagnosticAnswer(social, true, socialLadder);
    expect(social.placement).toMatchObject({
      status: "above_ladder",
      standardCode: "SS.3.A.1.1",
    });
    expect(ladderForSubject("art")).toBeNull();
  });
});
