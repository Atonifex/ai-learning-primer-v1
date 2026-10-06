/**
 * Deterministic Treeline garden plot mini-game (SC.3.L.17.2 apply step).
 * Same inputs always yield the same evaluateGarden result — no LLM scoring.
 * Design: docs/TREELINE_GARDEN_LESSON_2026-10-06.md
 */

export const GARDEN_STANDARD_CODE = "SC.3.L.17.2" as const;
export const GARDEN_LEARNER_GOAL = "What plants need to grow" as const;

export type GardenLight = "full_sun" | "partial_sun" | "deep_shade";
export type GardenWater = "fresh_canal" | "fresh_bucket" | "salt_spray" | "none";
export type GardenAir = "open" | "stale";
export type PlotHealth = "empty" | "healthy" | "struggling" | "failed";

export type GardenPlotDef = {
  id: string;
  label: string;
  light: GardenLight;
  water: GardenWater;
  air: GardenAir;
};

export type GardenPlanting = {
  plotId: string;
  plantedAt: string;
};

export type GardenState = {
  version: 1;
  layoutId: "tutorial-shore-v1";
  plantings: GardenPlanting[];
  lesson1Passed: boolean;
  /** Teach/practice beats finished before the apply mini-game. */
  teachCompleted: boolean;
};

export type PlotEvaluation = {
  plotId: string;
  label: string;
  planted: boolean;
  health: PlotHealth;
  reasons: string[];
};

export type GardenEvaluation = {
  plots: PlotEvaluation[];
  healthyCount: number;
  strugglingCount: number;
  failedCount: number;
  plantedCount: number;
  /** Lesson 1 world reward: ≥2 healthy and 0 salt plantings. */
  lesson1Pass: boolean;
  summary: string;
};

export const TUTORIAL_GARDEN_PLOTS: readonly GardenPlotDef[] = [
  {
    id: "creek-sun",
    label: "Creek edge in the sun",
    light: "full_sun",
    water: "fresh_canal",
    air: "open",
  },
  {
    id: "ocean-spray",
    label: "Beach by the waves",
    light: "full_sun",
    water: "salt_spray",
    air: "open",
  },
  {
    id: "tree-shade",
    label: "Under tall trees",
    light: "deep_shade",
    water: "fresh_canal",
    air: "open",
  },
  {
    id: "tent-morning",
    label: "Beside tent, morning light",
    light: "partial_sun",
    water: "fresh_bucket",
    air: "open",
  },
  {
    id: "dry-ridge",
    label: "Dry sand ridge",
    light: "full_sun",
    water: "none",
    air: "open",
  },
  {
    id: "crate-shadow",
    label: "Behind crates at the beach",
    light: "deep_shade",
    water: "salt_spray",
    air: "stale",
  },
] as const;

export const LESSON1_MAX_SEEDLINGS = 3;
export const LESSON1_MIN_HEALTHY = 2;

const PLOT_BY_ID = new Map(TUTORIAL_GARDEN_PLOTS.map((p) => [p.id, p]));

export function emptyGardenState(): GardenState {
  return {
    version: 1,
    layoutId: "tutorial-shore-v1",
    plantings: [],
    lesson1Passed: false,
    teachCompleted: false,
  };
}

export function getTutorialGardenLayout(): readonly GardenPlotDef[] {
  return TUTORIAL_GARDEN_PLOTS;
}

export function plotById(plotId: string): GardenPlotDef | null {
  return PLOT_BY_ID.get(plotId) ?? null;
}

function lightOk(light: GardenLight): boolean {
  return light === "full_sun" || light === "partial_sun";
}

function waterOk(water: GardenWater): boolean {
  return water === "fresh_canal" || water === "fresh_bucket";
}

/** Pure health for a planted bed from fixed traits. */
export function scorePlantedPlot(plot: GardenPlotDef): {
  health: Exclude<PlotHealth, "empty">;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (plot.water === "salt_spray") {
    reasons.push("Ocean spray is salty — plants need fresh water, not salt water.");
    return { health: "failed", reasons };
  }
  if (plot.light === "deep_shade") {
    reasons.push("Deep shade blocks the Sun energy plants use to make food.");
    if (plot.air === "stale") {
      reasons.push("Stale trapped air is a poor spot — plants need open air.");
    }
    return { health: "failed", reasons };
  }

  const okLight = lightOk(plot.light);
  const okWater = waterOk(plot.water);
  const okAir = plot.air === "open";

  if (plot.water === "none") {
    reasons.push("This bed has no fresh water for the plant.");
  }
  if (!okAir) {
    reasons.push("Stale trapped air is a poor spot — plants need open air.");
  }

  if (okLight && okWater && okAir) {
    reasons.push("Sun (or morning light), fresh water, and open air — plants can make food here.");
    return { health: "healthy", reasons };
  }

  // One missing need (e.g. dry ridge with sun) → struggling; two+ → failed.
  const misses = [!okLight, !okWater, !okAir].filter(Boolean).length;
  if (misses === 1) {
    return { health: "struggling", reasons };
  }
  if (reasons.length === 0) reasons.push("Something plants need is missing here.");
  return { health: "failed", reasons };
}

