/**
 * Model router for Primer.
 *
 * Live interaction (every hint and turn): `gpt-5.6-luna` — cheap and fast.
 * Unit/chapter authoring: a medium-reasoning model (not wired in Step 1).
 *
 * Do not use the live model for heavy planning. Do not silently swap luna
 * for a larger chat model on the walk/talk loop.
 */
export const LIVE_INTERACTION_MODEL = "gpt-5.6-luna";

/** Memory extraction / cheap utilities — not the child-facing loop. */
export const UTILITY_MODEL = "gpt-5.4-nano";
