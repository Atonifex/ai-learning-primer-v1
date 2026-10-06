"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { CURRICULUM_COVERAGE } from "../../lib/play/progressCopy";
import {
  DEFAULT_GRADE_BAND,
  LEARNER_GRADE_BANDS,
  type LearnerGradeBand,
} from "../../lib/constants/grades";

type Captain = {
  userId: string;
  learnerId: string;
  username: string | null;
  displayName: string | null;
  gradeBand: string;
  firstRunStep: string;
};

export default function HouseholdHome() {
  const router = useRouter();
  const [captains, setCaptains] = useState<Captain[]>([]);
  const [fused, setFused] = useState<{ id: string; displayName: string | null } | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [waking, setWaking] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [gradeBand, setGradeBand] = useState<LearnerGradeBand>(DEFAULT_GRADE_BAND);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const res = await fetch("/api/household/captains");
    const text = await res.text();
    let data: {
      error?: string;
      captains?: Captain[];
      fusedProfile?: { id: string; displayName: string | null } | null;
    } = {};
    try {
      data = text ? (JSON.parse(text) as typeof data) : {};
    } catch {
      throw new Error("Could not load household");
    }
    if (!res.ok) throw new Error(data.error || "Could not load household");
    setCaptains(data.captains ?? []);
    setFused(data.fusedProfile ?? null);
  }

  useEffect(() => {
    void refresh()
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Could not load household")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/household/captains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          pin,
          gradeBand,
          claimFused: Boolean(fused),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add captain");
      setUsername("");
      setPin("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add captain");
    } finally {
      setSaving(false);
    }
  }

  async function wake(childUserId: string) {
    setWaking(childUserId);
    setError("");
    try {
      const res = await fetch("/api/household/play-as", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childUserId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not wake captain");
      router.push("/learn");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not wake captain");
      setWaking(null);
    }
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
            Household
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-stone-900">Captains</h1>
          <p className="mt-2 text-sm text-stone-600">
            Add a captain, then hand the device over. They wake on the beach after
            a short crash film.
          </p>
        </div>
        <button type="button" onClick={() => void signOut()} className="text-sm text-stone-500">
          Sign out
        </button>
      </div>

      {loading && <p className="mt-8 text-sm text-stone-500">Loading…</p>}
      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <ul className="mt-8 space-y-3">
        {captains.map((c) => (
          <li
            key={c.userId}
            className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3"
          >
            <div>
              <p className="font-medium text-stone-900">
                {c.displayName || c.username || "Captain"}
              </p>
              <p className="text-xs text-stone-500">
                Login {c.username} · Grade {c.gradeBand}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              disabled={waking === c.userId}
              onClick={() => void wake(c.userId)}
            >
              {waking === c.userId ? "Waking…" : "Wake the captain"}
            </Button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => void handleAdd(e)}
        className="mt-10 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-5"
      >
        <h2 className="text-sm font-semibold text-stone-800">
          {fused ? "Create this student’s profile" : "Create your student's profile"}
        </h2>
        {fused && (
          <p className="text-xs text-stone-500">
            This account still has a fused profile
            {fused.displayName ? ` (${fused.displayName})` : ""}. Pick a login and PIN
            so they can sign in without your email.
          </p>
        )}
        <Input
          placeholder="captain login (maya)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          placeholder="4-digit PIN"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
          required
        />
        {!fused && (
          <label className="block text-sm text-stone-600">
            Grade
            <select
              className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2"
              value={gradeBand}
              onChange={(e) => setGradeBand(e.target.value as LearnerGradeBand)}
            >
              {LEARNER_GRADE_BANDS.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-stone-700">{CURRICULUM_COVERAGE}</p>
        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Saving…" : fused ? "Save captain login" : "Add captain"}
        </Button>
      </form>

      <p className="mt-8 text-center text-xs text-stone-400">
        The full parent report comes later.{" "}
        <Link href="/privacy" className="underline">
          Privacy
        </Link>
      </p>
    </main>
  );
}
