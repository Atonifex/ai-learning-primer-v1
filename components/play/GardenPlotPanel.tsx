"use client";

import { useEffect, useState } from "react";
import {
  GARDEN_LEARNER_GOAL,
  LESSON1_MAX_SEEDLINGS,
  LESSON1_MIN_HEALTHY,
  type GardenEvaluation,
  type GardenPlotDef,
  type GardenState,
  type PlotHealth,
} from "../../lib/play/gardenPlot";

type GardenPayload = {
  learnerGoal: string;
  standardCode: string;
  state: GardenState;
  evaluation: GardenEvaluation;
  plots: GardenPlotDef[];
  error?: string;
};

const HEALTH_LABEL: Record<PlotHealth, string> = {
  empty: "Empty",
  healthy: "Healthy",
  struggling: "Struggling",
  failed: "Will not grow",
};

function traitLine(plot: GardenPlotDef): string {
  const light =
    plot.light === "full_sun" ? "full sun" : plot.light === "partial_sun" ? "morning sun" : "deep shade";
  const water =
    plot.water === "fresh_canal"
      ? "fresh canal water"
      : plot.water === "fresh_bucket"
        ? "fresh bucket water"
        : plot.water === "salt_spray"
          ? "salty ocean spray"
          : "no water";
  const air = plot.air === "open" ? "open air" : "stale air";
  return `${light} · ${water} · ${air}`;
}

export default function GardenPlotPanel(props: {
  onClose: () => void;
  onSaved: (passed: boolean) => void;
}) {
  const [payload, setPayload] = useState<GardenPayload | null>(null);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/garden");
        const data = (await res.json()) as GardenPayload;
        if (!res.ok) throw new Error(data.error ?? "Could not open the garden.");
        if (cancelled) return;
        setPayload(data);
        setPendingIds(data.state.plantings.map((p) => p.plotId));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not open the garden.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function togglePlot(plotId: string) {
    if (submitted || busy) return;
    setPendingIds((ids) => {
      if (ids.includes(plotId)) return ids.filter((id) => id !== plotId);
      if (ids.length >= LESSON1_MAX_SEEDLINGS) return ids;
      return [...ids, plotId];
    });
  }

  async function submit() {
    if (busy || submitted) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/garden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "replace",
          plantings: pendingIds.map((plotId) => ({ plotId })),
        }),
      });
      const data = (await res.json()) as GardenPayload;
      if (!res.ok) throw new Error(data.error ?? "Could not plant the garden.");
      setPayload(data);
      setPendingIds(data.state.plantings.map((p) => p.plotId));
      setSubmitted(true);
      props.onSaved(data.evaluation.lesson1Pass);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not plant the garden.");
    } finally {
      setBusy(false);
    }
  }

  const evaluation = payload?.evaluation;
  const plots = payload?.plots ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="garden-plot-title"
      data-testid="garden-plot-panel"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-teal-200/30 bg-[#0b2428] text-amber-50 shadow-xl">
        <header className="border-b border-teal-200/20 px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-200/70">
            Treeline garden
          </p>
          <h2 id="garden-plot-title" className="mt-1 font-serif text-2xl">
            {payload?.learnerGoal ?? GARDEN_LEARNER_GOAL}
          </h2>
          <p className="mt-2 text-sm text-teal-100/85">
            Plants make their own food using the Sun, air, and fresh water. Place up to{" "}
            {LESSON1_MAX_SEEDLINGS} seedlings. Need {LESSON1_MIN_HEALTHY} healthy beds — no salt spray.
          </p>
        </header>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-5 py-4">
          {error && <p className="rounded-lg bg-rose-900/40 px-3 py-2 text-sm text-rose-100">{error}</p>}
          {!payload && !error && <p className="text-sm text-teal-100/70">Loading garden beds…</p>}
          {plots.map((plot) => {
            const selected = pendingIds.includes(plot.id);
            const scored = evaluation?.plots.find((p) => p.plotId === plot.id);
            const health = submitted && scored ? scored.health : selected ? "empty" : "empty";
            return (
              <button
                key={plot.id}
                type="button"
                disabled={submitted || busy}
                aria-pressed={selected}
                onClick={() => togglePlot(plot.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selected
                    ? "border-amber-200/70 bg-amber-200/10"
                    : "border-teal-200/20 bg-teal-100/5 hover:border-teal-200/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{plot.label}</p>
                    <p className="mt-1 text-xs text-teal-100/75">{traitLine(plot)}</p>
                    {submitted && scored && scored.reasons[0] && (
                      <p className="mt-2 text-xs text-amber-100/90">{scored.reasons[0]}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-amber-200">
                    {submitted && scored ? HEALTH_LABEL[scored.health] : selected ? "Seedling" : "Tap"}
                  </span>
                </div>
                {/* health kept for a11y when submitted */}
                <span className="sr-only">{health}</span>
              </button>
            );
          })}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-teal-200/20 px-5 py-4">
          <p className="text-xs text-teal-100/80">
            {submitted && evaluation
              ? evaluation.summary
              : `${pendingIds.length} / ${LESSON1_MAX_SEEDLINGS} seedlings ready`}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={props.onClose}
              className="rounded-full border border-teal-200/40 px-4 py-2 text-sm"
            >
              {submitted ? "Back to island" : "Close"}
            </button>
            {!submitted && (
              <button
                type="button"
                disabled={busy || pendingIds.length === 0}
                onClick={() => void submit()}
                className="rounded-full bg-amber-200 px-5 py-2 text-sm font-semibold text-slate-950 disabled:opacity-40"
              >
                {busy ? "Planting…" : "Plant seedlings"}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
