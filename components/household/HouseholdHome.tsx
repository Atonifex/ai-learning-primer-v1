"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { CAPTAIN_NAME_MAX_LENGTH, captainDisplayName } from "../../lib/profile/captainName";
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
  const [ready, setReady] = useState<Captain | null>(null);
  const readyHeading = useRef<HTMLHeadingElement>(null);
  const [displayName, setDisplayName] = useState("");

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [gradeBand, setGradeBand] = useState<LearnerGradeBand>(DEFAULT_GRADE_BAND);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (ready) readyHeading.current?.focus(); }, [ready]);

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
    return data;
  }

  useEffect(() => {
    void refresh()
      .then((data) => setDisplayName(data.fusedProfile?.displayName || ""))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Could not load household")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/household/captains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          displayName,
          pin,
          gradeBand,
          claimFused: Boolean(fused),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add captain");
      // Creation succeeded. A later list reload failure must not invite duplicate creation.
      setReady({
        userId: data.captain?.userId ?? data.claimed.childUserId,
        learnerId: data.captain?.learnerId ?? data.claimed.learnerId,
        username: data.captain?.username ?? data.claimed.username,
        displayName: fused?.displayName || displayName.trim(),
        gradeBand,
        firstRunStep: fused ? "complete" : "video",
      });
      setDisplayName("");
      setUsername("");
      setPin("");
      await refresh().catch(() => setError("Captain saved. Reload the household list to see all captains."));
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
      // This is an account boundary: start a fresh document so cached parent/student
      // route content cannot be reused for a different captain.
      window.location.assign("/learn");
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
            Set up your student once, then open their learning experience.
            Returning captains continue with their saved work.
          </p>
        </div>
        <button type="button" onClick={() => void signOut()} className="text-sm text-stone-500">
          Sign out
        </button>
      </div>

      <Link href="/household/progress" className="mt-4 inline-block min-h-11 rounded-lg px-2 py-3 text-sm font-medium text-teal-900 underline">Student usage and progress</Link>
      {loading && <p className="mt-8 text-sm text-stone-500">Loading…</p>}
      {error && (
        <div className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <p role="alert">{error}</p>
          <button type="button" className="min-h-11 underline" onClick={() => void refresh().then(() => setError("")).catch(() => setError("Could not load household. Try again."))}>Reload household list</button>
        </div>
      )}

      {!loading && (
        <section aria-label="First session and handoff" className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-5">
          <h2 ref={readyHeading} tabIndex={-1} className="text-lg font-semibold text-teal-950">{ready ? `${captainDisplayName(ready.displayName, ready.username)} is ready` : "What happens in the first session?"}</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-700">Your student meets Rho, discovers how useful skills help the crew, and tries a starting check so Rho can choose helpful practice. They can pause or skip the intro. They don’t need to know everything yet.</p>
          {ready && <>
            <p className="mt-3 text-sm text-stone-700">Opening switches this device to your student’s account. Hand it over once their session opens. Their saved work stays with their captain.</p>
            <p className="mt-3 text-sm text-stone-700">Next time: choose Captain on the sign-in screen and use <strong>{ready.username}</strong> with the PIN you set. To return as a parent, open Settings, choose Switch account, then sign in with your parent email and password.</p>
            <Button className="mt-4 min-h-11 w-full" type="button" disabled={waking !== null} onClick={() => void wake(ready.userId)}>{waking ? "Opening…" : `Open ${captainDisplayName(ready.displayName, ready.username)}’s learning`}</Button>
          </>}
        </section>
      )}

      <ul className="mt-8 space-y-3">
        {captains.map((c) => (
          <li
            key={c.userId}
            className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3"
          >
            <div className="min-w-0 break-words">
              <p className="font-medium text-stone-900">
                {captainDisplayName(c.displayName, c.username)}
              </p>
              <p className="text-xs text-stone-500">
                Login {c.username} · Grade {c.gradeBand}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              className="min-h-11 shrink-0"
              disabled={waking !== null}
              onClick={() => { setReady(c); setError(""); }}
            >
              {c.firstRunStep === "video" ? "Prepare handoff" : "Continue"}
            </Button>
          </li>
        ))}
      </ul>

      {!loading && <form
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
        <label htmlFor="captain-display-name" className="block text-sm font-medium text-stone-700">Captain name</label>
        <Input id="captain-display-name" aria-describedby="captain-name-help" value={displayName} maxLength={CAPTAIN_NAME_MAX_LENGTH} onChange={(e) => setDisplayName(e.target.value)} required readOnly={Boolean(fused?.displayName)} />
        <p id="captain-name-help" className="text-xs text-stone-600">What Rho calls your student. A first name or nickname is enough. They can change it later in Settings.{fused?.displayName ? " Their existing captain name is kept." : ""}</p>
        <label htmlFor="captain-login" className="block text-sm font-medium text-stone-700">Captain login</label>
        <Input
          id="captain-login"
          aria-describedby="captain-login-help"
          placeholder="e.g. maya"
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9_]{3,20}"
          autoCapitalize="none"
          autoCorrect="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <p id="captain-login-help" className="text-xs text-stone-600">For signing in: 3–20 letters, numbers or underscores. It can match their captain name. No student email needed.</p>
        <label htmlFor="captain-pin" className="block text-sm font-medium text-stone-700">4-digit PIN</label>
        <Input
          id="captain-pin"
          type="password"
          autoComplete="new-password"
          pattern="[0-9]{4}"
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
        {!fused && <p className="text-xs text-stone-600">Their school grade gives Rho a starting context. The starting check helps find the right support; it is not a school-grade verdict.</p>}
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-stone-700">{CURRICULUM_COVERAGE}</p>
        <Button type="submit" disabled={saving} className="min-h-11 w-full">
          {saving ? "Saving…" : fused ? "Save captain login" : "Add captain"}
        </Button>
      </form>}

      <p className="mt-8 text-center text-xs text-stone-400">
        <Link href="/privacy" className="underline">
          Privacy
        </Link>
      </p>
    </main>
  );
}
