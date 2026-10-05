"use client";

import { useEffect, useRef, useState } from "react";
import { createBeachWorld, type BeachWorldHandle } from "./beachWorld";
import type { WorldSnapshot } from "../../lib/play/worldMap";

export default function OverworldCanvas(props: {
  paused: boolean; world: WorldSnapshot | null; travel: { id: string; sequence: number } | null;
  onArrive: (id: string) => void; onSelect: (id: string) => void;
  onPosition: (p: { x: number; y: number }) => void;
}) {
  const host = useRef<HTMLDivElement>(null), handle = useRef<BeachWorldHandle | null>(null);
  const latest = useRef(props); latest.current = props;
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!host.current) return;
    let disposed = false;
    void createBeachWorld(host.current, {
      onArrive: (id) => latest.current.onArrive(id), onSelect: (id) => latest.current.onSelect(id),
      onPosition: (p) => latest.current.onPosition(p),
    }).then((world) => {
      if (disposed) { world.destroy(); return; }
      handle.current = world; world.setPaused(latest.current.paused);
      if (latest.current.world) world.setWorld(latest.current.world);
      if (latest.current.travel) world.walkTo(latest.current.travel.id);
    }).catch(() => { if (!disposed) setError(true); });
    return () => { disposed = true; handle.current?.destroy(); handle.current = null; };
  }, []);
  useEffect(() => { handle.current?.setPaused(props.paused); }, [props.paused]);
  useEffect(() => { if (props.world) handle.current?.setWorld(props.world); }, [props.world]);
  useEffect(() => { if (props.travel) handle.current?.walkTo(props.travel.id); }, [props.travel]);
  return <div ref={host} className="h-full w-full touch-none bg-[#195563]" aria-label="Island beach. Tap to walk. WASD or arrow keys on a keyboard.">
    {error && <p role="alert" className="absolute left-4 top-32 rounded-xl bg-white p-4">The walking view could not load. Open Island map to keep exploring and talking with Rho.</p>}
  </div>;
}
