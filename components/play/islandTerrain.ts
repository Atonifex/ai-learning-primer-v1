import { Container, Graphics } from "pixi.js";
import { COLS, ROWS, TILE, tileKind, tileCenter, southShoreOutline } from "../../lib/play/beachMap";

const random = (a: number, b: number) => { const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return n - Math.floor(n); };

function tree(g: Graphics, x: number, y: number, size: number, palm = false) {
  g.ellipse(x + 7, y + 11, size * .7, size * .27).fill({ color: 0x173f3c, alpha: .19 });
  g.moveTo(x, y + 8).quadraticCurveTo(x - 5, y - size * .6, x + 2, y - size).stroke({ width: 6, color: 0x876d45 });
  if (palm) {
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3, dx = Math.cos(angle) * size, dy = Math.sin(angle) * size * .45;
      g.moveTo(x + 2, y - size).quadraticCurveTo(x + dx * .7, y - size + dy - 10, x + dx, y - size + dy + 9)
        .quadraticCurveTo(x + dx * .45, y - size + dy * .7 + 7, x + 2, y - size).fill(i % 2 ? 0x3c7c58 : 0x59976a);
    }
  } else {
    g.circle(x, y - size, size * .64).fill(0x285847);
    g.circle(x - size * .3, y - size * 1.22, size * .48).fill(0x397353);
    g.circle(x + size * .23, y - size * 1.3, size * .48).fill(0x4d8660);
    g.circle(x - size * .14, y - size * 1.5, size * .3).fill(0x75a771);
  }
}

/** Authored terrain, seeded details: no network images and no repeating photo-tile seams. */
export function islandTerrain(): { layer: Container; waves: Graphics } {
  const layer = new Container(), ground = new Graphics(), details = new Graphics(), waves = new Graphics();
  layer.addChild(ground, waves, details);
  ground.rect(-1800, -1200, 4400, 5000).fill(0x195563);
  const shore = () => {
    const points = southShoreOutline().map((p) => ({ x: p.x * TILE, y: p.y * TILE })), last = points.at(-1)!;
    ground.moveTo((points[0].x + last.x) / 2, (points[0].y + last.y) / 2);
    points.forEach((p, i) => { const next = points[(i + 1) % points.length]; ground.quadraticCurveTo(p.x, p.y, (p.x + next.x) / 2, (p.y + next.y) / 2); });
    return ground.closePath();
  };
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (r >= 34 || tileKind(c, r) === "water") continue;
    const { x, y } = tileCenter(c, r);
    ground.roundRect(x - 53, y - 43, 106, 86, 30).fill(0x277d86);
  }
  shore().fill(0x277d86).stroke({ color: 0x277d86, width: 58 });
  shore().stroke({ color: 0x70b4ad, width: 24 });
  shore().fill(0xead4a0).stroke({ color: 0xe4e7bc, width: 5 });
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const kind = tileKind(c, r);
    if (kind === "water") continue;
    if (r < 34) ground.rect(c * TILE, r * TILE, TILE + .4, TILE + .4).fill(kind === "rock" ? 0x71877a : kind === "foam" ? 0xb5c99d : 0x729568);
    const { x, y } = tileCenter(c, r);
    if (kind === "foam" && r < 34) {
      for (let i = 0; i < 3; i++) ground.moveTo(x - 19, y - 15 + i * 13).quadraticCurveTo(x, y - 20 + i * 13, x + 19, y - 14 + i * 13).stroke({ color: 0xf4efd0, width: 1.2, alpha: .55 });
    }
    if (kind === "sand" && random(c, r) > .4) {
      ground.ellipse(x + random(r, c) * 15, y, 2, 1).fill({ color: r < 30 ? 0x3e7153 : 0xb7a272, alpha: .5 });
      ground.moveTo(x - 10, y + 12).lineTo(x - 3, y + 12).stroke({ color: 0xffffff, width: 1, alpha: .17 });
    }
    if (kind === "rock") {
      details.poly([x - 30, y + 24, x - 10, y - 25, x + 4, y - 10, x + 15, y - 34, x + 32, y + 24]).fill(0x61776d);
      details.poly([x - 10, y - 25, x + 4, y - 10, x - 2, y + 21, x - 30, y + 24]).fill(0x91a18b);
    }
    if (r < 30 && kind === "sand" && random(c, r) > .68) tree(details, x, y, 27 + random(r, c) * 14);
  }
  ground.ellipse(670, 1790, 107, 36).fill({ color: 0xa6b882, alpha: .55 });
  ground.ellipse(570, 2110, 87, 23).fill({ color: 0xb2bd87, alpha: .45 });
  ground.ellipse(246, 1800, 55, 16).fill({ color: 0xf7e5b5, alpha: .8 });
  ground.ellipse(360, 2045, 82, 27).fill({ color: 0xf7e5b5, alpha: .6 });
  for (let i = 0; i < 50; i++) {
    const x = 90 + random(i, 8) * 690, y = 1715 + random(i, 9) * 430;
    if (tileKind(Math.floor(x / TILE), Math.floor(y / TILE)) !== "sand") continue;
    ground.ellipse(x, y, 2.5, 1).fill({ color: 0xa99061, alpha: .35 });
    if (i % 4 === 0) ground.moveTo(x, y).lineTo(x - 4, y - 7).moveTo(x, y).lineTo(x + 3, y - 10).stroke({ color: 0x819566, width: 2, alpha: .65 });
  }
  [[11, 36], [12, 36], [14, 36], [15, 37], [15, 39], [2, 37], [2, 39], [11, 43], [12, 43], [5, 36]].forEach(([c, r], i) => {
    const p = tileCenter(c, r); tree(details, p.x, p.y, 32 + i % 3 * 5, true);
  });
  details.moveTo(200, 1728).bezierCurveTo(130, 1795, 250, 1880, 164, 1970).quadraticCurveTo(118, 2020, 83, 2060).stroke({ color: 0xb4cdb2, width: 24 });
  details.moveTo(200, 1728).bezierCurveTo(130, 1795, 250, 1880, 164, 1970).quadraticCurveTo(118, 2020, 83, 2060).stroke({ color: 0x63a5a4, width: 13 });
  for (let i = 0; i < 100; i++) {
    const x = random(i, 30) * 1500 - 300, y = random(i, 40) * 2500;
    if (tileKind(Math.floor(x / TILE), Math.floor(y / TILE)) !== "water") continue;
    waves.moveTo(x, y).quadraticCurveTo(x + 15, y + 4, x + 32, y).stroke({ color: 0xadd7cb, width: 1.6, alpha: .2 });
  }
  return { layer, waves };
}
