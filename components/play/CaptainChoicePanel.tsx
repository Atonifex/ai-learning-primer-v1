"use client";

import type { CaptainChoicesPayload, CaptainChoiceOption } from "../../lib/play/captainChoices";

export default function CaptainChoicePanel(props: {
  choices: CaptainChoicesPayload;
  disabled?: boolean;
  onPick: (option: CaptainChoiceOption) => void;
}) {
  const { choices, disabled, onPick } = props;

  return (
    <div
      className="flex-shrink-0 border-t border-amber-200/70 bg-[#efe4ce]/90 px-4 py-3"
      data-testid="captain-choice-panel"
      role="group"
      aria-label="Choose what to do"
    >
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-900/70">
          Your decision
        </p>
        {choices.prompt ? (
          <p className="mb-3 text-sm text-stone-700">{choices.prompt}</p>
        ) : null}
        <div className="grid gap-2 sm:grid-cols-3">
          {choices.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              data-testid="captain-choice"
              data-choice-id={opt.id}
              disabled={disabled}
              onClick={() => onPick(opt)}
              className="flex items-start gap-2 rounded-xl border border-stone-300 bg-[#f7f1e4] px-3 py-3 text-left shadow-sm transition hover:border-amber-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            >
              <span
                aria-hidden
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-800 text-sm font-semibold text-teal-50"
              >
                {opt.id}
              </span>
              <span className="pt-0.5 text-sm font-medium text-stone-900">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
