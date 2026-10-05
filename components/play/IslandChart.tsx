"use client";

import { COLS, ROWS, TILE } from "../../lib/play/beachMap";
import { chartLandPath } from "../../lib/play/worldNavigation";
import type { WorldSnapshot } from "../../lib/play/worldMap";

const land = chartLandPath();
export const PLACE_SYMBOLS: Record<string, string> = { wreck: "⚑", dune: "≋", treeline: "♧", creek: "≈", camp: "⌂", grove: "♧", lookout: "△", shelter: "⌂", workshop: "⚒", trail: "⚑" };

export default function IslandChart({ world, selectedId, onSelect, position, compact = false, overview = false }: {
  world: WorldSnapshot; selectedId?: string | null; onSelect?: (id: string) => void;
  position?: { x: number; y: number }; compact?: boolean; overview?: boolean;
}) {
  const top = compact ? Math.max(0, (position?.y ?? 2064) / TILE - 9) : overview ? 0 : Math.max(0, world.northLimit - 2);
  const height = compact ? Math.min(18, ROWS - top + 1) : ROWS - top + 2;
  return <svg viewBox={`-2 ${top - 1} ${COLS + 4} ${height}`} className="island-chart" role={compact ? "img" : "group"} aria-label="Island chart with discovered locations">
    <defs>
      <pattern id={compact ? "chart-grid-mini" : "chart-grid"} width="3" height="3" patternUnits="userSpaceOnUse"><path d="M3 0H0V3" fill="none" stroke="#477a78" strokeWidth=".035" opacity=".3" /></pattern>
    </defs>
    <rect x="-2" y="-1" width={COLS + 4} height={ROWS + 2} fill="#b7d3c6" />
    <rect x="-2" y="-1" width={COLS + 4} height={ROWS + 2} fill={`url(#${compact ? "chart-grid-mini" : "chart-grid"})`} />
    <path d={land} fill="#e7d5a5" />
    <path d="M11 36Q15 35 15.8 39M10 43Q12 44 14 43" fill="none" stroke="#a8b783" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M2 32Q6 30 8 32T16 32M3 31l2-2 2 2m4 0 2-2 2 2" fill="none" stroke="#857e60" strokeWidth=".16" />
    <path d="M3.5 41.5Q5 39 3 38T5 35" fill="none" stroke="#689c9a" strokeWidth=".25" />
    <rect x="-2" y="-1" width={COLS + 4} height={world.northLimit + 1} fill="#45686b" opacity=".9" />
    {!compact && <><text x="9" y={overview ? world.northLimit / 2 : world.northLimit - .65} textAnchor="middle" fill="#e5eadb" fontSize=".65" fontFamily="Georgia">Beyond the known shore</text>{overview && <text x="9" y={world.northLimit / 2 + 1.2} textAnchor="middle" fill="#c1d1c6" fontSize=".48">Our story will lead the way.</text>}<text x="-.6" y={top + .2} fill="#e5eadb" fontSize=".7">N ↑</text></>}
    {world.nodes.map((node) => <g key={node.id} role={onSelect ? "button" : undefined} tabIndex={onSelect ? 0 : undefined}
      aria-label={`${node.title}, ${node.status}`} aria-pressed={onSelect ? node.id === selectedId : undefined}
      onClick={() => onSelect?.(node.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect?.(node.id); } }}
      className={onSelect ? "chart-place" : undefined} transform={`translate(${node.col + .5} ${node.row + .5})`}>
      <circle r={compact ? .6 : .85} fill="transparent" />
      {selectedId === node.id && <circle r=".82" fill="none" stroke="#b45b3e" strokeWidth=".12" />}
      <circle r=".5" fill={node.status === "locked" ? "#7e877b" : node.id === selectedId ? "#b45b3e" : "#285d57"} stroke="#fff4d8" strokeWidth=".12" />
      <text textAnchor="middle" y=".17" fill="#fff4d8" fontSize=".6">{node.status === "completed" ? "✓" : node.status === "locked" ? "·" : PLACE_SYMBOLS[node.kind]}</text>
      {!compact && <text y="1.35" textAnchor="middle" fontSize=".58" fontFamily="Georgia" fill="#203f3a" stroke="#e7d5a5" strokeWidth=".1" paintOrder="stroke">{node.title.length > 23 ? node.title.slice(0, 21) + "…" : node.title}</text>}
      {node.tasks.some((t) => !t.completed) && <circle cx=".48" cy="-.43" r=".19" fill="#b45b3e" stroke="#fff4d8" strokeWidth=".07" />}
    </g>)}
    {position && <g data-testid={compact ? "captain-position" : "atlas-position"} transform={`translate(${position.x / TILE} ${position.y / TILE})`}><circle r=".34" fill="#e7835f" stroke="#fff" strokeWidth=".12" /><title>You are here</title></g>}
  </svg>;
}
