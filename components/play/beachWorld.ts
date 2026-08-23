import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
  Texture,
} from "pixi.js";
import { stillSrc } from "../../lib/play/stills";
import {
  COLS,
  ROWS,
  SPAWN_COL,
  SPAWN_ROW,
  TILE,
  TUTORIAL_PINS,
  clampToWalkable,
  fogAlpha,
  isWalkable,
  pinAt,
  pixelToTile,
  revealFog,
  createFogGrid,
  tileCenter,
  tileKind,
  worldHeight,
  worldWidth,
  type PinId,
  type TileKind,
} from "../../lib/play/beachMap";
import { TILE_VARIANTS, tileTextureSrc, tileVariantIndex } from "../../lib/play/tileset";

export type BeachWorldHandle = {
  destroy: () => void;
  setPaused: (paused: boolean) => void;
  setQuizDone: (done: boolean) => void;
  setUnlockedPins: (ids: PinId[]) => void;
  setTalkedToWreck: (talked: boolean) => void;
};

export type BeachWorldCallbacks = {
  onArriveAtPin: (id: PinId) => void;
  onWanderFromWreck: () => void;
};

const COLORS = {
  water: 0x0e4a5c,
  waterDeep: 0x0a3340,
  foam: 0x2a8a9a,
  sand: 0xe8d4a8,
  sandWet: 0xd4b896,
  rock: 0x4a4a52,
  wreck: 0x5c4033,
  captain: 0xe07a5f,
  rho: 0x3d9b8f,
  fog: 0x071820,
  pinLocked: 0x6b7280,
};

async function optionalTexture(url: string): Promise<Texture | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.startsWith("image/")) return null;
    return await Assets.load(url);
  } catch {
    return null;
  }
}

/** Loads every ground tile texture once; falls back per-tile to flat Graphics if any are missing. */
async function loadTileTextures(): Promise<Map<string, Texture>> {
  const kinds = Object.keys(TILE_VARIANTS) as TileKind[];
  const entries = kinds.flatMap((kind) =>
    TILE_VARIANTS[kind].map((_, variant) => ({ kind, variant }))
  );
  const textures = await Promise.all(
    entries.map(({ kind, variant }) => optionalTexture(tileTextureSrc(kind, variant)))
  );
  const map = new Map<string, Texture>();
  entries.forEach(({ kind, variant }, i) => {
    const tex = textures[i];
    if (tex) map.set(`${kind}:${variant}`, tex);
  });
  return map;
}

function makeDot(color: number, radius: number): Graphics {
  const g = new Graphics();
  g.circle(0, 0, radius).fill(color);
  g.stroke({ width: 2, color: 0x1a120c, alpha: 0.45 });
  return g;
}

