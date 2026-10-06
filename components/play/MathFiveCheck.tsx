"use client";

import ActivitySurface from "./ActivitySurface";

import { useEffect, useState } from "react";
import { practiceForPlacement } from "../../lib/play/mathPractice";
import MathPractice from "./MathPractice";
import { useDialogFocus } from "./useDialogFocus";

type PublicItem = {
  id: string;
  skill: string;
  example: string;
  prompt: string;
  choices: [string, string, string];
};

type Payload = {
  item: PublicItem | null;
  placement: { status: string; standardCode?: string };
  childLine: string | null;
  campLine?: string | null;
  lastCorrect: boolean | null;
  questionNumber: number;
  total: number;
  saved: boolean;
  answers?: { itemId: string; choiceIndex: number }[];
  feedback?: string | null;
  error?: string;
};

export default function MathFiveCheck(props: { sessionId: string; onClose: () => void }) {
  const dialogRef = useDialogFocus(props.onClose);
  const [payload, setPayload] = useState<Payload | null>(null);
  const [answers, setAnswers] = useState<{ itemId: string; choiceIndex: number }[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setPayload(null);
    void fetch(`/api/session/${props.sessionId}/math-check`, { signal: AbortSignal.timeout(20000) })
      .then(async (res) => {
        const data = (await res.json()) as Payload;
        if (!res.ok) throw new Error(data.error || "Could not open the math check");
        if (!cancelled) { setPayload(data); setAnswers(data.answers ?? []); }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not open the math check");
      });
    return () => {
      cancelled = true;
    };
  }, [props.sessionId, retry]);

  async function choose(choiceIndex: number) {
    if (!payload?.item || busy) return;
    const nextAnswers = [...answers, { itemId: payload.item.id, choiceIndex }];
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/session/${props.sessionId}/math-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({ answers: nextAnswers }),
      });
      const data = (await res.json()) as Payload;
      if (!res.ok) throw new Error(data.error || "Could not save that answer");
      setAnswers(data.answers ?? nextAnswers);
      setPayload(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that answer");
    } finally {
      setBusy(false);
    }
  }

  const done = Boolean(payload && !payload.item && payload.childLine);
  const width = payload ? Math.round((payload.questionNumber / payload.total) * 100) : 0;
  const practice =
    done && payload
      ? practiceForPlacement({
          status: payload.placement.status === "above_ladder" ? "above_ladder" : "ready",
          standardCode: payload.placement.standardCode ?? "MA.3.NSO.1.1",
          rung: 0,
        })
      : null;

  return (
    <ActivitySurface
      className="absolute inset-0 z-[70] grid place-items-center bg-[#153e4b]/80 p-4"
      data-testid="math-five-check"
      ref={dialogRef} tabIndex={-1}
      role="dialog" aria-modal="true" aria-label="Math starting check"
    >
      <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#fff8e8] p-5 text-[#153e4b] shadow-xl sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a5a12]">
          Math check
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ead9b0]" aria-hidden>
          <div className="h-full bg-[#c47b2b]" style={{ width: `${done ? 100 : width}%` }} />
        </div>
        <p className="mt-2 text-sm text-[#5c4632]" data-testid="math-five-progress" role="status">
          {payload ? `${payload.questionNumber} of ${payload.total}` : "Opening…"}
        </p>

        {error && <div role="alert" className="mt-3 text-sm text-red-800"><p>The check could not finish loading or saving. Restore your saved place before answering again.</p><button type="button" disabled={busy} className="min-h-11 underline" onClick={() => setRetry((n) => n + 1)}>Restore saved check</button></div>}
        {payload?.feedback && <p role="status" className="mt-3 rounded-xl bg-amber-100 p-3 text-sm">{payload.feedback}</p>}

        {done && payload && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Starting point</h2>
            <p className="mt-2 text-base leading-relaxed">{payload.childLine}</p>
            {payload.campLine && <p className="mt-2 text-base leading-relaxed">{payload.campLine}</p>}
            {payload.placement.standardCode && (
              <p className="mt-2 text-xs text-[#5c4632]">{payload.placement.standardCode}</p>
            )}
            {practice && <MathPractice item={practice} />}
            <button
              type="button"
              className="mt-5 rounded-xl bg-[#153e4b] px-4 py-2 text-sm font-medium text-[#fff8e8]"
              onClick={props.onClose}
            >
              Back to camp
            </button>
          </div>
        )}

        {!done && payload?.item && (
          <div className="mt-4">
            <p className="text-sm text-[#5c4632]">{payload.item.skill}</p>
            <p className="mt-2 text-sm leading-relaxed">{payload.item.example}</p>
            <h2 className="mt-4 text-lg font-semibold leading-snug">{payload.item.prompt}</h2>
            <div className="mt-4 grid gap-2">
              {payload.item.choices.map((choice, index) => (
                <button
                  key={choice}
                  type="button"
                  disabled={busy || Boolean(error)}
                  data-testid="math-check-choice"
                  className="rounded-xl border border-[#e2d2b0] bg-white px-4 py-3 text-left text-base disabled:opacity-50"
                  onClick={() => void choose(index)}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        )}

        {!done && (
          <button
            type="button"
            className="mt-4 min-h-11 text-sm text-[#5c4632] underline"
            onClick={props.onClose}
          >
            Close
          </button>
        )}
        {!done && <p className="mt-1 text-xs text-[#5c4632]" role="status">{busy ? "Saving your answer…" : payload?.saved ? "Saved. You can close this check and return to the next question." : "Each answered question will be saved. You can take a break."}</p>}
      </div>
    </ActivitySurface>
  );
}
