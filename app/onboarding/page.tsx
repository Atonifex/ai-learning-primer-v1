"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/ui/Button";

const LANGUAGES = [
  { value: "ES", label: "Spanish", flag: "🇪🇸", description: "Español" },
  { value: "ZH", label: "Chinese", flag: "🇨🇳", description: "中文 (Mandarin)" },
];

const LEVELS = [
  { value: "BEGINNER", label: "Beginner", description: "Just starting out — I know little to nothing" },
  { value: "INTERMEDIATE", label: "Intermediate", description: "I can hold basic conversations" },
  { value: "ADVANCED", label: "Advanced", description: "I'm fairly fluent but want to deepen my skills" },
];

const INTEREST_OPTIONS = [
  "Travel", "Food & cooking", "History", "Literature", "Music", "Film",
  "Business", "Technology", "Sports", "Philosophy", "Nature", "Art",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [goals, setGoals] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  async function handleFinish() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeLanguage: language, currentLevel: level, goals, interests }),
      });
      const data = await res.json();
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
          <h1 className="text-3xl font-semibold text-stone-900 tracking-tight">Primer</h1>
          <p className="mt-2 text-stone-500">Let&apos;s set up your learning journey</p>
          <div className="mt-6 flex gap-2 justify-center">
            {[1, 2, 3].map((s) => (
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
              <h2 className="text-xl font-semibold text-stone-900 mb-2">What are you learning?</h2>
              <p className="text-stone-500 text-sm mb-6">Pick the language you want to study</p>
              <div className="space-y-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => setLanguage(lang.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      language === lang.value
                        ? "border-amber-500 bg-amber-50"
                        : "border-stone-100 hover:border-stone-200"
                    }`}
                  >
                    <span className="text-3xl">{lang.flag}</span>
                    <div>
                      <div className="font-semibold text-stone-900">{lang.label}</div>
                      <div className="text-sm text-stone-500">{lang.description}</div>
                    </div>
                  </button>
                ))}
              </div>
              <Button
                className="w-full mt-6"
                size="lg"
                disabled={!language}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-2">What&apos;s your level?</h2>
              <p className="text-stone-500 text-sm mb-6">Be honest — Primer will adapt to you</p>
              <div className="space-y-3">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`w-full flex flex-col gap-1 p-4 rounded-xl border-2 transition-all text-left ${
                      level === l.value
                        ? "border-amber-500 bg-amber-50"
                        : "border-stone-100 hover:border-stone-200"
                    }`}
                  >
                    <span className="font-semibold text-stone-900">{l.label}</span>
                    <span className="text-sm text-stone-500">{l.description}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" size="lg" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button size="lg" disabled={!level} onClick={() => setStep(3)} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-stone-900 mb-2">Tell Primer about you</h2>
              <p className="text-stone-500 text-sm mb-6">This helps create a personalized experience</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    What&apos;s your main goal?
                  </label>
                  <textarea
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="e.g. I want to travel to Mexico next year and have real conversations..."
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    What topics interest you? <span className="text-stone-400 font-normal">(choose any)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
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
                </div>
              </div>
              {error && (
                <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" size="lg" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button
                  size="lg"
                  disabled={!goals.trim() || loading}
                  onClick={handleFinish}
                  className="flex-1"
                >
                  {loading ? "Starting…" : "Begin learning"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
