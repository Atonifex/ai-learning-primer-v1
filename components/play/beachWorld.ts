import { Application, Container, Graphics } from "pixi.js";
import { TILE, SPAWN_COL, SPAWN_ROW, tileCenter, worldWidth, worldHeight } from "../../lib/play/beachMap";
import type { WorldSnapshot } from "../../lib/play/worldMap";
import { findWorldPath, worldWalkable } from "../../lib/play/worldNavigation";
import { islandTerrain } from "./islandTerrain";
import { createLandmark } from "./islandLandmarks";

export type BeachWorldHandle = {
  destroy: () => void; setPaused: (paused: boolean) => void;
  setWorld: (world: WorldSnapshot) => void; walkTo: (id: string) => void;
};
export type BeachWorldCallbacks = {
  onArrive: (id: string) => void; onSelect: (id: string) => void;
  onPosition: (position: { x: number; y: number }) => void;
};

function actor(color: number, robot = false) {
  const g = new Graphics();
  g.ellipse(1, 10, 12, 5).fill({ color: 0x163b38, alpha: .25 });
  g.roundRect(-8, -10, 16, 20, 5).fill(color).stroke({ color: 0xfff0ce, width: 2 });
  g.circle(0, -15, 8).fill(robot ? 0xa7d4c3 : 0xbf8d67);
  if (robot) { g.roundRect(-6, -18, 12, 6, 2).fill(0x245154); g.circle(-3, -15, 1.5).fill(0xeaffca); g.circle(3, -15, 1.5).fill(0xeaffca); }
  else { g.ellipse(0, -20, 11, 4).fill(0xf2dda6); g.roundRect(-6, -27, 12, 8, 3).fill(0xf2dda6); }
  return g;
}

