/**
 * Tutorial stills pack (§4.12 / §11 Step 1).
 * If a file is missing, UI must show a labeled TODO(stills) rectangle — never crash.
 */

export const STILLS_DIR = "/stills/tutorial";
export const CINEMATIC_MP4 = "/cinematics/crash_landing.mp4";

export type StillKey =
  | "cinematicPoster"
  | "crashAftermathBeach"
  | "wreckPileClose"
  | "rhoPortraitNeutral"
  | "rhoPortraitEncouraging"
  | "rhoPortraitThinking"
  | "rhoOverworldSprite"
  | "captainPlaceholderSprite"
  | "dune"
  | "treeline"
  | "creek"
  | "campSiteEmpty"
  | "foodCrates"
  | "tornGuildOrders"
  | "mapParchmentUnexplored";

export type StillSpec = {
  key: StillKey;
  filename: string;
  /** Shown on the placeholder rectangle when the file is missing. */
  label: string;
};

export const TUTORIAL_STILLS: Record<StillKey, StillSpec> = {
  cinematicPoster: {
    key: "cinematicPoster",
    filename: "cinematic_poster.webp",
    label: "Crash-landing poster",
  },
  crashAftermathBeach: {
    key: "crashAftermathBeach",
    filename: "crash_aftermath_beach.webp",
    label: "Dawn beach wreckage",
  },
  wreckPileClose: {
    key: "wreckPileClose",
    filename: "wreck_pile_close.webp",
    label: "Salvage wreck pile",
  },
  rhoPortraitNeutral: {
    key: "rhoPortraitNeutral",
    filename: "rho_portrait_neutral.webp",
    label: "Rho — First Mate",
  },
  rhoPortraitEncouraging: {
    key: "rhoPortraitEncouraging",
    filename: "rho_portrait_encouraging.webp",
    label: "Rho — encouraging",
  },
  rhoPortraitThinking: {
    key: "rhoPortraitThinking",
    filename: "rho_portrait_thinking.webp",
    label: "Rho — listening",
  },
  rhoOverworldSprite: {
    key: "rhoOverworldSprite",
    filename: "rho_overworld_sprite.webp",
    label: "Rho follower sprite",
  },
  captainPlaceholderSprite: {
    key: "captainPlaceholderSprite",
    filename: "captain_placeholder_sprite.webp",
    label: "Captain (placeholder)",
  },
  dune: { key: "dune", filename: "dune.webp", label: "Dune" },
  treeline: { key: "treeline", filename: "treeline.webp", label: "Treeline" },
  creek: { key: "creek", filename: "creek.webp", label: "Creek" },
  campSiteEmpty: {
    key: "campSiteEmpty",
    filename: "camp_site_empty.webp",
    label: "Camp site",
  },
  foodCrates: {
    key: "foodCrates",
    filename: "food_crates.webp",
    label: "Food crates",
  },
  tornGuildOrders: {
    key: "tornGuildOrders",
    filename: "torn_guild_orders.webp",
    label: "Torn Guild orders",
  },
  mapParchmentUnexplored: {
    key: "mapParchmentUnexplored",
    filename: "map_parchment_unexplored.webp",
    label: "Unexplored parchment map",
  },
};

export function stillSrc(key: StillKey): string {
  return `${STILLS_DIR}/${TUTORIAL_STILLS[key].filename}`;
}

export function stillLabel(key: StillKey): string {
  return TUTORIAL_STILLS[key].label;
}
