"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WorldSnapshot } from "../../lib/play/worldMap";

export function useWorldMap(sessionId: string, version: number) {
  const [world, setWorld] = useState<WorldSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const seq = useRef(0), mounted = useRef(true);
  const refresh = useCallback(async () => {
    const request = ++seq.current;
    setRefreshing(true);
    try {
      const response = await fetch("/api/world", { cache: "no-store" });
      if (!response.ok) throw new Error("Your map could not sync. Your last map is still here.");
      const next = await response.json() as WorldSnapshot;
      if (request !== seq.current || !mounted.current) return;
      setWorld((old) => old?.revision === next.revision ? old : next);
      setError(null);
    } catch (e) {
      if (request === seq.current && mounted.current) setError(e instanceof Error ? e.message : "Map sync failed.");
    } finally {
      if (request === seq.current && mounted.current) setRefreshing(false);
    }
  }, []);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; seq.current++; }; }, []);
  useEffect(() => { void refresh(); }, [refresh, sessionId, version]);
  useEffect(() => {
    const visibleRefresh = () => { if (document.visibilityState === "visible") void refresh(); };
    window.addEventListener("focus", visibleRefresh);
    document.addEventListener("visibilitychange", visibleRefresh);
    const timer = window.setInterval(visibleRefresh, 30000);
    return () => { window.removeEventListener("focus", visibleRefresh); document.removeEventListener("visibilitychange", visibleRefresh); window.clearInterval(timer); };
  }, [refresh]);
  const saveNote = useCallback(async (nodeId: string, note: string) => {
    const response = await fetch("/api/world", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nodeId, note }) });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "Could not save your note.");
    ++seq.current; setRefreshing(false); setWorld(payload); setError(null);
  }, []);
  return { world, error, refreshing, refresh, saveNote };
}
