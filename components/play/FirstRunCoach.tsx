"use client";

export default function FirstRunCoach(props: { text: string }) {
  return (
    <div className="pointer-events-none absolute bottom-24 left-1/2 z-40 w-[min(28rem,calc(100%-1.5rem))] -translate-x-1/2 rounded-2xl border border-amber-200/25 bg-[#1a120c]/90 px-4 py-3 text-center shadow-lg">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-200/70">
        Rho
      </p>
      <p className="mt-1 text-sm leading-relaxed text-amber-50">{props.text}</p>
    </div>
  );
}
