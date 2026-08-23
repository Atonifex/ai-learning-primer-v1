/**
 * Ground tile art (U1). Two variants per TileKind so the walk camera can
 * alternate them per-cell instead of a flat color, same idea as the old
 * sand/sandWet checkerboard but driven by real art.
 */
import type { TileKind } from "./beachMap";

export const TILE_TEXTURE_DIR = "/tiles/beach";

export const TILE_VARIANTS: Record<TileKind, string[]> = {
  water: ["water_1.webp", "water_2.webp"],
  foam: ["foam_1.webp", "foam_2.webp"],
  sand: ["sand_1.webp", "sand_2.webp"],
  rock: ["rock_1.webp", "rock_2.webp"],
};

export function tileTextureSrc(kind: TileKind, variantIndex: number): string {
  const variants = TILE_VARIANTS[kind];
  return `${TILE_TEXTURE_DIR}/${variants[variantIndex % variants.length]}`;
}

/** Deterministic pseudo-random variant pick so a given tile never flickers between renders. */
export function tileVariantIndex(col: number, row: number, variantCount: number): number {
  const h = Math.abs((col * 928371 + row * 543217 + col * row * 7) | 0);
  return h % variantCount;
}
