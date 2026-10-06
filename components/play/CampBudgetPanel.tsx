"use client";

import { useEffect, useState } from "react";
import ActivitySurface from "./ActivitySurface";
import {
  CAMP_PLAN_LEARNER_GOAL,
  LESSON1_PROBLEMS,
  type BudgetEvaluation,
  type BudgetFieldId,
  type CampPlanState,
  type ResourcePile,
} from "../../lib/play/campPlan";

type UpgradeCard = {
  id: string;
  label: string;
  blurb: string;
  cost: ResourcePile;
  buildable: boolean;
};

type PlanPayload = {
  learnerGoal: string;
  state: CampPlanState;
  stock: ResourcePile;
  rationKeep: { people: number; days: number };
  upgrades: UpgradeCard[];
  remainder: ResourcePile | null;
  error?: string;
  evaluation?: BudgetEvaluation;
};

const EMPTY_ANSWERS: Record<BudgetFieldId, string> = {
  rationsToKeep: "",
  freeRations: "",
  extraDays: "",
  cookFireTimber: "",
  timberLeftAfterFire: "",
  stormCanvasNeeded: "",
  stormCanvasShort: "",
};

function costLine(cost: ResourcePile): string {
  return (["rations", "scrap", "timber", "canvas"] as const)
    .filter((kind) => cost[kind] > 0)
    .map((kind) => `${cost[kind]} ${kind}`)
    .join(" · ");
}

