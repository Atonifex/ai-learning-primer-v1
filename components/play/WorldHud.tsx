"use client";

import type { WorldNode, WorldSnapshot } from "../../lib/play/worldMap";
import IslandChart from "./IslandChart";

export default function WorldHud(props: {
  world: WorldSnapshot | null; selected: WorldNode | undefined; position: { x: number; y: number };
  travelTitle?: string; onMap: () => void; onAsk: (node: WorldNode) => void;
  onWalk: (node: WorldNode) => void; onDismiss: () => void; error: string | null;
}) {
  return <>
    <div className="world-objective"><span className="objective-compass" aria-hidden>✧</span><div><strong>{props.world?.chapterTitle ?? "The first shore"}</strong><p>{props.world?.objective ?? "Explore the shore with Rho."}</p></div></div>
    <button className="world-minimap" aria-label="Open island map" onClick={props.onMap}>
      {props.world && <IslandChart world={props.world} selectedId={props.selected?.id} position={props.position} compact />}
      <span>Island map <kbd>M</kbd></span>
    </button>
    {props.selected && <section className="world-location" aria-label="Selected place"><button className="location-dismiss" onClick={props.onDismiss} aria-label="Dismiss place">×</button><h2>{props.selected.title}</h2>
      <p>{props.selected.status === "locked" ? props.selected.lockReason ?? "This place opens later." : props.travelTitle ? `Walking to ${props.travelTitle}…` : props.selected.description}</p>
      <div>{props.selected.status !== "locked" && <><button className="map-button primary" onClick={() => props.onWalk(props.selected!)}>Walk here</button><button className="map-button" onClick={() => props.onAsk(props.selected!)}>Ask Rho</button></>}<button className="map-link" onClick={props.onMap}>Place details</button></div>
    </section>}
    {!props.selected && <p className="world-controls">Tap a place to explore <span>·</span> Tap ground to walk <span>·</span> WASD / arrows</p>}
    {props.error && <button className="world-sync-error" onClick={props.onMap}>Map sync paused · Open to retry</button>}
  </>;
}
