/**
 * Tiny tutorial beach (U4 / U13). Walkable sand, water border, ~5 pins.
 * Collision is tile-based so the captain cannot walk into the ocean.
 */

export const TILE = 48;
export const COLS = 18;
export const ROWS = 12;

export type TileKind = "water" | "foam" | "sand";

export type PinId = "wreck" | "dune" | "treeline" | "creek" | "camp";

export type TutorialPin = {
  id: PinId;
  label: string;
  col: number;
  row: number;
  /** Other sites stay locked until the wreck overlay quiz completes. */
  lockedUntilQuiz: boolean;
};

export const TUTORIAL_PINS: TutorialPin[] = [
  { id: "wreck", label: "Wreck", col: 8, row: 6, lockedUntilQuiz: false },
  { id: "dune", label: "Dune", col: 4, row: 3, lockedUntilQuiz: true },
  { id: "treeline", label: "Treeline", col: 13, row: 3, lockedUntilQuiz: true },
  { id: "creek", label: "Creek", col: 3, row: 7, lockedUntilQuiz: true },
  { id: "camp", label: "Camp", col: 14, row: 8, lockedUntilQuiz: true },
];

/** South of the wreck so the first verb is "walk up to it". */
export const SPAWN_COL = 8;
export const SPAWN_ROW = 9;

export function worldWidth(): number {
  return COLS * TILE;
}

export function worldHeight(): number {
  return ROWS * TILE;
}

export function tileKind(col: number, row: number): TileKind {
  if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return "water";
  const edge = col === 0 || row === 0 || col === COLS - 1 || row === ROWS - 1;
  if (edge) return "water";
  const foam =
    col === 1 || row === 1 || col === COLS - 2 || row === ROWS - 2;
  if (foam) return "foam";
  return "sand";
}

export function isWalkable(col: number, row: number): boolean {
  const kind = tileKind(col, row);
  return kind === "sand" || kind === "foam";
}

export function pixelToTile(x: number, y: number): { col: number; row: number } {
  return {
    col: Math.floor(x / TILE),
    row: Math.floor(y / TILE),
  };
}

export function tileCenter(col: number, row: number): { x: number; y: number } {
  return {
    x: col * TILE + TILE / 2,
    y: row * TILE + TILE / 2,
  };
}

/** Nudge a pixel position onto the nearest walkable tile center. */
export function clampToWalkable(x: number, y: number): { x: number; y: number } {
  const { col, row } = pixelToTile(x, y);
  if (isWalkable(col, row)) return { x, y };
  let best: { col: number; row: number } | null = null;
  let bestDist = Infinity;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!isWalkable(c, r)) continue;
      const d = (c - col) * (c - col) + (r - row) * (r - row);
      if (d < bestDist) {
        bestDist = d;
        best = { col: c, row: r };
      }
    }
  }
  if (!best) return tileCenter(SPAWN_COL, SPAWN_ROW);
  return tileCenter(best.col, best.row);
}

export function pinAt(
  col: number,
  row: number,
  radiusTiles = 1
): TutorialPin | null {
  let found: TutorialPin | null = null;
  let best = Infinity;
  for (const pin of TUTORIAL_PINS) {
    const d = Math.abs(pin.col - col) + Math.abs(pin.row - row);
    if (d <= radiusTiles && d < best) {
      best = d;
      found = pin;
    }
  }
  return found;
}

export function createFogGrid(): boolean[][] {
  return Array.from({ length: ROWS }, () => Array<boolean>(COLS).fill(false));
}

/** Soft Stardew-style fog: reveal tiles near the captain. */
export function revealFog(
  explored: boolean[][],
  col: number,
  row: number,
  radius = 2.4
): void {
  const r2 = radius * radius;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const dc = c - col;
      const dr = r - row;
      if (dc * dc + dr * dr <= r2) explored[r][c] = true;
    }
  }
}

export function fogAlpha(explored: boolean, distFromCaptain: number): number {
  if (!explored) return 0.42;
  if (distFromCaptain > 4) return 0.18;
  if (distFromCaptain > 2.6) return 0.08;
  return 0;
}
