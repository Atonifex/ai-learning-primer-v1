"use client";

import { useState } from "react";
import {
  LEARNER_GRADE_BANDS,
  type LearnerGradeBand,
} from "../../lib/constants/grades";
import Button from "../ui/Button";

export default function ReadingLevelForm(props: {
  gradeBand: string;
  initialReadingLevel: string;
  captainName: string | null;
}) {
  const [readingLevel, setReadingLevel] = useState<LearnerGradeBand>(
    props.initialReadingLevel as LearnerGradeBand
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingLevel }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Failed to save"
        );
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const captain = props.captainName?.trim() || "the captain";

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-stone-900">Reading level</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        Controls how Rho talks and writes in dialogue scenes — vocabulary,
        sentence length, and in-world passages. This does not change which
        standards are taught yet (still Grade 3 curriculum for now).
      </p>

      <dl className="mt-5 grid gap-3 rounded-lg bg-stone-50 px-4 py-3 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="font-medium text-stone-700">Enrolled grade</dt>
          <dd className="text-stone-900">Grade {props.gradeBand}</dd>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="font-medium text-stone-700">Captain</dt>
          <dd className="text-stone-900">{captain}</dd>
        </div>
      </dl>

      <label
        htmlFor="readingLevel"
        className="mt-6 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-500"
      >
        Dialogue reading level
      </label>
      <select
        id="readingLevel"
        value={readingLevel}
        onChange={(e) => {
          setReadingLevel(e.target.value as LearnerGradeBand);
          setSaved(false);
        }}
        className="mt-2 w-full max-w-xs rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-base text-stone-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
      >
        {LEARNER_GRADE_BANDS.map((g) => (
          <option key={g} value={g}>
            Grade {g}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-stone-500">
        Tip: set this one grade below enrolled grade if {captain} reads more
        comfortably with simpler language.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && (
        <p className="mt-4 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">
          Saved. Rho will use this level in the next dialogue scene.
        </p>
      )}

      <div className="mt-6">
        <Button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || readingLevel === props.initialReadingLevel}
        >
          {saving ? "Saving…" : "Save reading level"}
        </Button>
      </div>
    </div>
  );
}
