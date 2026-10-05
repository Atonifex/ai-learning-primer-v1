"use client";

import type { CampPublic } from "../../lib/play/camp";
import type { Day0Box } from "../../lib/play/day0";
import Day0Checklist from "./Day0Checklist";

export default function ResourceHud(props: {
  captainName: string;
  camp: CampPublic;
  xp: number;
  hint: string | null;
  chapterProblem: string;
  checklist: Day0Box[] | null;
  /** Hidden from the child by default (§4.14). */
  timerLabel?: string | null;
}) {
  const { camp } = props;
  return (
    <div className="pointer-events-none absolute left-3 top-3 z-20 max-w-[min(100%-6rem,22rem)]">
      <div
        className="rounded-2xl border border-amber-200/25 bg-[#1a120c]/85 px-3 py-2 shadow-lg backdrop-blur-sm"
        data-testid="resource-hud"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-400/90">
          Captain {props.captainName}
        </p>
        <p className="mt-1 text-sm leading-snug text-amber-100" data-testid="chapter-problem">
          {props.chapterProblem}
        </p>
        <p className="mt-1 text-sm text-amber-50" data-testid="camp-stage">
          Camp · <span className="font-semibold text-amber-200">{camp.stageLabel}</span>
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-amber-50">
          <span aria-label={`${camp.rations} rations`}>
            Rations <span className="font-semibold tabular-nums text-amber-200">{camp.rations}</span>
          </span>
          <span aria-label={`${camp.scrap} scrap`}>
            Scrap <span className="tabular-nums">{camp.scrap}</span>
          </span>
          <span aria-label={`${camp.timber} timber`}>
            Timber <span className="tabular-nums">{camp.timber}</span>
          </span>
          <span aria-label={`${camp.canvas} canvas`}>
            Canvas <span className="tabular-nums">{camp.canvas}</span>
          </span>
          {props.timerLabel && (
            <span className="text-amber-100/60" aria-label={`Time on the beach ${props.timerLabel}`}>
              {props.timerLabel}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-amber-100/90" aria-label={`Crew ${camp.crewFound} of ${camp.crewTotal}`}>
          Crew{" "}
          <span className="font-semibold tabular-nums text-amber-200">
            {camp.crewFound} of {camp.crewTotal}
          </span>
          <span className="ml-2 tracking-widest" aria-hidden>
            {camp.crew.map((slot) => (slot.status === "found" ? "●" : slot.status === "signaled" ? "◐" : "○")).join(" ")}
          </span>
        </p>
        <p className="mt-0.5 text-[11px] text-amber-100/50">
          XP <span className="tabular-nums">{props.xp}</span>
        </p>
      </div>
      {props.checklist && <Day0Checklist boxes={props.checklist} />}
      {props.hint && (
        <p className="mt-2 rounded-xl bg-[#0c2a32]/80 px-3 py-2 text-xs leading-snug text-teal-50">
          {props.hint}
        </p>
      )}
    </div>
  );
}
