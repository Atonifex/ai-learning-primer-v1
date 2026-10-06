"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CAPTAIN_NAME_MAX_LENGTH, validCaptainName } from "../../lib/profile/captainName";
import Button from "../ui/Button";

export default function CaptainNameForm({ initialName }: { initialName: string | null }) {
  const router = useRouter();
  const [name, setName] = useState(initialName ?? "Captain");
  const [savedName, setSavedName] = useState(initialName ?? "Captain");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const displayName = validCaptainName(name);
    if (!displayName) {
      setError("Enter a captain name between 1 and 40 characters.");
      return;
    }
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Could not save your captain name. Try again.");
      setName(displayName);
      setSavedName(displayName);
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your captain name. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(event) => void save(event)} className="mb-6 rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-stone-900">Captain name</h2>
      <p className="mt-2 text-sm text-stone-600">Choose the name Rho and your crew use. Your login and PIN stay the same.</p>
      <label htmlFor="captain-name" className="mt-5 block text-sm font-medium text-stone-700">Your captain name</label>
      <input id="captain-name" value={name} maxLength={CAPTAIN_NAME_MAX_LENGTH} required disabled={saving}
        onChange={(event) => { setName(event.target.value); setSaved(false); setError(""); }}
        className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-900 focus:outline-2 focus:outline-amber-400" />
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      {saved && <p role="status" className="mt-3 text-sm text-teal-800">Captain name saved.</p>}
      <div className="mt-4"><Button type="submit" disabled={saving || name.trim() === savedName}>
        {saving ? "Saving…" : "Save captain name"}
      </Button></div>
    </form>
  );
}