export async function createBeachWorld(
  host: HTMLDivElement,
  callbacks: BeachWorldCallbacks
): Promise<BeachWorldHandle> {
  const app = new Application();
  await app.init({
    background: COLORS.waterDeep,
    resizeTo: host,
    antialias: true,
  });
  host.appendChild(app.canvas);
  app.canvas.style.display = "block";
  app.canvas.style.width = "100%";
  app.canvas.style.height = "100%";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const world = new Container();
  app.stage.addChild(world);

  const tileTextures = await loadTileTextures();

  const ground = new Container();
  world.addChild(ground);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const kind = tileKind(c, r);
      const variantCount = TILE_VARIANTS[kind].length;
      const variant = tileVariantIndex(c, r, variantCount);
      const tex = tileTextures.get(`${kind}:${variant}`);
      if (tex) {
        const s = new Sprite(tex);
        s.position.set(c * TILE, r * TILE);
        s.width = TILE;
        s.height = TILE;
        ground.addChild(s);
        continue;
      }
      const g = new Graphics();
      const color =
        kind === "water"
          ? COLORS.water
          : kind === "foam"
            ? COLORS.foam
            : kind === "rock"
              ? COLORS.rock
              : COLORS.sand;
      const alt = kind === "sand" && (c + r) % 2 === 0 ? COLORS.sandWet : color;
      g.rect(c * TILE, r * TILE, TILE, TILE).fill(alt);
      ground.addChild(g);
    }
  }

  const pinLayer = new Container();
  world.addChild(pinLayer);
  const pinMarks = new Map<PinId, Graphics>();
  for (const pin of TUTORIAL_PINS) {
    const { x, y } = tileCenter(pin.col, pin.row);
    const mark = new Graphics();
    if (pin.id === "wreck") {
      mark.roundRect(-16, -12, 32, 24, 4).fill(COLORS.wreck);
      mark.rect(-18, -4, 8, 14).fill(0x3d2914);
    } else {
      mark.poly([0, -12, 10, 10, -10, 10]).fill(COLORS.pinLocked);
    }
    mark.position.set(x, y);
    mark.eventMode = "static";
    mark.cursor = "pointer";
    const label = new Text({
      text: pin.label,
      style: { fontFamily: "Georgia, serif", fontSize: 11, fill: 0xf4f0e6 },
    });
    label.anchor.set(0.5, 0);
    label.position.set(x, y + 14);
    pinLayer.addChild(mark, label);
    pinMarks.set(pin.id, mark);
  }

  const fogGfx = new Graphics();
  world.addChild(fogGfx);
  const explored = createFogGrid();

  const spawn = tileCenter(SPAWN_COL, SPAWN_ROW);
  const [captainTex, rhoTex] = await Promise.all([
    optionalTexture(stillSrc("captainPlaceholderSprite")),
    optionalTexture(stillSrc("rhoOverworldSprite")),
  ]);

  function actor(tex: Texture | null, color: number, radius: number, size: number) {
    if (tex) {
      const s = new Sprite(tex);
      s.anchor.set(0.5);
      s.width = size;
      s.height = size;
      return s;
    }
    return makeDot(color, radius);
  }

  // Sprites ~1.2× tile so they stay readable when the camera shows the big map.
  const captain = actor(captainTex, COLORS.captain, 20, 56);
  captain.position.set(spawn.x, spawn.y);
  world.addChild(captain);

  const rho = actor(rhoTex, COLORS.rho, 16, 44);
  rho.position.set(spawn.x - 36, spawn.y + 14);
  world.addChild(rho);

  const keys = new Set<string>();
  let dest: { x: number; y: number } | null = null;
  let paused = false;
  let quizDone = false;
  let talkedToWreck = false;
  let wanderFired = false;
  const insidePin = new Set<PinId>();

  const onKeyDown = (e: KeyboardEvent) => {
    if (paused) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
      return;
    }
    const k = e.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) {
      e.preventDefault();
      keys.add(k);
      dest = null;
    }
  };
  const onKeyUp = (e: KeyboardEvent) => {
    keys.delete(e.key.toLowerCase());
  };
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointertap", (ev) => {
    if (paused) return;
    const local = world.toLocal(ev.global);
    const clamped = clampToWalkable(local.x, local.y);
    dest = clamped;
  });

  function tryMove(nx: number, ny: number) {
    const { col, row } = pixelToTile(nx, ny);
    if (isWalkable(col, row)) {
      captain.position.set(nx, ny);
      return;
    }
    const { col: cx } = pixelToTile(nx, captain.y);
    if (isWalkable(cx, pixelToTile(captain.x, captain.y).row)) {
      captain.position.x = nx;
    }
    const { row: ry } = pixelToTile(captain.x, ny);
    if (isWalkable(pixelToTile(captain.x, captain.y).col, ry)) {
      captain.position.y = ny;
    }
  }

  function updateFog() {
    const { col, row } = pixelToTile(captain.x, captain.y);
    revealFog(explored, col, row, 3.2);
    fogGfx.clear();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const dc = c - col;
        const dr = r - row;
        const dist = Math.sqrt(dc * dc + dr * dr);
        const a = fogAlpha(explored[r][c], dist);
        if (a <= 0) continue;
        fogGfx.rect(c * TILE, r * TILE, TILE, TILE).fill({ color: COLORS.fog, alpha: a });
      }
    }
  }

  function updateCamera() {
    const viewW = app.screen.width;
    const viewH = app.screen.height;
    const ww = worldWidth();
    const wh = worldHeight();
    let x = captain.x - viewW / 2;
    let y = captain.y - viewH / 2;
    if (ww <= viewW) x = (ww - viewW) / 2;
    else x = Math.max(0, Math.min(ww - viewW, x));
    if (wh <= viewH) y = (wh - viewH) / 2;
    else y = Math.max(0, Math.min(wh - viewH, y));
    if (reduceMotion) {
      world.position.set(-x, -y);
    } else {
      world.position.x += (-x - world.position.x) * 0.12;
      world.position.y += (-y - world.position.y) * 0.12;
    }
  }

  const wreck = TUTORIAL_PINS.find((p) => p.id === "wreck")!;
  const wreckPos = tileCenter(wreck.col, wreck.row);
  const spawnX = spawn.x;
  const spawnY = spawn.y;
  let destroyed = false;

  app.ticker.add((ticker) => {
    if (paused || destroyed) return;
    const dt = ticker.deltaMS / 1000;
    const speed = 130;
    let vx = 0;
    let vy = 0;
    if (keys.has("w") || keys.has("arrowup")) vy -= 1;
    if (keys.has("s") || keys.has("arrowdown")) vy += 1;
    if (keys.has("a") || keys.has("arrowleft")) vx -= 1;
    if (keys.has("d") || keys.has("arrowright")) vx += 1;
    if (vx !== 0 || vy !== 0) {
      const len = Math.hypot(vx, vy) || 1;
      tryMove(captain.x + (vx / len) * speed * dt, captain.y + (vy / len) * speed * dt);
    } else if (dest) {
      const dx = dest.x - captain.x;
      const dy = dest.y - captain.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 4) {
        captain.position.set(dest.x, dest.y);
        dest = null;
      } else {
        tryMove(captain.x + (dx / dist) * speed * dt, captain.y + (dy / dist) * speed * dt);
      }
    }

    const follow = 0.08;
    rho.position.x += (captain.x - 36 - rho.x) * follow;
    rho.position.y += (captain.y + 16 - rho.y) * follow;

    const { col, row } = pixelToTile(captain.x, captain.y);
    const pin = pinAt(col, row, 1);
    if (pin) {
      if (!insidePin.has(pin.id)) {
        insidePin.add(pin.id);
        callbacks.onArriveAtPin(pin.id);
      }
    } else {
      insidePin.clear();
    }

    const wreckDist = Math.hypot(captain.x - wreckPos.x, captain.y - wreckPos.y) / TILE;
    const moved = Math.hypot(captain.x - spawnX, captain.y - spawnY) > 20;
    if (moved && !talkedToWreck && !wanderFired && wreckDist > 3.8) {
      wanderFired = true;
      callbacks.onWanderFromWreck();
    }

    updateFog();
    updateCamera();
  });

  updateFog();
  updateCamera();

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      paused = true;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      app.ticker.stop();
      try {
        app.destroy({ removeView: true });
      } catch {
        // React Strict Mode may tear down twice.
      }
    },
    setPaused(v) {
      paused = v;
      if (v) keys.clear();
    },
    setQuizDone(v) {
      quizDone = v;
    },
    setUnlockedPins(ids) {
      const open = new Set(ids);
      for (const pin of TUTORIAL_PINS) {
        const mark = pinMarks.get(pin.id);
        if (!mark || pin.id === "wreck") continue;
        mark.clear();
        mark.poly([0, -12, 10, 10, -10, 10]).fill(
          open.has(pin.id) ? 0xc4a574 : COLORS.pinLocked
        );
      }
    },
    setTalkedToWreck(v) {
      talkedToWreck = v;
    },
  };
}
