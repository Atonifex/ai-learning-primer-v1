"use client";

import ActivitySurface from "./ActivitySurface";

import { useEffect, useState } from "react";
import { CURRICULUM_COVERAGE } from "../../lib/play/progressCopy";
import { ladderForSubject } from "../../lib/play/subjectChecks";
import SubjectFiveCheck from "./SubjectFiveCheck";
import { useDialogFocus } from "./useDialogFocus";

type Choice = { slug: string; label: string };
type StandardRow = {
  code: string;
  description: string;
  evidenceCount: number;
  strandName: string;
};

type Chosen = {
  subjectSlug: string;
  summaryLine: string;
  standards: StandardRow[];
};

export default function SubjectFocusPanel(props: {
  sessionId: string;
  onClose: () => void;
  onSubjectChanged: (slug: string) => void;
  onOpenMathCheck?: () => void;
  onTalk?: () => void;
}) {
  const dialogRef = useDialogFocus(props.onClose);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [sittingSubject, setSittingSubject] = useState<string | null>(null);
  const [chosen, setChosen] = useState<Chosen | null>(null);
  const [pending, setPending] = useState<{ to: string; prompt: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkOpen, setCheckOpen] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [retrySelection, setRetrySelection] = useState<{ slug: string; confirmed: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setError(null);
      try {
      const res = await fetch(`/api/session/${props.sessionId}/subject-focus`, { signal: AbortSignal.timeout(20000) });
      const data = await res.json().catch(() => ({}));
      if (cancelled) return;
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "The subject list did not load.");
        return;
      }
      setChoices(Array.isArray(data.choices) ? data.choices : []);
      } catch {
        if (!cancelled) setError("Subjects could not load. Check your connection and try again.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [props.sessionId, loadAttempt]);

  async function choose(slug: string, confirmed: boolean) {
    if (busy) return;
    setBusy(true);
    setError(null);
    setCheckOpen(false);
    setRetrySelection({ slug, confirmed });
    try {
    const res = await fetch(`/api/session/${props.sessionId}/subject-focus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjectSlug: slug,
        sittingSubject,
        confirmed,
      }),
      signal: AbortSignal.timeout(20000),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "That subject did not open.");
      return;
    }
    if (data.needsConfirm) {
      setRetrySelection(null);
      setPending({
        to: typeof data.to === "string" ? data.to : slug,
        prompt: typeof data.prompt === "string" ? data.prompt : "Change today's subject?",
      });
      return;
    }
    setPending(null);
    setRetrySelection(null);
    setCheckOpen(false);
    setSittingSubject(data.subjectSlug);
    setChosen({
      subjectSlug: data.subjectSlug,
      summaryLine: data.summary?.line ?? "",
      standards: Array.isArray(data.standards) ? data.standards : [],
    });
    props.onSubjectChanged(data.subjectSlug);
    } catch {
      setError("That subject did not open. Please try again.");
    } finally { setBusy(false); }
  }

  const strands = new Map<string, StandardRow[]>();
  for (const row of chosen?.standards ?? []) {
    const list = strands.get(row.strandName) ?? [];
    list.push(row);
    strands.set(row.strandName, list);
  }

  return (
    <ActivitySurface ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="subject-focus-title" className="absolute inset-0 z-50 flex items-end justify-center bg-[#0a3340]/50 p-4 sm:items-center">
      <section
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-amber-900/30 bg-[#fff8ea] shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-amber-900/15 px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-800/80">
              Today&apos;s focus
            </p>
            <h2 id="subject-focus-title" className="text-lg font-semibold text-stone-900">
              What do you want to work on?
            </h2>
          </div>
          <button
            type="button"
            onClick={props.onClose}
            className="rounded-lg px-2 py-1 text-xs text-stone-600 hover:bg-amber-100"
          >
            Back to the beach
          </button>
        </div>
        <div className="space-y-3 overflow-y-auto px-4 py-3">
          <p className="text-sm leading-relaxed text-stone-700">One subject, one small step for camp. Pick a subject, then try a starting check.</p>
          <details className="text-xs text-stone-600"><summary className="cursor-pointer py-2">About this beta&apos;s learning levels</summary><p>{CURRICULUM_COVERAGE}</p></details>
          {choices.length === 0 && !error && (
            <p className="text-sm text-stone-600">Loading subjects…</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {choices.map((choice) => {
              const active = sittingSubject === choice.slug;
              return (
                <button
                  key={choice.slug}
                  type="button"
                  disabled={busy}
                  onClick={() => void choose(choice.slug, false)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm font-medium disabled:opacity-50 ${
                    active
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-amber-900/20 bg-white text-stone-900 hover:border-amber-700"
                  }`}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
          {pending && (
            <div className="rounded-xl border border-amber-800/30 bg-amber-50 p-3">
              <p className="text-sm text-stone-800">{pending.prompt}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPending(null)}
                  className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-800"
                >
                  Stay
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void choose(pending.to, true)}
                  className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  Yes, switch
                </button>
              </div>
            </div>
          )}
          {error && <div role="alert" className="text-sm text-red-800"><p>{error}</p><button type="button" disabled={busy} className="min-h-11 underline" onClick={() => retrySelection ? void choose(retrySelection.slug, retrySelection.confirmed) : setLoadAttempt((attempt) => attempt + 1)}>Try again</button></div>}
          {chosen && ladderForSubject(chosen.subjectSlug) && (
            <button
              type="button"
              disabled={busy || Boolean(error) || Boolean(pending)}
              onClick={() => {
                if (chosen.subjectSlug.startsWith("math_") && props.onOpenMathCheck) {
                  props.onOpenMathCheck();
                  return;
                }
                setCheckOpen(true);
              }}
              className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white"
            >
              Find where I should start
            </button>
          )}
          {checkOpen && chosen && !chosen.subjectSlug.startsWith("math_") && ladderForSubject(chosen.subjectSlug) && (
            <SubjectFiveCheck key={chosen.subjectSlug} sessionId={props.sessionId} onTalk={props.onTalk ?? props.onClose} />
          )}
          {chosen && !checkOpen && (
            <div>
              <p className="text-sm font-medium text-stone-800">{chosen.summaryLine}</p>
              <details className="mt-2 space-y-3"><summary className="cursor-pointer py-3 text-sm font-medium text-teal-900">See skills and standards</summary>
                {[...strands.entries()].map(([strandName, rows]) => (
                  <div key={strandName}>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      {strandName}
                    </h3>
                    <ul className="mt-1 space-y-1">
                      {rows.map((row) => (
                        <li key={row.code} className="text-sm text-stone-800">
                          <span className="font-medium">{row.code}</span>
                          <span className="text-stone-500">
                            {" "}
                            · {row.evidenceCount > 0 ? "Seen" : "Not yet"}
                          </span>
                          <span className="mt-0.5 block text-xs text-stone-600">
                            {row.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </details>
            </div>
          )}
        </div>
      </section>
    </ActivitySurface>
  );
}