export function evaluateGarden(state: GardenState): GardenEvaluation {
  const plantedIds = new Set(state.plantings.map((p) => p.plotId));
  const plots: PlotEvaluation[] = TUTORIAL_GARDEN_PLOTS.map((plot) => {
    if (!plantedIds.has(plot.id)) {
      return {
        plotId: plot.id,
        label: plot.label,
        planted: false,
        health: "empty",
        reasons: [],
      };
    }
    const scored = scorePlantedPlot(plot);
    return {
      plotId: plot.id,
      label: plot.label,
      planted: true,
      health: scored.health,
      reasons: scored.reasons,
    };
  });

  const planted = plots.filter((p) => p.planted);
  const healthyCount = planted.filter((p) => p.health === "healthy").length;
  const strugglingCount = planted.filter((p) => p.health === "struggling").length;
  const failedCount = planted.filter((p) => p.health === "failed").length;
  const saltPlanted = planted.some((p) => {
    const def = plotById(p.plotId);
    return def?.water === "salt_spray";
  });

  const lesson1Pass =
    healthyCount >= LESSON1_MIN_HEALTHY && !saltPlanted && planted.length > 0;

  let summary: string;
  if (planted.length === 0) {
    summary = "No seedlings placed yet. Pick sunny beds with fresh water.";
  } else if (lesson1Pass) {
    summary = `Garden started: ${healthyCount} healthy bed${healthyCount === 1 ? "" : "s"}. Plants have what they need to make food.`;
  } else if (saltPlanted) {
    summary = "Move seedlings off salt spray. Plants need fresh water, not ocean water.";
  } else if (healthyCount < LESSON1_MIN_HEALTHY) {
    summary = `Need at least ${LESSON1_MIN_HEALTHY} healthy beds (Sun + fresh water + open air).`;
  } else {
    summary = "Adjust the struggling beds before the garden can feed camp.";
  }

  return {
    plots,
    healthyCount,
    strugglingCount,
    failedCount,
    plantedCount: planted.length,
    lesson1Pass,
    summary,
  };
}

export function placeSeedling(
  state: GardenState,
  plotId: string,
  plantedAt = new Date().toISOString()
): { ok: true; state: GardenState } | { ok: false; error: string } {
  if (!plotById(plotId)) return { ok: false, error: "Unknown garden plot." };
  if (state.plantings.some((p) => p.plotId === plotId)) {
    return { ok: false, error: "That bed already has a seedling." };
  }
  if (state.plantings.length >= LESSON1_MAX_SEEDLINGS) {
    return {
      ok: false,
      error: `Lesson 1 allows up to ${LESSON1_MAX_SEEDLINGS} seedlings. Clear a bed first.`,
    };
  }
  return {
    ok: true,
    state: {
      ...state,
      plantings: [...state.plantings, { plotId, plantedAt }],
    },
  };
}

export function clearPlot(
  state: GardenState,
  plotId: string
): { ok: true; state: GardenState } | { ok: false; error: string } {
  if (!state.plantings.some((p) => p.plotId === plotId)) {
    return { ok: false, error: "That bed is already empty." };
  }
  return {
    ok: true,
    state: {
      ...state,
      plantings: state.plantings.filter((p) => p.plotId !== plotId),
      lesson1Passed: false,
    },
  };
}

export function markTeachCompleted(state: GardenState): GardenState {
  return { ...state, teachCompleted: true };
}

export function markLesson1Passed(state: GardenState): GardenState {
  const evaluation = evaluateGarden(state);
  if (!evaluation.lesson1Pass) return state;
  return { ...state, lesson1Passed: true };
}

export function parseGardenState(raw: unknown): GardenState {
  if (!raw || typeof raw !== "object") return emptyGardenState();
  const o = raw as Record<string, unknown>;
  if (o.version !== 1 || o.layoutId !== "tutorial-shore-v1") return emptyGardenState();
  const plantingsIn = Array.isArray(o.plantings) ? o.plantings : [];
  const plantings: GardenPlanting[] = [];
  for (const row of plantingsIn) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    if (typeof r.plotId !== "string" || !plotById(r.plotId)) continue;
    if (plantings.some((p) => p.plotId === r.plotId)) continue;
    if (plantings.length >= LESSON1_MAX_SEEDLINGS) break;
    plantings.push({
      plotId: r.plotId,
      plantedAt: typeof r.plantedAt === "string" ? r.plantedAt : new Date(0).toISOString(),
    });
  }
  const base: GardenState = {
    version: 1,
    layoutId: "tutorial-shore-v1",
    plantings,
    lesson1Passed: o.lesson1Passed === true,
    teachCompleted: o.teachCompleted === true || o.lesson1Passed === true,
  };
  if (base.lesson1Passed && !evaluateGarden(base).lesson1Pass) {
    return { ...base, lesson1Passed: false };
  }
  return base;
}

export function gardenVisualKind(
  state: GardenState
): "none" | "struggling" | "healthy" {
  if (state.plantings.length === 0) return "none";
  const ev = evaluateGarden(state);
  if (ev.healthyCount > 0 && ev.failedCount === 0) return "healthy";
  if (ev.healthyCount > 0) return "healthy";
  return "struggling";
}
