/**
 * Model router for Primer. MASTER_VISION_PLAN §4.4 / A10.
 *
 * Live interaction (every hint, ZPD scaffold, and dialogue turn): `gpt-5.6-luna`.
 * Unit/chapter authoring: medium-reasoning model — NOT every turn.
 *
 * Do not silently swap luna for a larger chat model on the walk/talk/hint loop.
 */
export const LIVE_INTERACTION_MODEL = "gpt-5.6-luna";

/**
 * Medium reasoning — units/chapters after placement, or when evidence says the
 * sequence is wrong. Never the child-facing loop.
 */
export const PLANNING_MODEL = "gpt-5.4";

/** Memory extraction / cheap utilities — not the child-facing loop. */
export const UTILITY_MODEL = "gpt-5.4-nano";
