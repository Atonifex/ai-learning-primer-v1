/**
 * ZPD ladder for the first overlay quiz (§4.4).
 * wrong/stuck → hint → worked example → fade support.
 * Not a static retry of the same MC items.
 */

export type ZpdStage = "hint" | "example" | "fade" | "done";

export const WRECK_WORKED_EXAMPLE = {
  crateLabel: "Crate A — two thousand four hundred six",
  standardForm: "2,406",
  expandedForm: "2,000 + 400 + 6",
  wordForm: "two thousand four hundred six",
  fadePrompt: "Now you try a smaller crate: write 1,204 in expanded form. Talk or type a little.",
};

export function nextZpdStage(current: ZpdStage | null, missedCount: number): ZpdStage {
  if (missedCount <= 0) return "done";
  if (current === null) return "hint";
  if (current === "hint") return "example";
  if (current === "example") return "fade";
  return "done";
}

export function zpdSupportLevel(stage: ZpdStage): "full" | "example" | "faded" | "none" {
  if (stage === "hint") return "full";
  if (stage === "example") return "example";
  if (stage === "fade") return "faded";
  return "none";
}