export async function createBeachWorld(host: HTMLDivElement, callbacks: BeachWorldCallbacks): Promise<BeachWorldHandle> {
  const app = new Application();
  await app.init({ background: 0x195563, resizeTo: host, antialias: true, resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true });
  host.appendChild(app.canvas); app.canvas.style.display = "block";
  app.ticker.maxFPS = 30;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const world = new Container(), terrain = islandTerrain(), pass = new Graphics(), fog = new Graphics();
  const route = new Graphics(), landmarks = new Container(), actors = new Container();
  app.stage.addChild(world); world.addChild(terrain.layer, pass, fog, route, landmarks, actors);
  const captain = actor(0xd77852), rho = actor(0x519f95, true), spawn = tileCenter(SPAWN_COL, SPAWN_ROW);
  captain.position.set(spawn.x, spawn.y); rho.position.set(spawn.x - 27, spawn.y + 12); actors.addChild(rho, captain);
  let state: WorldSnapshot | null = null, paused = false, destroyed = false;
  let path: Array<{ x: number; y: number }> = [], destination: string | null = null;
  let lastPosition = "", lastNear: string | null = null, clock = 0;
  const keys = new Set<string>();
  const access = () => state ?? { northUnlocked: false, northLimit: 34 };
  const clearRoute = () => { path = []; destination = null; route.clear(); };
  function setRoute(x: number, y: number, id: string | null) {
    path = findWorldPath(captain, { x, y }, access()); destination = id;
    route.clear();
    for (const point of path) route.circle(point.x, point.y, 3).fill({ color: 0xfff4cb, alpha: .85 });
    const end = path.at(-1); if (end) route.circle(end.x, end.y, 13).stroke({ color: 0xe7835f, width: 3 });
  }
  function updateCamera(snap = false) {
    const width = app.screen.width, height = app.screen.height;
    const scale = Math.max(.65, Math.min(1.55, width / 1000, height / 640));
    world.scale.set(scale);
    const viewW = width / scale, viewH = height / scale;
    const x = worldWidth() < viewW ? (worldWidth() - viewW) / 2 : Math.max(-50, Math.min(worldWidth() - viewW + 50, captain.x - viewW / 2));
    const y = Math.max(0, Math.min(worldHeight() - viewH + 65, captain.y - viewH * .56));
    const factor = snap || reduceMotion ? 1 : .12;
    world.x += (-x * scale - world.x) * factor; world.y += (-y * scale - world.y) * factor;
    const screenX = world.x + captain.x * scale, screenY = world.y + captain.y * scale;
    host.dataset.captainVisible = String(screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height);
    host.dataset.captainPosition = `${captain.x}:${captain.y}`;
  }
  function move(x: number, y: number) {
    if (worldWalkable(Math.floor(x / TILE), Math.floor(y / TILE), access())) captain.position.set(x, y);
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (paused || (e.target instanceof HTMLElement && (e.target.closest("input,textarea,select,button,dialog") || e.target.isContentEditable))) return;
    const k = e.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) { e.preventDefault(); keys.add(k); clearRoute(); }
  };
  const onKeyUp = (e: KeyboardEvent) => { keys.delete(e.key.toLowerCase()); };
  const onBlur = () => keys.clear();
  window.addEventListener("keydown", onKeyDown); window.addEventListener("keyup", onKeyUp); window.addEventListener("blur", onBlur);
  app.stage.eventMode = "static"; app.stage.hitArea = app.screen;
  app.stage.on("pointertap", (event) => { if (!paused) { const p = world.toLocal(event.global); setRoute(p.x, p.y, null); } });
  app.ticker.add((tick) => {
    if (destroyed) return;
    updateCamera();
    if (paused) return;
    const dt = Math.min(tick.deltaMS / 1000, .05); clock += dt;
    if (!reduceMotion) terrain.waves.alpha = .72 + Math.sin(clock * .65) * .2;
    let vx = Number(keys.has("d") || keys.has("arrowright")) - Number(keys.has("a") || keys.has("arrowleft"));
    let vy = Number(keys.has("s") || keys.has("arrowdown")) - Number(keys.has("w") || keys.has("arrowup"));
    if (vx || vy) { const len = Math.hypot(vx, vy); vx /= len; vy /= len; move(captain.x + vx * 190 * dt, captain.y + vy * 190 * dt); }
    else if (path.length) {
      const target = path[0], dx = target.x - captain.x, dy = target.y - captain.y, distance = Math.hypot(dx, dy);
      if (distance <= 190 * dt) { move(target.x, target.y); path.shift(); }
      else move(captain.x + dx / distance * 190 * dt, captain.y + dy / distance * 190 * dt);
      if (!path.length) { const arrived = destination; clearRoute(); callbacks.onPosition({ x: captain.x, y: captain.y }); if (arrived) { lastNear = arrived; callbacks.onArrive(arrived); } }
    }
    rho.x += (captain.x - 27 - rho.x) * Math.min(1, dt * 6); rho.y += (captain.y + 12 - rho.y) * Math.min(1, dt * 6);
    const near = state?.nodes.find((n) => Math.hypot(captain.x - (n.col + .5) * TILE, captain.y - (n.row + .5) * TILE) < 29);
    if (near && near.id !== lastNear && !destination) { lastNear = near.id; callbacks.onArrive(near.id); }
    if (!near) lastNear = null;
    const pos = `${Math.round(captain.x / 8)}:${Math.round(captain.y / 8)}`;
    if (pos !== lastPosition) { lastPosition = pos; callbacks.onPosition({ x: captain.x, y: captain.y }); }
  });
  updateCamera(true);
  // Host size changes when dialogue/workspace opens, even while the ticker is stopped.
  const resizeObserver = new ResizeObserver(() => {
    if (destroyed || !host.clientWidth || !host.clientHeight) return;
    app.renderer.resize(host.clientWidth, host.clientHeight);
    app.stage.hitArea = app.screen;
    updateCamera(true); app.render();
  });
  resizeObserver.observe(host);
  return {
    destroy() { if (destroyed) return; destroyed = true; resizeObserver.disconnect(); window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); window.removeEventListener("blur", onBlur); app.destroy({ removeView: true }, { children: true }); },
    setPaused(value) { paused = value; if (value) { keys.clear(); app.ticker.stop(); updateCamera(true); app.render(); } else app.ticker.start(); },
    setWorld(value) {
      state = value;
      for (const child of landmarks.removeChildren()) child.destroy({ children: true });
      for (const node of value.nodes) landmarks.addChild(createLandmark(node, () => { if (!paused) callbacks.onSelect(node.id); }));
      fog.clear().rect(-1800, -1200, 4400, value.northLimit * TILE + 1200).fill({ color: 0x204750, alpha: .96 });
      for (let x = -1800; x < 2600; x += 130) {
        const edge = value.northLimit * TILE - 8 + Math.sin(x * .009) * 15;
        fog.ellipse(x, edge, 100, 47).fill({ color: 0x204750, alpha: .3 });
        fog.ellipse(x, edge - 17, 100, 41).fill({ color: 0x204750, alpha: .5 });
      }
      pass.clear();
      if (value.northUnlocked) pass.roundRect(8 * TILE, 27 * TILE, TILE * 2, TILE * 9, 15).fill(0xcac59a);
      if (!worldWalkable(Math.floor(captain.x / TILE), Math.floor(captain.y / TILE), value)) { captain.position.set(spawn.x, spawn.y); clearRoute(); }
      if (paused) app.render();
    },
    walkTo(id) { const node = state?.nodes.find((n) => n.id === id); if (!node || node.status === "locked") return; const p = tileCenter(node.col, node.row); setRoute(p.x, p.y, id); },
  };
}
