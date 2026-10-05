"use client";

import { useEffect, useState } from "react";
import { ladderForSubject } from "../../lib/play/subjectChecks";
import MathCheck from "./MathCheck";
import SubjectCheck from "./SubjectCheck";

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
}) {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [sittingSubject, setSittingSubject] = useState<string | null>(null);
  const [chosen, setChosen] = useState<Chosen | null>(null);
  const [pending, setPending] = useState<{ to: string; prompt: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkOpen, setCheckOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch(`/api/session/${props.sessionId}/subject-focus`);
      const data = await res.json().catch(() => ({}));
      if (cancelled) return;
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "The subject list did not load.");
        return;
      }
      setChoices(Array.isArray(data.choices) ? data.choices : []);
    })();
    return () => {
      cancelled = true;
    };
  }, [props.sessionId]);

  async function choose(slug: string, confirmed: boolean) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/session/${props.sessionId}/subject-focus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjectSlug: slug,
        sittingSubject,
        confirmed,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "That subject did not open.");
      return;
    }
    if (data.needsConfirm) {
      setPending({
        to: typeof data.to === "string" ? data.to : slug,
        prompt: typeof data.prompt === "string" ? data.prompt : "Change today's subject?",
      });
      return;
    }
    setPending(null);
    setCheckOpen(false);
    setSittingSubject(data.subjectSlug);
    setChosen({
      subjectSlug: data.subjectSlug,
      summaryLine: data.summary?.line ?? "",
      standards: Array.isArray(data.standards) ? data.standards : [],
    });
    props.onSubjectChanged(data.subjectSlug);
  }

  const strands = new Map<string, StandardRow[]>();
  for (const row of chosen?.standards ?? []) {
    const list = strands.get(row.strandName) ?? [];
    list.push(row);
    strands.set(row.strandName, list);
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-[#0a3340]/50 p-4 sm:items-center">
      <section
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-amber-900/30 bg-[#fff8ea] shadow-xl"
        aria-labelledby="subject-focus-title"
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
          {error && <p className="text-sm text-red-800">{error}</p>}
          {chosen && ladderForSubject(chosen.subjectSlug) && (
            <button
              type="button"
              onClick={() => setCheckOpen(true)}
              className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white"
            >
              Find where I should start
            </button>
          )}
          {checkOpen && chosen?.subjectSlug.startsWith("math_") && (
            <MathCheck />
          )}
          {checkOpen && chosen && !chosen.subjectSlug.startsWith("math_") && ladderForSubject(chosen.subjectSlug) && (
            <SubjectCheck ladder={ladderForSubject(chosen.subjectSlug)!} />
          )}
          {chosen && !checkOpen && (
            <div>
              <p className="text-sm font-medium text-stone-800">{chosen.summaryLine}</p>
              <div className="mt-2 space-y-3">
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
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