export default function CampBudgetPanel(props: {
  sessionId: string;
  onClose: () => void;
  onSaved: (built: boolean) => void;
}) {
  const [payload, setPayload] = useState<PlanPayload | null>(null);
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [picked, setPicked] = useState<string[]>([]);
  const [evaluation, setEvaluation] = useState<BudgetEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/camp-plan");
        const data = (await res.json()) as PlanPayload;
        if (!res.ok) throw new Error(data.error ?? "Could not open the camp plan.");
        if (!cancelled) setPayload(data);
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Could not open the camp plan.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function submitBudget() {
    setBusy(true);
    setError(null);
    try {
      const bodyAnswers: Record<string, number | string[]> = { affordableIds: picked };
      for (const problem of LESSON1_PROBLEMS) {
        const value = Number(answers[problem.id]);
        if (!Number.isInteger(value)) {
          setError("Enter a whole number on every line.");
          setBusy(false);
          return;
        }
        bodyAnswers[problem.id] = value;
      }
      const res = await fetch("/api/camp-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "budget", answers: bodyAnswers }),
      });
      const data = (await res.json()) as PlanPayload;
      if (!res.ok) throw new Error(data.error ?? "Could not check the budget.");
      setEvaluation(data.evaluation ?? null);
      setPayload((prev) => (prev ? { ...prev, state: data.state } : prev));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not check the budget.");
    } finally {
      setBusy(false);
    }
  }

  async function buy(upgradeId: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/camp-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "buy", upgradeId, sessionId: props.sessionId }),
      });
      const data = (await res.json()) as PlanPayload & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not build that upgrade.");
      setPayload((prev) =>
        prev ? { ...prev, state: data.state, remainder: data.remainder } : prev
      );
      props.onSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not build that upgrade.");
    } finally {
      setBusy(false);
    }
  }

  const state = payload?.state;
  const passed = Boolean(state?.budgetPassed || evaluation?.pass);
  const purchased = state?.purchasedUpgradeId ?? null;
  const buildable = (payload?.upgrades ?? []).filter((row) => row.buildable);

  return (
    <ActivitySurface
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="camp-budget-title"
      data-testid="camp-budget-panel"
    >
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-amber-200/30 bg-[#24180f] text-amber-50 shadow-xl">
        <header className="border-b border-amber-200/20 px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/70">Camp · budget, then build</p>
          <p className="mt-2 text-xs font-semibold text-amber-200">{CAMP_PLAN_LEARNER_GOAL}</p>
          <h2 id="camp-budget-title" className="mt-1 font-serif text-2xl">
            {purchased ? "Upgrade built" : passed ? "Choose one build" : "What can we afford?"}
          </h2>
        </header>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 text-sm">
          {error && <p className="rounded-lg bg-rose-950/50 px-3 py-2">{error}</p>}
          {!payload && !error && <p>Opening the salvage count…</p>}
          {payload && (
            <>
              <p>
                On hand: {payload.stock.rations} rations, {payload.stock.scrap} scrap, {payload.stock.timber} timber,{" "}
                {payload.stock.canvas} canvas. Keep meals for {payload.rationKeep.people} people × {payload.rationKeep.days} days.
              </p>
              <ul className="space-y-2">
                {payload.upgrades.map((row) => (
                  <li key={row.id} className="rounded-xl border border-amber-200/20 px-3 py-2">
                    <p className="font-semibold">{row.label}</p>
                    <p className="text-amber-100/80">{row.blurb}</p>
                    <p className="text-amber-200/90">{costLine(row.cost)}</p>
                  </li>
                ))}
              </ul>
              {purchased && payload.remainder && (
                <p data-testid="camp-budget-result">
                  Built {payload.upgrades.find((row) => row.id === purchased)?.label}. Left: {payload.remainder.rations} rations,{" "}
                  {payload.remainder.scrap} scrap, {payload.remainder.timber} timber, {payload.remainder.canvas} canvas.
                </p>
              )}
              {!purchased && !passed && (
                <div className="space-y-3">
                  {LESSON1_PROBLEMS.map((problem) => (
                    <label key={problem.id} className="block">
                      {problem.label}
                      <input
                        inputMode="numeric"
                        value={answers[problem.id]}
                        onChange={(event) => setAnswers((prev) => ({ ...prev, [problem.id]: event.target.value }))}
                        className="mt-1 w-full rounded-xl border border-amber-200/30 bg-stone-950/40 px-3 py-2"
                        data-testid={`camp-budget-${problem.id}`}
                      />
                      {evaluation?.fields[problem.id]?.feedback && (
                        <span className="mt-1 block text-amber-100/80">{evaluation.fields[problem.id].feedback}</span>
                      )}
                    </label>
                  ))}
                  <fieldset className="space-y-2">
                    <legend>Which upgrades can we pay for?</legend>
                    {payload.upgrades.map((row) => (
                      <label key={row.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={picked.includes(row.id)}
                          onChange={() =>
                            setPicked((ids) => (ids.includes(row.id) ? ids.filter((id) => id !== row.id) : [...ids, row.id]))
                          }
                        />
                        {row.label}
                      </label>
                    ))}
                    {evaluation?.affordableFeedback && <p>{evaluation.affordableFeedback}</p>}
                  </fieldset>
                </div>
              )}
              {!purchased && passed && (
                <div className="space-y-2" data-testid="camp-buy-choices">
                  <p>{evaluation?.summary ?? "The budget fits. Choose one upgrade to build."}</p>
                  {buildable.map((row) => (
                    <button
                      key={row.id}
                      type="button"
                      disabled={busy}
                      onClick={() => void buy(row.id)}
                      className="block w-full rounded-xl border border-amber-200/30 px-3 py-2 text-left hover:bg-amber-200/10"
                    >
                      Build {row.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-amber-200/20 px-5 py-4">
          <button type="button" onClick={props.onClose} className="rounded-full border border-amber-200/40 px-4 py-2 text-sm">
            Close
          </button>
          {!purchased && !passed && (
            <button
              type="button"
              disabled={busy || !payload}
              onClick={() => void submitBudget()}
              className="rounded-full bg-amber-200 px-5 py-2 text-sm font-semibold text-slate-950 disabled:opacity-40"
              data-testid="camp-budget-check"
            >
              Check the budget
            </button>
          )}
        </footer>
      </div>
    </ActivitySurface>
  );
}
