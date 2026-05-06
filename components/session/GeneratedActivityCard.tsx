"use client";

import { useMemo, useState } from "react";
import type { GeneratedActivity } from "../../lib/types";

export default function GeneratedActivityCard(props: {
  sessionId: string;
  activity: GeneratedActivity;
  onSubmitted?: (result: { score: number; total: number; correct: number; mastery: number }) => void;
}) {
  const { sessionId, activity, onSubmitted } = props;
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    correct: number;
    mastery: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => activity.items.every((item) => typeof selected[item.id] === "number"),
    [activity.items, selected]
  );

  async function submit() {
    if (!canSubmit || submitting || result) return;
    setSubmitting(true);
    setError(null);
    try {
      const answers = activity.items.map((item) => ({
        itemId: item.id,
        selectedIndex: selected[item.id],
      }));
      const res = await fetch(
        `/api/session/${sessionId}/activity/${activity.id}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        }
      );
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Failed to submit activity");
      }
      setResult(payload.result);
      onSubmitted?.(payload.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit activity");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto my-3 w-full max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
        Mini Quiz · {activity.standardCode}
      </div>
      <h3 className="mb-1 text-base font-semibold text-stone-900">{activity.title}</h3>
      <p className="mb-4 text-sm text-stone-700">{activity.instructions}</p>

      <div className="space-y-4">
        {activity.items.map((item, idx) => (
          <div key={item.id} className="rounded-lg border border-amber-100 bg-white p-3">
            <p className="mb-2 text-sm font-medium text-stone-900">
              {idx + 1}. {item.question}
            </p>
            <div className="space-y-2">
              {item.options.map((option, optionIndex) => {
                const checked = selected[item.id] === optionIndex;
                return (
                  <label
                    key={`${item.id}-${optionIndex}`}
                    className="flex cursor-pointer items-start gap-2 text-sm text-stone-800"
                  >
                    <input
                      type="radio"
                      name={item.id}
                      checked={checked}
                      onChange={() =>
                        setSelected((prev) => ({ ...prev, [item.id]: optionIndex }))
                      }
                      disabled={Boolean(result)}
                      className="mt-0.5"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={submit}
          disabled={!canSubmit || submitting || Boolean(result)}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : result ? "Submitted" : "Submit Quiz"}
        </button>
        {result && (
          <p className="text-sm text-stone-700">
            Score {result.score}% ({result.correct}/{result.total}) · Mastery {result.mastery}
          </p>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
