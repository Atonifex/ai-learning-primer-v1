"use client";

import { useCallback, useEffect, useState } from "react";
import type { MissionPublic } from "../../lib/play/missions";
import { emptyCamp, toCampPublic, type CampPublic } from "../../lib/play/camp";

type BoardPayload = {
  missions: MissionPublic[];
  wreckQuizDone: boolean;
  chapter1ReflectionDone: boolean;
  activeChapterTitle: string | null;
  mathPlacementCode: string | null;
  mathPlacementStatus: string | null;
  xp: number;
  rations: number;
  camp: CampPublic;
};

export function useMissions() {
  const [board, setBoard] = useState<BoardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/missions", { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error("Camp needs could not load. Please try again.");
      const data = (await res.json()) as BoardPayload;
      setBoard(data);
    } catch {
      setError("Camp needs could not load. Check your connection and try again.");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const startMission = useCallback(async (missionId: string) => {
    const res = await fetch("/api/missions/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ missionId }),
    });
    const data = (await res.json()) as {
      sessionId?: string;
      switched?: boolean;
      mission?: MissionPublic;
      error?: string;
    };
    if (!res.ok || !data.sessionId || !data.mission) {
      throw new Error(data.error || "Could not start that job.");
    }
    return {
      sessionId: data.sessionId,
      switched: Boolean(data.switched),
      mission: data.mission,
    };
  }, []);

  return {
    missions: board?.missions ?? [],
    wreckQuizDone: board?.wreckQuizDone ?? false,
    chapter1ReflectionDone: board?.chapter1ReflectionDone ?? false,
    activeChapterTitle: board?.activeChapterTitle ?? null,
    mathPlacementCode: board?.mathPlacementCode ?? null,
    mathPlacementStatus: board?.mathPlacementStatus ?? null,
    xp: board?.xp ?? 0,
    rations: board?.camp.rations ?? 0,
    camp: board?.camp ?? toCampPublic(emptyCamp()),
    loaded: board != null,
    error,
    refresh,
    startMission,
  };
}
