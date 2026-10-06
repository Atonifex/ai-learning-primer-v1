"use client";

import ActivitySurface from "./ActivitySurface";

import type { MissionPublic } from "../../lib/play/missions";
import { nextCampAction } from "../../lib/play/nextCampAction";
import { useDialogFocus } from "./useDialogFocus";
import { SUBJECT_DISPLAY_NAMES, type PlayableCoreSubjectSlug } from "../../lib/constants/subjects";

function subjectLabel(slug: string): string {
  return SUBJECT_DISPLAY_NAMES[slug as PlayableCoreSubjectSlug] ?? slug;
}

function statusCopy(status: MissionPublic["status"]): string {
  if (status === "completed") return "Done";
  if (status === "locked") return "Locked";
  return "Open";
}

export default function MissionBoard(props: {
  missions: MissionPublic[];
  chapterTitle: string | null;
  boardTitle?: string;
  onStart: (missionId: string) => void;
  onClose: () => void;
  startingId: string | null;
  loading?: boolean;
  placementReady?: boolean;
  onMathCheck?: () => void;
  onFocus?: () => void;
  error?: string | null;
  onRetry?: () => void;
}) {
  const next = nextCampAction(props.missions, Boolean(props.placementReady));
  const dialogRef = useDialogFocus(props.onClose);
  return (
    <ActivitySurface ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Camp needs" className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border-4 border-amber-800/80 bg-[#3d2914] shadow-2xl">
        <div className="flex items-center justify-between bg-[#5c4033] px-4 py-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-200/90">
              {props.boardTitle ?? "Camp needs"}
            </p>
            <h2 className="text-lg font-semibold text-amber-50">
              {props.chapterTitle || "What camp needs now"}
            </h2>
          </div>
          <button
            type="button"
            onClick={props.onClose}
            className="min-h-11 rounded-lg px-3 py-2 text-sm text-amber-100 hover:bg-amber-900/40"
          >
            Close
          </button>
        </div>
        <div className="max-h-[70vh] space-y-2 overflow-y-auto bg-[#f3e6c8] px-4 py-3">
          {props.error && <div role="alert" className="rounded-xl bg-white p-3 text-sm text-red-800">
            <p>{props.error}</p><button type="button" onClick={props.onRetry} className="mt-2 min-h-11 underline">Try again</button>
          </div>}
          {!props.loading && !props.error && <section className="rounded-xl border-2 border-teal-800 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">Your next step</p>
            <h3 className="mt-1 text-lg font-semibold text-stone-900">{next.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-stone-700">{next.detail}</p>
            <button type="button" disabled={Boolean(props.startingId)} className="mt-3 min-h-11 rounded-xl bg-teal-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              onClick={() => next.kind === "check" ? props.onMathCheck?.() : next.kind === "focus" ? props.onFocus?.() : props.onStart(next.missionId)}>{props.startingId ? "Opening…" : next.label}</button>
          </section>}
          {props.loading && !props.error && props.missions.length === 0 && (
            <p className="rounded-xl bg-[#fff8ea] p-3 text-sm text-stone-700">
              Checking what camp needs…
            </p>
          )}
          {props.missions.map((m) => (
            <article
              key={m.id}
              className="rounded-xl border border-amber-900/20 bg-[#fff8ea] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-800/80">
                    {m.pinId} · {subjectLabel(m.subjectSlug)}
                  </p>
                  <h3 className="text-sm font-semibold text-stone-900">{m.title}</h3>
                  <p className="text-xs text-stone-600">{m.theme}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
                  {statusCopy(m.status)}
                </span>
              </div>
              <p className="mt-2 text-xs text-stone-700">
                About {m.estimatedMinutes} minutes · {m.rewards.mapPin}
              </p>
              {m.lockReason && (
                <p className="mt-1 text-xs text-stone-500">{m.lockReason}</p>
              )}
              {m.status !== "locked" && (
                <button
                  type="button"
                  onClick={() => props.onStart(m.id)}
                  disabled={Boolean(props.startingId)}
                  className="mt-2 min-h-11 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {props.startingId === m.id
                    ? "Opening…"
                    : m.status === "completed"
                      ? "Review"
                      : "Start job"}
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </ActivitySurface>
  );
}
