/**
 * MASTER_VISION_PLAN §4.6 — tonight's teaching corpus.
 * Overlay quiz evidence must use codes from this set, never invented ones.
 */
export const TONIGHT_SLICE_CODES = [
  // Math
  "MA.3.NSO.1.1",
  "MA.3.NSO.1.2",
  "MA.3.NSO.1.3",
  "MA.3.NSO.2.1",
  "MA.3.NSO.2.2",
  "MA.3.NSO.2.3",
  "MA.3.AR.3.1",
  "MA.3.GR.2.1",
  "MA.3.DP.1.1",
  "MA.3.M.1.1",
  // ELA
  "ELA.3.R.2.1",
  "ELA.3.R.2.2",
  "ELA.3.R.2.3",
  "ELA.3.R.3.2",
  "ELA.3.C.1.2",
  "ELA.3.C.1.3",
  "ELA.3.C.1.4",
  "ELA.3.C.2.1",
  "ELA.3.V.1.3",
  "ELA.3.F.1.4",
  // Science
  "SC.3.N.1.1",
  "SC.3.N.1.3",
  "SC.3.N.1.6",
  "SC.3.N.1.7",
  "SC.3.E.6.1",
  "SC.3.P.8.1",
  "SC.3.P.8.3",
  "SC.3.L.14.1",
  "SC.3.L.15.1",
  "SC.3.L.17.2",
  // Social studies
  "SS.3.A.1.1",
  "SS.3.A.1.2",
  "SS.3.A.1.3",
  "SS.3.G.1.1",
  "SS.3.G.1.2",
  "SS.3.G.1.4",
  "SS.3.G.1.6",
  "SS.3.E.1.1",
  "SS.3.E.1.3",
  "SS.3.CG.2.1",
] as const;

const SLICE = new Set<string>(TONIGHT_SLICE_CODES);

export function isTonightSliceCode(code: string): boolean {
  return SLICE.has(code);
}

export function filterTonightSliceCodes(codes: string[]): string[] {
  return [...new Set(codes.filter((code) => SLICE.has(code)))];
}
