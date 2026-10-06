"use client";

import { useState } from "react";
import ActivitySurface from "./ActivitySurface";
import { CAMP_PLAN_LEARNER_GOAL, CAMP_TEACH_BEATS, type CampTeachBeat } from "../../lib/play/campTeach";

export default function CampTeachPanel(props: { onClose: () => void; onReadyToBudget: () => void }) {
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const beat: CampTeachBeat = CAMP_TEACH_BEATS[index] ?? CAMP_TEACH_BEATS[0];
  const last = index >= CAMP_TEACH_BEATS.length - 1;

  function advance() {
    if (beat.answer != null) {
      const value = Number(draft);
      if (!Number.isInteger(value) || value !== beat.answer) {
        setFeedback(beat.hint ?? "Try that operation again.");
        return;
      }
    }
    if (last) {
      props.onReadyToBudget();
      return;
    }
    setIndex((n) => n + 1);
    setDraft("");
    setFeedback(null);
  }

  return (
    <ActivitySurface
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="camp-teach-title"
      data-testid="camp-teach-panel"
    >
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-amber-200/30 bg-[#24180f] text-amber-50 shadow-xl">
        <header className="border-b border-amber-200/20 px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/70">
            Camp · {index + 1} / {CAMP_TEACH_BEATS.length}
          </p>
          <p className="mt-2 text-xs font-semibold text-amber-200">{CAMP_PLAN_LEARNER_GOAL}</p>
          <h2 id="camp-teach-title" className="mt-1 font-serif text-2xl">
            {beat.title}
          </h2>
        </header>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <p className="text-sm leading-relaxed text-amber-50/90">{beat.body}</p>
          {beat.answer != null && (
            <label className="block text-sm">
              Your answer
              <input
                inputMode="numeric"
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setFeedback(null);
                }}
                className="mt-1 w-full rounded-xl border border-amber-200/30 bg-stone-950/40 px-3 py-2 text-amber-50"
                data-testid="camp-teach-answer"
              />
            </label>
          )}
          {feedback && (
            <p className="rounded-lg bg-amber-900/40 px-3 py-2 text-sm" data-testid="camp-teach-feedback">
              {feedback}
            </p>
          )}
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-amber-200/20 px-5 py-4">
          <button type="button" onClick={props.onClose} className="rounded-full border border-amber-200/40 px-4 py-2 text-sm">
            Close
          </button>
          <button
            type="button"
            onClick={advance}
            className="rounded-full bg-amber-200 px-5 py-2 text-sm font-semibold text-slate-950"
            data-testid="camp-teach-continue"
          >
            {beat.continueLabel}
          </button>
        </footer>
      </div>
    </ActivitySurface>
  );
}
