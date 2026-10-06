"use client";

import { useEffect, useState } from "react";
import type { CheckAnswer } from "../../lib/play/subjectFiveCheck";

type Payload = {
  item: { id: string; skill: string; example: string; prompt: string; choices: string[] } | null;
  answers: CheckAnswer[]; done: boolean; asked: number; total: number;
  childLine: string | null; feedback: string | null; saved: boolean;
};

export default function SubjectFiveCheck({ sessionId, onTalk }: { sessionId: string; onTalk: () => void }) {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => { controller.abort(); setError("The check took too long to load. Try again to restore your place."); }, 20000);
    setData(null);
    setError(null);
    void fetch(`/api/session/${sessionId}/subject-check`, { signal: controller.signal })
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error);
        if (!controller.signal.aborted) setData(result);
      }).catch(() => { if (!controller.signal.aborted) setError("The check did not load. Try again to restore your place."); }).finally(() => clearTimeout(timeout));
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [sessionId, retry]);

  async function answer(choiceIndex: number) {
    if (!data?.item || busy) return;
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/api/session/${sessionId}/subject-check`, {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(20000),
        body: JSON.stringify({ answers: [...data.answers, { itemId: data.item.id, choiceIndex }] }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setData(result);
    } catch { setError("The answer did not finish saving. Try again to restore your saved place."); }
    finally { setBusy(false); }
  }

  return <section aria-label="Subject starting check" className="space-y-3 rounded-xl border border-amber-900/20 bg-white p-4" data-testid="subject-five-check">
    {error && <div role="alert" className="text-sm text-red-800"><p>{error}</p><button type="button" disabled={busy} onClick={() => setRetry((n) => n + 1)} className="min-h-11 underline">Try again</button></div>}
    {!data && !error && <p role="status">Opening your saved check…</p>}
    {data && <>
      <p role="status" className="text-sm text-teal-900">{data.done ? "Starting check complete" : `Question ${data.asked + 1} of ${data.total}`}{busy ? " · Saving…" : data.saved ? " · Saved" : ""}</p>
      {data.feedback && <p className="rounded-lg bg-amber-50 p-3 text-sm text-stone-800">{data.feedback}</p>}
      {data.item ? <>
        <p className="font-medium text-stone-900">{data.item.skill}</p>
        <div className="rounded-lg bg-teal-50 p-3 text-sm text-stone-800"><p className="mb-1 font-semibold">An example</p>{data.item.example}</div>
        <h3 className="text-base font-semibold text-stone-900">{data.item.prompt}</h3>
        <div className="grid gap-2">{data.item.choices.map((choice, index) => <button type="button" key={choice} disabled={busy || Boolean(error)} onClick={() => void answer(index)} className="min-h-11 rounded-xl border border-stone-300 px-4 py-3 text-left text-base text-stone-900 hover:border-teal-700 disabled:opacity-50">{choice}</button>)}</div>
        <p className="text-xs text-stone-600">You can return to the beach. Each answered question is saved.</p>
      </> : <>
        <h3 className="text-lg font-semibold text-stone-900">Your next learning step</h3>
        <p className="text-sm leading-relaxed text-stone-800">{data.childLine}</p>
        <button type="button" onClick={onTalk} className="min-h-11 rounded-xl bg-teal-900 px-4 py-2 text-sm font-semibold text-white">Talk it through with Rho</button>
      </>}
    </>}
  </section>;
}
