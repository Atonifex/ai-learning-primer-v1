"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

const INTEREST_OPTIONS = [
  "Animals",
  "Space",
  "Sports",
  "Art",
  "Cooking",
  "History",
  "Mysteries",
  "Robots",
  "Ocean",
  "Music",
];

const ENROLLED_SUBJECT_CARDS = [
  { slug: "math_g3", label: "Math", glyph: "△" },
  { slug: "ela_g3", label: "Reading & Writing", glyph: "✎" },
  { slug: "science_g3", label: "Science", glyph: "✺" },
  { slug: "social_studies_g3", label: "Social Studies", glyph: "◇" },
];

const TOTAL_STEPS = 4;

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [goals, setGoals] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  }

  async function handleFinish() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim() || null,
          goals: goals.trim(),
          interests,
        }),
      });
      const data = await res.json();
      if (res.status === 409) {
        // Already onboarded — go straight to learn
        router.push("/learn");
        router.refresh();
        return;
      }
      if (!res.ok) throw new Error(data.error || "Failed to save profile");
      router.push("/learn");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-stone-900 tracking-tight">
            Primer
          </h1>
          <p className="mt-2 text-stone-500">
            Set up your Grade 3 learning journey
          </p>
          <div className="mt-6 flex gap-2 justify-center" aria-label="Progress">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s <= step ? "bg-amber-500 w-8" : "bg-stone-200 w-4"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-2">
                Welcome, Captain
              </h2>
              <p className="text-stone-500 text-sm mb-6">
                What should the crew call you? (You can skip this.)
              </p>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Your name or nickname
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Sam, Captain S, Maya"
                maxLength={40}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors"
              />
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-2">
                What do you want to learn this year?
              </h2>
              <p className="text-stone-500 text-sm mb-6">
                Tell Primer your goals — a sentence is plenty.
              </p>
              <label
                htmlFor="goals"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Your goals
              </label>
              <textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. I want to get better at multiplication and write longer stories."
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors resize-none"
                rows={3}
              />
              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  disabled={!goals.trim()}
                  onClick={() => setStep(3)}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-2">
                What are you into?
              </h2>
              <p className="text-stone-500 text-sm mb-6">
                Pick any that sound fun. Primer weaves them into the story.
              </p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    aria-pressed={interests.includes(interest)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      interests.includes(interest)
                        ? "bg-amber-500 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={() => setStep(4)}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-2">
                Your subjects are ready
              </h2>
              <p className="text-stone-500 text-sm mb-6">
                You and Rho will work across all four — same story, four lenses.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ENROLLED_SUBJECT_CARDS.map((s) => (
                  <div
                    key={s.slug}
                    className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-3 py-3"
                  >
                    <span
                      className="text-amber-600 text-lg leading-none"
                      aria-hidden
                    >
                      {s.glyph}
                    </span>
                    <span className="text-sm font-medium text-stone-800">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-stone-500 leading-relaxed">
                Rho is waiting at the wreck. You&apos;re the captain — the crew
                is counting on you.
              </p>
              {error && (
                <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setStep(3)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  disabled={loading || !goals.trim()}
                  onClick={handleFinish}
                  className="flex-1"
                >
                  {loading ? "Starting…" : "Begin the expedition"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
