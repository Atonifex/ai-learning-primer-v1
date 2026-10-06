"use client";

import ActivitySurface from "./ActivitySurface";

import { useState } from "react";
import {
  GARDEN_LEARNER_GOAL,
  GARDEN_TEACH_BEATS,
  type TeachBeat,
} from "../../lib/play/gardenTeach";

export default function GardenTeachPanel(props: {
  onClose: () => void;
  onReadyToPlant: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [answeredCorrect, setAnsweredCorrect] = useState(false);

  const beat: TeachBeat = GARDEN_TEACH_BEATS[index] ?? GARDEN_TEACH_BEATS[0];
  const last = index >= GARDEN_TEACH_BEATS.length - 1;
  const needsChoice = Boolean(beat.choices?.length);
  const canAdvance = !needsChoice || answeredCorrect;

  function pickChoice(choiceId: string) {
    const choice = beat.choices?.find((c) => c.id === choiceId);
    if (!choice) return;
    setSelectedId(choiceId);
    setFeedback(choice.feedback);
    setAnsweredCorrect(choice.correct);
  }

  function advance() {
    if (!canAdvance) return;
    if (last) {
      props.onReadyToPlant();
      return;
    }
    setIndex((n) => n + 1);
    setSelectedId(null);
    setFeedback(null);
    setAnsweredCorrect(false);
  }

  return (
    <ActivitySurface
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="garden-teach-title"
      data-testid="garden-teach-panel"
    >
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-teal-200/30 bg-[#0b2428] text-amber-50 shadow-xl">
        <header className="border-b border-teal-200/20 px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-200/70">
            Treeline · {index + 1} / {GARDEN_TEACH_BEATS.length}
          </p>
          <p className="mt-2 text-xs font-semibold text-amber-200">{GARDEN_LEARNER_GOAL}</p>
          <h2 id="garden-teach-title" className="mt-1 font-serif text-2xl">
            {beat.title}
          </h2>
        </header>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <p className="text-sm leading-relaxed text-teal-50/90">{beat.body}</p>
          {beat.choices && (
            <div className="space-y-2" role="group" aria-label="Choose an answer">
              {beat.choices.map((choice) => {
                const selected = selectedId === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => pickChoice(choice.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                      selected
                        ? choice.correct
                          ? "border-emerald-300/70 bg-emerald-900/30"
                          : "border-rose-300/50 bg-rose-900/25"
                        : "border-teal-200/25 bg-teal-100/5 hover:border-teal-200/45"
                    }`}
                  >
                    {choice.label}
                  </button>
                );
              })}
            </div>
          )}
          {feedback && (
            <p
              className={`rounded-lg px-3 py-2 text-sm ${
                answeredCorrect ? "bg-emerald-900/35 text-emerald-50" : "bg-amber-900/35 text-amber-50"
              }`}
              data-testid="garden-teach-feedback"
            >
              {feedback}
            </p>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-teal-200/20 px-5 py-4">
          <button
            type="button"
            onClick={props.onClose}
            className="rounded-full border border-teal-200/40 px-4 py-2 text-sm"
          >
            Close
          </button>
          <button
            type="button"
            disabled={!canAdvance}
            onClick={advance}
            className="rounded-full bg-amber-200 px-5 py-2 text-sm font-semibold text-slate-950 disabled:opacity-40"
            data-testid="garden-teach-continue"
          >
            {beat.continueLabel}
          </button>
        </footer>
      </div>
    </ActivitySurface>
  );
}
