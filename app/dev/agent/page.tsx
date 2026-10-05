"use client";

import { useState } from "react";
import Link from "next/link";

type BootstrapResult = {
  ok?: boolean;
  error?: string;
  learnUrl?: string;
  boardUrl?: string;
  dialogueUrl?: string;
  username?: string;
  pin?: string;
  displayName?: string;
  sessionId?: string;
  nextSteps?: string[];
};

export default function AgentPlaytestPage() {
  const [result, setResult] = useState<BootstrapResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function bootstrap(open: "dialogue" | "board" | "none") {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dev/agent-bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ open }),
      });
      const data = (await res.json()) as BootstrapResult;
      if (!res.ok) throw new Error(data.error || "Bootstrap failed");
      setResult(data);
      if (data.learnUrl) {
        window.location.href = data.learnUrl;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bootstrap failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg space-y-6 px-4 py-10 text-stone-900">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
          Local only
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Agent playtest</h1>
        <p className="mt-2 text-sm text-stone-600">
          Skips captain login and first-run. Uses seeded{" "}
          <code className="rounded bg-stone-100 px-1">testcaptain</code> / PIN{" "}
          <code className="rounded bg-stone-100 px-1">1234</code>. For Cursor,
          Grok, and other browser agents — not a child-facing screen.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => void bootstrap("dialogue")}
          className="rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Opening…" : "Enter play (dialogue open)"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void bootstrap("board")}
          className="rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm font-medium disabled:opacity-50"
        >
          Enter play (Jobs board open)
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void bootstrap("none")}
          className="rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm font-medium disabled:opacity-50"
        >
          Enter play (overworld only)
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      )}

      {result?.ok && (
        <div className="space-y-2 rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm">
          <p>
            Signed in as {result.displayName} ({result.username}). Session{" "}
            <code>{result.sessionId}</code>
          </p>
          {result.dialogueUrl && (
            <p>
              <Link className="text-amber-900 underline" href={result.dialogueUrl}>
                Dialogue URL
              </Link>
            </p>
          )}
          {result.boardUrl && (
            <p>
              <Link className="text-amber-900 underline" href={result.boardUrl}>
                Board URL
              </Link>
            </p>
          )}
          <ul className="list-disc space-y-1 pl-5 text-stone-600">
            {(result.nextSteps ?? []).map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2 text-sm text-stone-600">
        <p className="font-medium text-stone-800">Agent recipe</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Ensure <code>npm run dev</code> and DB seed (
            <code>npx prisma db seed</code>).
          </li>
          <li>
            <code>POST /api/dev/agent-bootstrap</code> with{" "}
            <code>{`{"open":"dialogue"}`}</code> (sets cookie).
          </li>
          <li>
            Navigate to returned <code>learnUrl</code>.
          </li>
          <li>
            Say: <em>show the mission board</em> — expect Jobs overlay via{" "}
            <code>show_mission_board</code>.
          </li>
        </ol>
        <p>
          Or open{" "}
          <Link href="/login" className="underline">
            /login
          </Link>{" "}
          as testcaptain / 1234.
        </p>
      </div>
    </main>
  );
}
