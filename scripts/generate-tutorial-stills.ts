/**
 * One-off generator for the tutorial stills pack (MASTER §4.12).
 * Run: npx tsx scripts/generate-tutorial-stills.ts
 *
 * Writes exact filenames from public/stills/tutorial/README.md.
 * Skips any file that already exists (so re-running only fills gaps).
 * Never overwrites; never throws on a single failure — logs and continues.
 */
import "dotenv/config";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const IMAGE_MODEL = "gpt-image-1.5" as const;
const OUT_DIR = path.join(process.cwd(), "public", "stills", "tutorial");

const STYLE_LOCK =
  "Style: Stardew Valley-inspired readable top-down world, slightly more modern and animated than pure SNES pixel art. Do not copy Stardew Valley or Pokemon character designs. Not a graphic-novel watercolor look. Consistent palette across the whole set: warm beach sand, teal ocean water, amber shipwreck wood, soft fog. Tone: wonder and urgency after a crash landing, family-friendly, no gore, no on-screen death, no explicit violence. Game asset, clean silhouette, no text overlays, no watermark, no UI chrome.";

const RHO_LOCK =
  "Rho is a humanoid AI First Mate: young-adult build, calm and competent, warm but synthetic presence (soft luminous eyes, subtle seams or a visor line hinting she is a machine), practical Guild-scout jacket. Never a childish cartoon mascot, never the hero of the shot. Keep her face, hairstyle, and clothing consistent across every image she appears in.";

const CAPTAIN_LOCK =
  "The captain is a generic young shipwreck survivor (grade-school age, gender-ambiguous/neutral design), simple practical clothing, temporary placeholder appearance — nothing flashy or cosmetic-locked.";

type AssetSpec = {
  filename: string;
  prompt: string;
  size: "1024x1024" | "1024x1536" | "1536x1024";
  quality: "medium" | "high";
  background: "transparent" | "opaque";
};

