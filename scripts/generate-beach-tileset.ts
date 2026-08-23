/**
 * One-off generator for the beach ground tileset (U1 style lock).
 * Run: npx tsx scripts/generate-beach-tileset.ts
 *
 * Two variants per TileKind (water, foam, sand, rock) so beachWorld.ts can
 * alternate them per-tile instead of drawing flat Graphics rects. Each raw
 * generation gets a quadrant-swap "offset" pass + a blurred seam-heal along
 * the resulting center cross — a standard tileable-texture trick — because
 * gpt-image-1.5 has no native seamless-tiling mode. This is a first pass:
 * good enough at 48px in-game, not pixel-perfect at full res.
 */
import "dotenv/config";
import path from "node:path";
import { existsSync, statSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import OpenAI from "openai";
import sharp from "sharp";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const IMAGE_MODEL = "gpt-image-1.5" as const;
const OUT_DIR = path.join(process.cwd(), "public", "tiles", "beach");
const RAW_SIZE = 1024;
const FINAL_SIZE = 96; // 2x TILE (48) for crisp downscale in Pixi

const STYLE_LOCK =
  "Stardew Valley-inspired readable top-down game art, slightly more modern and animated than pure SNES pixel art. Camera looking straight down (top-down orthographic), perfectly flat and even lighting, no directional shadow, no vignette, no dark border, no frame, brightness uniform edge-to-edge. Square texture swatch meant to repeat edge-to-edge as a tileable ground texture. No text, no watermark, no UI chrome, no characters, no objects sitting on top of the ground.";

type TileKind = "water" | "foam" | "sand" | "rock";

const PROMPTS: Record<TileKind, string> = {
  sand: `Warm golden beach sand ground texture, fine grain with subtle small ripples, muted warm amber-tan palette. ${STYLE_LOCK}`,
  foam: `Shallow turquoise water ground texture with soft white foam and gentle ripple lines, teal palette. ${STYLE_LOCK}`,
  water: `Deep teal ocean water ground texture, gentle ripple pattern, deep teal-navy palette. ${STYLE_LOCK}`,
  rock: `Rugged grey stone ground texture with small cracks and pebbles, cool grey palette. ${STYLE_LOCK}`,
};

const VARIANT_SEEDS: Record<TileKind, string[]> = {
  sand: [
    "slightly finer grain, a couple of tiny shell fragments",
    "slightly coarser grain, a thin driftwood-colored ripple line",
  ],
  foam: ["smaller, denser foam bubbles", "larger, looser foam swirls"],
  water: ["tighter ripple spacing", "looser, calmer ripple spacing"],
  rock: ["more visible cracks", "more small loose pebbles, fewer cracks"],
};

/** Swap diagonal quadrants: pushes the tile's own edges to the center as a cross, exposing what needs healing. */
async function offsetQuadrants(buf: Buffer, size: number): Promise<Buffer> {
  const half = size / 2;
  const base = sharp(buf).resize(size, size).removeAlpha();
  const baseBuf = await base.toBuffer();
  const [tl, tr, bl, br] = await Promise.all([
    sharp(baseBuf).extract({ left: 0, top: 0, width: half, height: half }).toBuffer(),
    sharp(baseBuf).extract({ left: half, top: 0, width: half, height: half }).toBuffer(),
    sharp(baseBuf).extract({ left: 0, top: half, width: half, height: half }).toBuffer(),
    sharp(baseBuf)
      .extract({ left: half, top: half, width: half, height: half })
      .toBuffer(),
  ]);
  return sharp({
    create: { width: size, height: size, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .composite([
      { input: br, left: 0, top: 0 },
      { input: bl, left: half, top: 0 },
      { input: tr, left: 0, top: half },
      { input: tl, left: half, top: half },
    ])
    .png()
    .toBuffer();
}

/** Blend a blurred copy over the offset image, masked to a soft cross band at the center seam. */
async function healSeam(offsetBuf: Buffer, size: number): Promise<Buffer> {
  const half = size / 2;
  const bandPx = Math.round(size * 0.14);
  const blurred = await sharp(offsetBuf).blur(20).toBuffer();

  const maskSvg = Buffer.from(
    `<svg width="${size}" height="${size}">
      <rect x="0" y="${half - bandPx}" width="${size}" height="${bandPx * 2}" fill="white"/>
      <rect x="${half - bandPx}" y="0" width="${bandPx * 2}" height="${size}" fill="white"/>
    </svg>`
  );
  const mask = await sharp(maskSvg).png().toBuffer();
  const softMask = await sharp(mask).blur(bandPx * 0.6).grayscale().toBuffer();

  const blurredWithAlpha = await sharp(blurred)
    .removeAlpha()
    .joinChannel(softMask)
    .png()
    .toBuffer();

  return sharp(offsetBuf).composite([{ input: blurredWithAlpha }]).png().toBuffer();
}

async function generateVariant(kind: TileKind, variantIndex: number): Promise<void> {
  const filename = `${kind}_${variantIndex + 1}.webp`;
  const outPath = path.join(OUT_DIR, filename);
  if (existsSync(outPath) && statSync(outPath).size > 0) {
    console.log(`SKIP  ${filename} (already exists)`);
    return;
  }
  const prompt = `${PROMPTS[kind]} Variant detail: ${VARIANT_SEEDS[kind][variantIndex]}.`;

  try {
    const response = await openai.images.generate({
      model: IMAGE_MODEL,
      prompt,
      quality: "high",
      n: 1,
      size: "1024x1024",
      output_format: "png",
      background: "opaque",
    });
    const b64 = response.data?.[0]?.b64_json;
    if (!b64) {
      console.log(`FAIL  ${filename} (no image data returned)`);
      return;
    }
    const raw = Buffer.from(b64, "base64");
    const offset = await offsetQuadrants(raw, RAW_SIZE);
    const healed = await healSeam(offset, RAW_SIZE);
    const final = await sharp(healed)
      .resize(FINAL_SIZE, FINAL_SIZE)
      .webp({ quality: 90 })
      .toBuffer();
    await writeFile(outPath, final);
    console.log(`OK    ${filename}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`FAIL  ${filename} (${message})`);
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set (check .env). Aborting.");
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });

  const kinds: TileKind[] = ["sand", "foam", "water", "rock"];
  for (const kind of kinds) {
    for (let i = 0; i < VARIANT_SEEDS[kind].length; i++) {
      await generateVariant(kind, i);
    }
  }

  console.log("\nDone. Tiles written to public/tiles/beach/.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
