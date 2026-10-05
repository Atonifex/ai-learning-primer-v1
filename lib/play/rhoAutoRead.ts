export const RHO_AUTO_READ_KEY = "primer.rhoTtsAutoRead";

export type RhoSpeechMode = "automatic" | "manual";

/**
 * Saved preference. "1" is on, "0" is off.
 * With no saved value, reading stays on unless `defaultOff` (local `next dev`).
 */
export function storedRhoAutoRead(value: string | null, defaultOff = false): boolean {
  if (value === "1") return true;
  if (value === "0") return false;
  return !defaultOff;
}

/**
 * Whether this line should call paid /api/tts.
 * Automatic reading is the cost path on every finished Rho turn.
 * Manual Hear Rho stays available when automatic reading is off.
 * Voice mute skips both.
 */
export function rhoSpeechPlan(input: {
  mode: RhoSpeechMode;
  autoRead: boolean;
  muted: boolean;
}): "speak" | "skip" {
  if (input.muted) return "skip";
  if (input.mode === "automatic" && !input.autoRead) return "skip";
  return "speak";
}
