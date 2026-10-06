/**
 * A finished five-question check counts as saved, including below_catalog
 * with no code. Generation still needs a code to start from.
 */

const SAVED_PLACEMENT = new Set(["ready", "below_catalog", "above_ladder"]);

export function hasSavedMathPlacement(code?: string | null, status?: string | null): boolean {
  if (status && SAVED_PLACEMENT.has(status)) return true;
  return Boolean(code?.trim());
}

export function canGenerateLearningActivity(code?: string | null, _status?: string | null): boolean {
  return Boolean(code?.trim());
}

export const MATH_PLACEMENT_REQUIRED =
  "The captain does not have a math starting point yet. Do not generate a new activity. Help with camp needs at the wreck.";
