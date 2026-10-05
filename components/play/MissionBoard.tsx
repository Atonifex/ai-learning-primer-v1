"use client";

import type { MissionPublic } from "../../lib/play/missions";
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
  onStart: (missionId: string) => void;
  onClose: () => void;
  startingId: string | null;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border-4 border-amber-800/80 bg-[#3d2914] shadow-2xl">
        <div className="flex items-center justify-between bg-[#5c4033] px-4 py-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-200/90">
              Mission board
            </p>
            <h2 className="text-lg font-semibold text-amber-50">
              {props.chapterTitle || "Beach jobs"}
            </h2>
          </div>
          <button
            type="button"
            onClick={props.onClose}
            className="rounded-lg px-2 py-1 text-xs text-amber-100/80 hover:bg-amber-900/40"
          >
            Close
          </button>
        </div>
        <div className="max-h-[70vh] space-y-2 overflow-y-auto bg-[#f3e6c8] px-4 py-3">
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
                ~{m.estimatedMinutes} min · {m.rewards.xp} XP · {m.rewards.rations} ration ·{" "}
                {m.rewards.mapPin}
              </p>
              {m.lockReason && (
                <p className="mt-1 text-xs text-stone-500">{m.lockReason}</p>
              )}
              {m.status !== "locked" && (
                <button
                  type="button"
                  onClick={() => props.onStart(m.id)}
                  disabled={props.startingId === m.id}
                  className="mt-2 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
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
    </div>
  );
}
