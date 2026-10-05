import { COLS, ROWS, TILE, isWalkable, tileCenter, tileKind, southShoreOutline } from "./beachMap";

export type WorldAccess = { northUnlocked: boolean; northLimit: number };
export function worldWalkable(col: number, row: number, access: WorldAccess): boolean {
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return false;
  if (row >= 35) return isWalkable(col, row);
  if (!access.northUnlocked || row < access.northLimit) return false;
  // A single authored pass connects the same island mask across the ridge.
  if (row >= 27 && row <= 35 && (col === 8 || col === 9)) return true;
  return isWalkable(col, row);
}

/** Breadth-first route: only reachable destinations, no diagonal corner-cutting or teleportation. */
export function findWorldPath(from: { x: number; y: number }, to: { x: number; y: number }, access: WorldAccess) {
  const start = { col: Math.floor(from.x / TILE), row: Math.floor(from.y / TILE) };
  if (!worldWalkable(start.col, start.row, access)) return [];
  const key = (c: number, r: number) => r * COLS + c;
  const queue = [start], parents = new Map<number, number | null>([[key(start.col, start.row), null]]);
  let best = start, bestDistance = Infinity;
  for (let i = 0; i < queue.length; i++) {
    const here = queue[i], center = tileCenter(here.col, here.row);
    const d = Math.hypot(center.x - to.x, center.y - to.y);
    if (d < bestDistance) { best = here; bestDistance = d; }
    for (const [dc, dr] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const col = here.col + dc, row = here.row + dr, k = key(col, row);
      if (parents.has(k) || !worldWalkable(col, row, access)) continue;
      parents.set(k, key(here.col, here.row)); queue.push({ col, row });
    }
  }
  const path: Array<{ x: number; y: number }> = [];
  let k: number | null = key(best.col, best.row);
  while (k !== null) { path.push(tileCenter(k % COLS, Math.floor(k / COLS))); k = parents.get(k) ?? null; }
  return path.reverse();
}

/** Shared coastline for the chart. Cells follow the walk world's actual mask. */
export function chartLandPath(): string {
  let path = "";
  for (let r = 0; r < 34; r++) for (let c = 0; c < COLS; c++) {
    if (tileKind(c, r) !== "water") path += `M${c} ${r}h1v1h-1z`;
  }
  const points = southShoreOutline(), last = points.at(-1)!;
  path += `M${(points[0].x + last.x) / 2} ${(points[0].y + last.y) / 2}`;
  points.forEach((point, i) => { const next = points[(i + 1) % points.length]; path += `Q${point.x} ${point.y} ${(point.x + next.x) / 2} ${(point.y + next.y) / 2}`; });
  path += "Z";
  return path;
}