const ASSETS: AssetSpec[] = [
  // Priority 1-3: Rho portraits
  {
    filename: "rho_portrait_neutral.webp",
    prompt: `Portrait, upper-body bust shot of Rho looking directly at the viewer with a calm, neutral, attentive expression. ${RHO_LOCK} Background: soft dark teal gradient panel (#0c2a32) suitable for a dialogue UI, no scenery. ${STYLE_LOCK}`,
    size: "1024x1536",
    quality: "high",
    background: "opaque",
  },
  {
    filename: "rho_portrait_encouraging.webp",
    prompt: `Portrait, upper-body bust shot of Rho with a warm, encouraging half-smile, like a supportive coach after a child's effort. ${RHO_LOCK} Background: soft dark teal gradient panel (#0c2a32) suitable for a dialogue UI, no scenery. ${STYLE_LOCK}`,
    size: "1024x1536",
    quality: "high",
    background: "opaque",
  },
  {
    filename: "rho_portrait_thinking.webp",
    prompt: `Portrait, upper-body bust shot of Rho tilted slightly, listening/thinking pose, one hand near her chin, thoughtful expression. ${RHO_LOCK} Background: soft dark teal gradient panel (#0c2a32) suitable for a dialogue UI, no scenery. ${STYLE_LOCK}`,
    size: "1024x1536",
    quality: "high",
    background: "opaque",
  },
  // Priority 4: cinematic poster
  {
    filename: "cinematic_poster.webp",
    prompt: `Wide cinematic intro poster: a small Guild scout airship crash-landed on a golden dawn beach after a storm, wreckage and crates in the surf, fog drifting in the treeline behind, dramatic but hopeful morning light. Suitable as a title-screen background. ${STYLE_LOCK}`,
    size: "1536x1024",
    quality: "high",
    background: "opaque",
  },
  // Priority 5: captain sprite
  {
    filename: "captain_placeholder_sprite.webp",
    prompt: `Top-down (bird's-eye) game character sprite of the captain standing in a simple idle pose, facing forward/down, readable at small size on a tile grid. ${CAPTAIN_LOCK} Isolated on a plain background, no ground shadow scenery, ready to be placed on a map tile. ${STYLE_LOCK}`,
    size: "1024x1024",
    quality: "medium",
    background: "transparent",
  },
  // Priority 6: Rho overworld sprite
  {
    filename: "rho_overworld_sprite.webp",
    prompt: `Top-down (bird's-eye) game character sprite of Rho standing in a simple idle follower pose, facing forward/down, readable at small size on a tile grid. ${RHO_LOCK} Isolated on a plain background, no ground shadow scenery, ready to be placed on a map tile. ${STYLE_LOCK}`,
    size: "1024x1024",
    quality: "medium",
    background: "transparent",
  },
  // Priority 7
  {
    filename: "wreck_pile_close.webp",
    prompt: `Close-up top-down/isometric-leaning view of a salvage wreck pile: broken airship hull plating, splintered amber wood, rope, spilled crates, half-buried in beach sand, clickable-highlight-worthy focal object for a game map. ${STYLE_LOCK}`,
    size: "1536x1024",
    quality: "high",
    background: "opaque",
  },
  // Priority 8
  {
    filename: "crash_aftermath_beach.webp",
    prompt: `Dawn beach overworld establishing shot: wreckage scattered across golden sand, gentle teal surf, soft fog at the edges of the frame, treeline in the distance. Top-down/slightly-angled game background suitable as the starting camera view. ${STYLE_LOCK}`,
    size: "1536x1024",
    quality: "high",
    background: "opaque",
  },
  {
    filename: "dune.webp",
    prompt: `Sandy dune location on the island, tall grass tufts, soft wind-blown texture, warm daylight, top-down/slightly-angled game map-pin background tile. ${STYLE_LOCK}`,
    size: "1536x1024",
    quality: "medium",
    background: "opaque",
  },
  {
    filename: "treeline.webp",
    prompt: `Edge of a dense jungle/forest treeline on the island, dappled sunlight, inviting but slightly mysterious, top-down/slightly-angled game map-pin background tile. ${STYLE_LOCK}`,
    size: "1536x1024",
    quality: "medium",
    background: "opaque",
  },
  {
    filename: "creek.webp",
    prompt: `Small fresh-water creek winding through rocks and greenery on the island, clear water, dappled light, top-down/slightly-angled game map-pin background tile. ${STYLE_LOCK}`,
    size: "1536x1024",
    quality: "medium",
    background: "opaque",
  },
  {
    filename: "camp_site_empty.webp",
    prompt: `An empty, not-yet-built potential camp site clearing on the island: flat ground, a fire-pit-shaped bare patch, surrounding palms, ready to be developed. Top-down/slightly-angled game map-pin background tile. ${STYLE_LOCK}`,
    size: "1536x1024",
    quality: "medium",
    background: "opaque",
  },
  // Priority 9 (optional)
  {
    filename: "food_crates.webp",
    prompt: `Close-up prop shot of salvaged wooden ration crates, some cracked open showing packaged supplies, sitting on the beach. Game prop illustration for a food-emergency story beat. ${STYLE_LOCK}`,
    size: "1024x1024",
    quality: "medium",
    background: "opaque",
  },
  {
    filename: "torn_guild_orders.webp",
    prompt: `Close-up prop shot of a torn, water-stained page from the Guild scout ship's log/orders, mostly illegible smudged handwriting (no real legible text, this is a prop not a document), aged parchment texture, readable as a small in-world reading activity prop. ${STYLE_LOCK}`,
    size: "1024x1024",
    quality: "medium",
    background: "opaque",
  },
  {
    filename: "map_parchment_unexplored.webp",
    prompt: `A parchment-style world map of the island, edges of the map fading into fog-of-war/unknown territory (Elden-Ring-like sense that the island is bigger than expected), only a small starting region inked in near the beach. Overlay UI background, no modern text labels. ${STYLE_LOCK}`,
    size: "1536x1024",
    quality: "high",
    background: "opaque",
  },
];

async function generateOne(spec: AssetSpec): Promise<void> {
  const outPath = path.join(OUT_DIR, spec.filename);
  if (existsSync(outPath)) {
    console.log(`SKIP  ${spec.filename} (already exists)`);
    return;
  }

  try {
    const response = await openai.images.generate({
      model: IMAGE_MODEL,
      prompt: spec.prompt,
      quality: spec.quality,
      n: 1,
      size: spec.size,
      output_format: "webp",
      background: spec.background,
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) {
      console.log(`FAIL  ${spec.filename} (no image data returned)`);
      return;
    }

    await writeFile(outPath, Buffer.from(b64, "base64"));
    console.log(`OK    ${spec.filename}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`FAIL  ${spec.filename} (${message})`);
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set (check .env). Aborting.");
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

  for (const spec of ASSETS) {
    await generateOne(spec);
  }

  console.log("\nDone. Verify filenames against lib/play/stills.ts and README.md.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
