/**
 * One-off fix: regenerate the two overworld sprites as PNG (reliable alpha),
 * then re-encode to WEBP with sharp, preserving transparency.
 * Run: npx tsx scripts/fix-sprite-transparency.ts
 */
import "dotenv/config";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import OpenAI from "openai";
import sharp from "sharp";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const IMAGE_MODEL = "gpt-image-1.5" as const;
const OUT_DIR = path.join(process.cwd(), "public", "stills", "tutorial");

const STYLE_LOCK =
  "Style: Stardew Valley-inspired readable top-down world, slightly more modern and animated than pure SNES pixel art. Do not copy Stardew Valley or Pokemon character designs. Not a graphic-novel watercolor look. Game asset, clean silhouette, no text overlays, no watermark, no UI chrome.";

const RHO_LOCK =
  "Rho is a humanoid AI First Mate: young-adult build, calm and competent, warm but synthetic presence (soft luminous eyes, subtle seams or a visor line hinting she is a machine), practical Guild-scout jacket.";

const CAPTAIN_LOCK =
  "The captain is a generic young shipwreck survivor (grade-school age, gender-ambiguous/neutral design), simple practical clothing, clearly visible friendly face, temporary placeholder appearance.";

type Spec = { filename: string; prompt: string };

const SPECS: Spec[] = [
  {
    filename: "captain_placeholder_sprite.webp",
    prompt: `Top-down (bird's-eye) game character sprite of the captain standing in a simple idle pose, facing forward/down, readable at small size on a tile grid, full body visible head to feet. ${CAPTAIN_LOCK} Isolated single character centered in frame on a plain flat white background so it can be cut out, no ground, no shadow, no scenery. ${STYLE_LOCK}`,
  },
  {
    filename: "rho_overworld_sprite.webp",
    prompt: `Top-down (bird's-eye) game character sprite of Rho standing in a simple idle follower pose, facing forward/down, readable at small size on a tile grid, full body visible head to feet. ${RHO_LOCK} Isolated single character centered in frame on a plain flat white background so it can be cut out, no ground, no shadow, no scenery. ${STYLE_LOCK}`,
  },
];

async function run() {
  for (const spec of SPECS) {
    try {
      const response = await openai.images.generate({
        model: IMAGE_MODEL,
        prompt: spec.prompt,
        quality: "medium",
        n: 1,
        size: "1024x1024",
        output_format: "png",
        background: "transparent",
      });
      const b64 = response.data?.[0]?.b64_json;
      if (!b64) {
        console.log(`FAIL  ${spec.filename} (no image data)`);
        continue;
      }
      const pngBuf = Buffer.from(b64, "base64");
      const meta = await sharp(pngBuf).metadata();
      const webpBuf = await sharp(pngBuf)
        .webp({ lossless: false, quality: 90, alphaQuality: 100 })
        .toBuffer();
      await writeFile(path.join(OUT_DIR, spec.filename), webpBuf);
      console.log(
        `OK    ${spec.filename} (source alpha channel: ${meta.hasAlpha ? "yes" : "no"})`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(`FAIL  ${spec.filename} (${message})`);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
