"use client";

import { useState } from "react";
import {
  applyMathDiagnosticAnswer,
  freshMathDiagnostic,
  itemForRung,
  mathPlacementCopy,
  type MathDiagnosticState,
} from "../../lib/play/mathDiagnostic";

type Stage = "example" | "question" | "feedback";

export default function MathCheck() {
  const [state, setState] = useState<MathDiagnosticState>(freshMathDiagnostic);
  const [stage, setStage] = useState<Stage>("example");
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const item = itemForRung(state.rung);
  const doneCopy = mathPlacementCopy(state.placement);

  if (doneCopy && stage !== "feedback") {
    return (
      <div className="rounded-xl border border-amber-900/20 bg-white p-3">
        <h3 className="text-sm font-semibold text-stone-900">Starting point</h3>
        <p className="mt-1 text-sm text-stone-800">{doneCopy}</p>
      </div>
    );
  }

  if (!item) return null;

  function answer(index: number) {
    if (!item) return;
    const correct = index === item.correctIndex;
    setLastCorrect(correct);
    setState((current) => applyMathDiagnosticAnswer(current, correct));
    setStage("feedback");
  }

  return (
    <div className="rounded-xl border border-amber-900/20 bg-white p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-800/80">
        Math starting point · {item.standardCode}
      </p>
      {stage === "example" && (
        <>
          <p className="mt-2 text-xs font-medium text-stone-500">Watch this one first.</p>
          <p className="mt-1 text-sm text-stone-900">{item.example}</p>
          <button
            type="button"
            onClick={() => setStage("question")}
            className="mt-3 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white"
          >
            I&apos;ll try one
          </button>
        </>
      )}
      {stage === "question" && (
        <>
          <p className="mt-2 text-sm text-stone-900">{item.prompt}</p>
          <div className="mt-2 space-y-2">
            {item.choices.map((choice, index) => (
              <button
                key={choice}
                type="button"
                onClick={() => answer(index)}
                className="block w-full rounded-lg border border-amber-900/20 px-3 py-2 text-left text-sm text-stone-900 hover:border-amber-700"
              >
                {choice}
              </button>
            ))}
          </div>
        </>
      )}
      {stage === "feedback" && (
        <>
          <p className="mt-2 text-sm text-stone-900">
            {lastCorrect ? "That's the one." : "Not that one."}
          </p>
          <button
            type="button"
            onClick={() => setStage("example")}
            className="mt-3 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white"
          >
            Continue
          </button>
        </>
      )}
    </div>
  );
}
