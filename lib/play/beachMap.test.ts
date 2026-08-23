import { describe, expect, it } from "vitest";
import {
  COLS,
  ROWS,
  SPAWN_COL,
  SPAWN_ROW,
  TUTORIAL_PINS,
  clampToWalkable,
  isWalkable,
  pinAt,
  pixelToTile,
  revealFog,
  createFogGrid,
  tileCenter,
  tileKind,
} from "./beachMap";

describe("beachMap", () => {
  it("keeps the ocean unwalkable and the inner beach walkable", () => {
    expect(tileKind(0, 0)).toBe("water");
    expect(isWalkable(0, 5)).toBe(false);
    expect(isWalkable(SPAWN_COL, SPAWN_ROW)).toBe(true);
    expect(tileKind(1, SPAWN_ROW)).toBe("foam");
  });

  it("seals the tutorial beach off from the unexplored north with a rock ridge", () => {
    expect(tileKind(SPAWN_COL, SPAWN_ROW - 10)).toBe("rock");
    expect(isWalkable(SPAWN_COL, SPAWN_ROW - 10)).toBe(false);
  });

  it("spawns south of the wreck so the first verb is walking to it", () => {
    const wreck = TUTORIAL_PINS.find((p) => p.id === "wreck");
    expect(wreck).toBeTruthy();
    expect(SPAWN_ROW).toBeGreaterThan(wreck!.row);
    expect(SPAWN_COL).toBe(wreck!.col);
  });

  it("has about five tutorial pins with wreck unlocked", () => {
    expect(TUTORIAL_PINS).toHaveLength(5);
    expect(TUTORIAL_PINS.filter((p) => !p.lockedUntilQuiz).map((p) => p.id)).toEqual([
      "wreck",
    ]);
  });

  it("clamps ocean clicks onto sand", () => {
    const clamped = clampToWalkable(2, 2);
    const { col, row } = pixelToTile(clamped.x, clamped.y);
    expect(isWalkable(col, row)).toBe(true);
  });

  it("detects the wreck pin in a 1-tile radius", () => {
    const wreck = TUTORIAL_PINS.find((p) => p.id === "wreck")!;
    expect(pinAt(wreck.col, wreck.row)?.id).toBe("wreck");
    expect(pinAt(wreck.col, wreck.row + 1)?.id).toBe("wreck");
  });

  it("reveals fog around the captain without lighting the whole map", () => {
    const fog = createFogGrid();
    revealFog(fog, SPAWN_COL, SPAWN_ROW, 2.4);
    expect(fog[SPAWN_ROW][SPAWN_COL]).toBe(true);
    expect(fog[0][0]).toBe(false);
    expect(fog.length).toBe(ROWS);
    expect(fog[0].length).toBe(COLS);
  });

  it("maps tile centers back to the same tile", () => {
    const { x, y } = tileCenter(8, 6);
    expect(pixelToTile(x, y)).toEqual({ col: 8, row: 6 });
  });
});
