"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Phase = "name" | "dive";

const DIVE_MIN_MS = 2800;

export default function OnboardingWizard() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("name");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);
  const diveStartedAt = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  async function beginExpedition() {
    setError("");
    setPhase("dive");
    diveStartedAt.current = Date.now();

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 409) {
        await holdForDiveFeel();
        router.push("/learn");
        router.refresh();
        return;
      }
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Failed to save profile"
        );
      }

      await holdForDiveFeel();
      router.push("/learn");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("name");
    }
  }

  async function holdForDiveFeel() {
    if (reducedMotion) return;
    const elapsed = Date.now() - diveStartedAt.current;
    const remaining = DIVE_MIN_MS - elapsed;
    if (remaining > 0) {
      await new Promise((r) => setTimeout(r, remaining));
    }
  }

  const diving = phase === "dive" && !reducedMotion;

  return (
    <div className="relative min-h-screen overflow-hidden text-amber-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#1a5c6e_0%,#0a2a36_45%,#061820_100%)]" />
      <div
        className={`absolute inset-x-0 top-[28%] h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent ${
          diving ? "onboarding-horizon-dive" : ""
        }`}
        aria-hidden
      />
      <div
        className={`absolute left-1/2 top-[18%] h-24 w-24 -translate-x-1/2 rounded-full bg-amber-200/30 blur-2xl ${
          diving ? "onboarding-sun-dive" : ""
        }`}
        aria-hidden
      />

      <div className="absolute inset-x-0 bottom-0 h-[55%]" aria-hidden>
        <div className="onboarding-wave onboarding-wave-a" />
        <div className="onboarding-wave onboarding-wave-b" />
        <div className="onboarding-wave onboarding-wave-c" />
      </div>

      {diving && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className={`onboarding-bubble onboarding-bubble-${i + 1}`}
            />
          ))}
        </div>
      )}

      <div
        className={`relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 ${
          diving ? "onboarding-content-dive" : ""
        }`}
      >
        {phase === "name" ? (
          <div className="w-full max-w-md text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-teal-200/70">
              Primer
            </p>
            <h1 className="font-serif text-4xl tracking-wide text-amber-50 drop-shadow md:text-5xl">
              Welcome, Captain
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-teal-100/75">
              What should the crew call you? Then we dive straight onto the beach.
            </p>

            <label htmlFor="displayName" className="sr-only">
              Your name or nickname
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void beginExpedition();
              }}
              placeholder="e.g. Sam, Captain S, Maya"
              maxLength={40}
              autoComplete="nickname"
              className="mt-8 w-full rounded-xl border border-teal-200/25 bg-[#0a2a36]/70 px-4 py-3.5 text-center text-base text-amber-50 placeholder:text-teal-200/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm focus:border-amber-300/50 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
            />

            {error && (
              <p className="mt-4 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={() => void beginExpedition()}
              className="mt-8 w-full rounded-full border border-amber-200/35 bg-amber-950/55 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition hover:bg-amber-900/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              Dive in
            </button>
            <p className="mt-3 text-xs text-teal-200/45">
              Name is optional — skip if you want.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md text-center" role="status" aria-live="polite">
            <p className="font-serif text-3xl tracking-wide text-amber-50 md:text-4xl">
              Through the fog…
            </p>
            <p className="mt-3 text-sm text-teal-100/80">
              {displayName.trim()
                ? `Rho is already moving, ${displayName.trim()}.`
                : "Rho is already moving."}
            </p>
            <div className="mx-auto mt-10 h-1 w-32 overflow-hidden rounded-full bg-teal-900/80">
              <div
                className={`h-full rounded-full bg-amber-300/80 ${
                  reducedMotion ? "w-full" : "onboarding-progress"
                }`}
              />
            </div>
            {error && (
              <p className="mt-6 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
