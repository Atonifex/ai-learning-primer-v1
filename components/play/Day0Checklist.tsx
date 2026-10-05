"use client";

import type { Day0Box } from "../../lib/play/day0";

export default function Day0Checklist(props: { boxes: Day0Box[] }) {
  return (
    <div
      className="mt-2 rounded-xl border border-amber-200/20 bg-[#1a120c]/70 px-3 py-2"
      data-testid="day0-checklist"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400/80">
        First shore
      </p>
      <ul className="mt-1 space-y-0.5">
        {props.boxes.map((box) => (
          <li key={box.id} className="flex items-center gap-2 text-sm text-amber-50">
            <span aria-hidden className={box.done ? "text-amber-200" : "text-amber-100/40"}>
              {box.done ? "☑" : "☐"}
            </span>
            <span className={box.done ? "text-amber-100/90" : "text-amber-100/70"}>{box.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
