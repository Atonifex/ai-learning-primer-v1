"use client";

import { useState } from "react";
import MicButton from "../play/MicButton";
import SafeStill from "../play/SafeStill";

export default function CaptainAwakening(props: {
  onSaved: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(displayName: string) {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          firstRunEvent: "name_saved",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not write the log");
      props.onSaved(displayName.trim() || "Captain");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not write the log");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col bg-[#071820] text-amber-50">
      <div className="absolute inset-0">
        <SafeStill still="crashAftermathBeach" alt="Dawn beach after the crash" />
        <div className="absolute inset-0 bg-[#071820]/55" />
      </div>
      <div className="relative z-10 flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="flex min-h-0 flex-1 flex-col justify-center px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200/70">
            Torn Guild orders
          </p>
          <h1 className="mt-3 font-serif text-3xl tracking-wide md:text-4xl">
            The crew needs a name for the captain
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-teal-100/80">
            Speak it or type it. Rho writes it in the log.
          </p>
          <label htmlFor="captainName" className="sr-only">
            Captain name
          </label>
          <div className="mt-6 flex max-w-md items-center gap-2">
            <MicButton
              onTranscript={(text) => setName(text.replace(/[.?!,]/g, "").trim())}
            />
            <input
              id="captainName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void save(name);
              }}
              maxLength={40}
              placeholder="Maya, Sam, Captain S"
              className="flex-1 rounded-xl border border-amber-200/30 bg-[#0a2a36]/80 px-4 py-3 text-base text-amber-50 placeholder:text-teal-200/40 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
            />
          </div>
          {name.trim() && (
            <p className="mt-4 font-serif text-xl text-amber-100">
              Log: Captain {name.trim()}
            </p>
          )}
          {error && (
            <p className="mt-3 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={() => void save(name)}
            className="mt-8 w-full max-w-md rounded-full border border-amber-200/40 bg-amber-950/55 px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 hover:bg-amber-900/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {saving ? "Writing…" : name.trim() ? "Write it in the log" : "Call me Captain"}
          </button>
        </div>
        <div className="relative h-[36vh] w-full flex-shrink-0 md:h-auto md:w-[42%]">
          <SafeStill still="rhoPortraitNeutral" alt="Rho, First Mate" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#071820] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-200/80">
              First Mate
            </p>
            <p className="text-lg text-teal-50">Rho</p>
          </div>
        </div>
      </div>
    </div>
  );
}
