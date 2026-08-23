"use client";

export default function ResourceHud(props: {
  captainName: string;
  rations: number;
  xp: number;
  hint: string | null;
  /** Hidden from the child by default (§4.14). */
  timerLabel?: string | null;
}) {
  return (
    <div className="pointer-events-none absolute left-3 top-3 z-20 max-w-[min(100%-6rem,20rem)]">
      <div className="rounded-2xl border border-amber-200/25 bg-[#1a120c]/85 px-3 py-2 shadow-lg backdrop-blur-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-400/90">
          Captain {props.captainName}
        </p>
        <div className="mt-1 flex items-center gap-4 text-sm text-amber-50">
          <span aria-label={`${props.rations} rations`}>
            Rations{" "}
            <span className="font-semibold tabular-nums text-amber-200">{props.rations}</span>
          </span>
          <span aria-label={`${props.xp} experience`} className="text-amber-100/70">
            XP <span className="tabular-nums">{props.xp}</span>
          </span>
          {props.timerLabel && (
            <span className="text-amber-100/60" aria-label={`Time on the beach ${props.timerLabel}`}>
              {props.timerLabel}
            </span>
          )}
        </div>
      </div>
      {props.hint && (
        <p className="mt-2 rounded-xl bg-[#0c2a32]/80 px-3 py-2 text-xs leading-snug text-teal-50">
          {props.hint}
        </p>
      )}
    </div>
  );
}
