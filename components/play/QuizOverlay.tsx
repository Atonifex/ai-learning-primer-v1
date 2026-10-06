"use client";

import { useMemo, useState } from "react";
import type { OverlayQuizPublic } from "../../lib/play/overlayQuiz";
import { TUTORIAL_QUIZ_SLUG } from "../../lib/play/tutorialQuizSlug";
import { WRECK_WORKED_EXAMPLE, type ZpdStage } from "../../lib/play/zpd";
import { useDialogFocus } from "./useDialogFocus";

export default function QuizOverlay(props: {
  quiz: OverlayQuizPublic;
  submitting?: boolean;
  result?: {
    score: number;
    total: number;
    correct: number;
    missed: string[];
    hints: string[];
  } | null;
  error?: string | null;
  zpdStage: ZpdStage | null;
  onSubmit: (answers: Array<{ itemId: string; selectedIndex: number }>) => void;
  onZpdAdvance: () => void;
  onDismiss: () => void;
  onReturnToMap?: () => void;
}) {
  const { quiz, result, zpdStage } = props;
  const reviewOnly = quiz.alreadyCompleted;
  const dialogRef = useDialogFocus();
  const isWreck = quiz.slug === TUTORIAL_QUIZ_SLUG;
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [fadeTry, setFadeTry] = useState("");

  const canSubmit = useMemo(
    () => quiz.items.every((item) => typeof selected[item.id] === "number"),
    [quiz.items, selected]
  );

  const missed = Boolean(result && result.missed.length > 0);
  const wreckZpd = isWreck && missed;

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center"
      data-testid="quiz-overlay"
      ref={dialogRef} tabIndex={-1}
      role="dialog" aria-modal="true" aria-label={quiz.title}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border-4 border-amber-800/80 bg-[#3d2914] shadow-2xl">
        <div className="bg-[#5c4033] px-4 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-200/90">
            {isWreck ? "Crate lid · salvage count" : "Rho's slate · island job"}
          </p>
          <h2 className="text-lg font-semibold text-amber-50">{quiz.title}</h2>
        </div>
        <div className="max-h-[75dvh] overflow-y-auto bg-[#f3e6c8] px-4 py-4">
          {reviewOnly && <div className="mb-3 rounded-lg bg-teal-100 p-3 text-sm text-teal-950">
            <p className="font-semibold">Completed job review</p>
            <p>{quiz.priorScore != null ? `Saved result: ${Math.round(quiz.priorScore)}% correct. ` : ""}Look back at the questions, then ask Rho about an idea you want to practice. Reviewing does not change your saved result.</p>
          </div>}
          <p className="mb-3 text-sm text-stone-800">{quiz.instructions}</p>
          <div className="space-y-3">
            {quiz.items.map((item, idx) => (
              <fieldset key={item.id} className="rounded-lg border border-amber-900/20 bg-[#fff8ea] p-3">
                <legend className="text-sm font-medium text-stone-900">
                  {idx + 1}. {item.question}
                </legend>
                <div className="mt-2 space-y-1.5">
                  {item.options.map((option, optionIndex) => (
                    <label
                      key={`${item.id}-${optionIndex}`}
                      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-stone-800 hover:bg-amber-50"
                    >
                      <input
                        type="radio"
                        name={item.id}
                        checked={selected[item.id] === optionIndex}
                        onChange={() =>
                          setSelected((prev) => ({ ...prev, [item.id]: optionIndex }))
                        }
                        disabled={reviewOnly || Boolean(result) || props.submitting}
                        className="mt-0.5"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          {result && (
            <div className="mt-3 rounded-lg bg-amber-100 px-3 py-2 text-sm text-stone-800">
              <p>
                {isWreck ? "Crate count checked" : "Your answers are checked"}: {result.correct}/{result.total} right.
              </p>
              {zpdStage === "hint" && result.hints[0] && (
                <p className="mt-2 text-stone-700">Hint: {result.hints[0]}</p>
              )}
              {zpdStage === "example" && (
                <div className="mt-2 space-y-1 text-stone-700">
                  <p className="font-medium">{WRECK_WORKED_EXAMPLE.crateLabel}</p>
                  <p>Standard: {WRECK_WORKED_EXAMPLE.standardForm}</p>
                  <p>Expanded: {WRECK_WORKED_EXAMPLE.expandedForm}</p>
                  <p>Words: {WRECK_WORKED_EXAMPLE.wordForm}</p>
                </div>
              )}
              {zpdStage === "fade" && (
                <div className="mt-2">
                  <p>{WRECK_WORKED_EXAMPLE.fadePrompt}</p>
                  <input
                    value={fadeTry}
                    onChange={(e) => setFadeTry(e.target.value)}
                    placeholder="1,000 + 200 + 4"
                    className="mt-2 w-full rounded-lg border border-amber-900/20 bg-white px-3 py-2 text-sm"
                  />
                </div>
              )}
            </div>
          )}
          {props.error && <p className="mt-2 text-sm text-red-700">{props.error}</p>}

          <div className="mt-4 flex gap-2">
            {quiz.source === "generated" && !result && props.onReturnToMap && <button type="button" onClick={props.onReturnToMap} disabled={props.submitting} className="rounded-lg border border-stone-400 px-4 py-2 text-sm font-medium text-stone-800 disabled:opacity-50">Back to map</button>}
            {reviewOnly ? (
              <button type="button" onClick={props.onDismiss} className="min-h-11 rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white">Back to Rho</button>
            ) : !result ? (
              <button
                type="button"
                onClick={() =>
                  props.onSubmit(
                    quiz.items.map((item) => ({
                      itemId: item.id,
                      selectedIndex: selected[item.id],
                    }))
                  )
                }
                disabled={!canSubmit || props.submitting}
                className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {props.submitting ? "Checking…" : "Show Rho"}
              </button>
            ) : wreckZpd && zpdStage !== "done" && zpdStage !== "fade" ? (
              <button
                type="button"
                onClick={props.onZpdAdvance}
                className="rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white"
              >
                {zpdStage === "hint" ? "Show a crate example" : "I’ll try one"}
              </button>
            ) : (
              <button
                type="button"
                onClick={props.onDismiss}
                disabled={zpdStage === "fade" && fadeTry.trim().length < 2}
                className="rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Back to Rho
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
