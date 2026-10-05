/**
 * Saved math starting point from the forthcoming 5-question diagnostic.
 * Until that slice persists a code, generation and the subject buffet stay closed.
 */

export function hasSavedMathPlacement(code?: string | null): boolean {
  return Boolean(code?.trim());
}

export function canGenerateLearningActivity(code?: string | null): boolean {
  return hasSavedMathPlacement(code);
}

export const MATH_PLACEMENT_REQUIRED =
  "The captain does not have a math starting point yet. Do not generate a new activity. Help with camp needs at the wreck.";
