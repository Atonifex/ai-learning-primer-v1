/**
 * Island layout (U4 / U5 / U13). One mask drives three things: walkability
 * for the Pixi walk camera, which tile art to draw, and (later) the shape
 * traced onto the parchment overlay map — so "peel fog here" and "reveal
 * parchment there" stay the same island instead of two hand-drawn shapes.
 *
 * The map has three bands, north (row 0) to south (row ROWS-1):
 *  - NORTH_ROWS:   wide unexplored landmass, irregular coastline. Nothing
 *                   here is reachable yet — it exists so the fog and (later)
 *                   the parchment map read as "the island is bigger than
 *                   you thought" (U5) from the very first minute.
 *  - RIDGE_ROWS:    a rock ridge sealing the tutorial beach off from the
 *                   north until later content opens a path through it.
 *  - TUTORIAL_ROWS: the original tiny first-room beach (Undertale beat,
 *                   §4.10) — unchanged shape/pins, just shifted south.
 */

export const TILE = 48;
export const COLS = 18;

const TUTORIAL_ROWS = 12; // legacy tiny beach, geometry preserved exactly
const RIDGE_ROWS = 4; // rock barrier rows
const NORTH_ROWS = 30; // unexplored landmass rows

export const ROWS = NORTH_ROWS + RIDGE_ROWS + TUTORIAL_ROWS;

/** Row where the legacy tutorial rectangle begins. */
const SOUTH_START = NORTH_ROWS + RIDGE_ROWS;
/** First row of the rock ridge (inclusive). */
const RIDGE_START = NORTH_ROWS;

export type TileKind = "water" | "foam" | "sand" | "rock";

export type PinId = "wreck" | "dune" | "treeline" | "creek" | "camp";

export type TutorialPin = {
  id: PinId;
  label: string;
  col: number;
  row: number;
  /** Other sites stay locked until the wreck overlay quiz completes. */
  lockedUntilQuiz: boolean;
};

/** Pin cols/rows are unchanged from the original tutorial rectangle, only shifted by SOUTH_START. */
export const TUTORIAL_PINS: TutorialPin[] = [
  { id: "wreck", label: "Wreck", col: 8, row: SOUTH_START + 6, lockedUntilQuiz: false },
  { id: "dune", label: "Dune", col: 4, row: SOUTH_START + 3, lockedUntilQuiz: true },
  { id: "treeline", label: "Treeline", col: 13, row: SOUTH_START + 3, lockedUntilQuiz: true },
  { id: "creek", label: "Creek", col: 3, row: SOUTH_START + 7, lockedUntilQuiz: true },
  { id: "camp", label: "Camp", col: 14, row: SOUTH_START + 8, lockedUntilQuiz: true },
];

/** South of the wreck so the first verb is "walk up to it". */
export const SPAWN_COL = 8;
export const SPAWN_ROW = SOUTH_START + 9;

/**
 * Hand overrides, keyed "col:row". Checked before the procedural coastline,
 * so a future named landmark (a cove, a wreck, a mountain peak) can be
 * carved in without touching the sine formula below. Small illustrative
 * cove today, just north of the ridge — the first thing you'd see peeking
 * through the fog if you looked north from camp.
 */
const TILE_OVERRIDES: Record<string, TileKind> = {
  "8:26": "water",
  "9:26": "water",
  "10:26": "water",
  "8:25": "foam",
  "9:25": "water",
  "10:25": "foam",
};

/**
 * Deterministic, dependency-free coastline for the unexplored north
 * (row < RIDGE_START). The west and east edges are two *independent* sine
 * blends, each an indent inward from its own map edge — that asymmetry is
 * what makes bays and peninsulas read as one uneven coast instead of a
 * drifting oval. Indents are clamped so the two edges can never cross:
 * the coast narrows in places but never closes into a strait. `rampIn`
 * tapers the very top rows to a point, implying the island keeps going
 * past ROWS rather than ending on a hard edge. Treat this as a first
 * pass: swap in hand-authored bounds (or more TILE_OVERRIDES) for
 * specific set-piece locations once they're designed.
 */
function landBounds(row: number): { west: number; east: number } {
  const rampIn = Math.min(1, row / 5);
  const westIndent =
    rampIn * (3.4 + 2.4 * Math.sin(row * 0.22 + 0.3) + 1.3 * Math.sin(row * 0.5 + 1.1));
  const eastIndent =
    rampIn * (3.4 + 2.4 * Math.sin(row * 0.19 + 2.4) + 1.3 * Math.sin(row * 0.47 + 0.6));

  const west = Math.round(1 + Math.max(0, Math.min(7, westIndent)));
  const east = Math.round(COLS - 2 - Math.max(0, Math.min(7, eastIndent)));
  return { west: Math.min(west, east - 1), east };
}

/** Exact reproduction of the original 18x12 tutorial rectangle's tile rule. */
function southTileKind(col: number, localRow: number): TileKind {
  const edge = col === 0 || localRow === 0 || col === COLS - 1 || localRow === TUTORIAL_ROWS - 1;
  if (edge) return "water";
  const foam = col === 1 || localRow === 1 || col === COLS - 2 || localRow === TUTORIAL_ROWS - 2;
  if (foam) return "foam";
  return "sand";
}

export function worldWidth(): number {
  return COLS * TILE;
}

export function worldHeight(): number {
  return ROWS * TILE;
}

export function tileKind(col: number, row: number): TileKind {
  if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return "water";

  const override = TILE_OVERRIDES[`${col}:${row}`];
  if (override) return override;

  if (row >= SOUTH_START) return southTileKind(col, row - SOUTH_START);

  if (row >= RIDGE_START) {
    return col === 0 || col === COLS - 1 ? "water" : "rock";
  }

  const bounds = landBounds(row);
  if (col < bounds.west || col > bounds.east) return "water";
  if (col === bounds.west || col === bounds.east) return "foam";
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
