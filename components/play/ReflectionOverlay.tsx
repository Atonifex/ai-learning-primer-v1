"use client";

import ActivitySurface from "./ActivitySurface";

import { useState } from "react";
import type { ChapterReflectionPublic } from "../../lib/play/chapterReflection";
import MicButton from "./MicButton";

export default function ReflectionOverlay(props: {
  reflection: ChapterReflectionPublic;
  submitting?: boolean;
  error?: string | null;
  carriedForward?: string | null;
  onSubmit: (text: string) => void;
  onContinue?: () => void;
}) {
  const [text, setText] = useState(props.reflection.priorText ?? "");

  return (
    <ActivitySurface className="absolute inset-0 z-40 flex items-end justify-center bg-black/45 p-3 sm:items-center">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border-4 border-teal-900/70 bg-[#1a2e32] shadow-2xl">
        <div className="bg-[#0f3a42] px-4 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-200/90">
            Crew log · missing engineer
          </p>
          <h2 className="text-lg font-semibold text-teal-50">{props.reflection.title}</h2>
        </div>
        <div className="bg-[#eef6f4] px-4 py-4">
          {props.carriedForward ? (
            <>
              <p className="text-sm text-stone-800">
                Rho kept your note. The next chapter has to use it. The wreck does not start over.
              </p>
              <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm text-stone-900">
                {props.carriedForward}
              </p>
              <button
                type="button"
                onClick={props.onContinue}
                className="mt-4 rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white"
              >
                Use this note
              </button>
            </>
          ) : (
            <>
          <p className="text-sm text-stone-800">{props.reflection.prompt}</p>
          <p className="mt-2 text-xs text-stone-500">
            Talk or type a little. A short note is enough — Rho will keep it for the crew.
          </p>
          <div className="mt-3 flex items-end gap-2">
            <MicButton
              disabled={props.submitting}
              onTranscript={(spoken) =>
                setText((prev) => (prev.trim() ? `${prev.trim()} ${spoken}` : spoken))
              }
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              disabled={props.submitting}
              placeholder="Tell her what we counted, and how to write it…"
              className="min-h-[5.5rem] flex-1 resize-none rounded-xl border border-teal-900/20 bg-white px-3 py-2 text-sm text-stone-900"
            />
          </div>
          {props.error && <p className="mt-2 text-sm text-red-700">{props.error}</p>}
          <button
            type="button"
            onClick={() => props.onSubmit(text)}
            disabled={text.trim().length < 2 || props.submitting}
            className="mt-4 rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {props.submitting ? "Saving…" : "Leave the note"}
          </button>
            </>
          )}
        </div>
      </div>
    </ActivitySurface>
  );
}
