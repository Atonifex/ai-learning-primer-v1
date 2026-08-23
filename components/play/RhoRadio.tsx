"use client";

export default function RhoRadio(props: {
  onCall: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={props.onCall}
      disabled={props.disabled}
      className="pointer-events-auto flex items-center gap-2 rounded-full border border-teal-300/40 bg-[#0c2a32]/90 px-3 py-2 text-left shadow-lg hover:bg-teal-900/80 focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:opacity-50"
      aria-label="Call Rho, First Mate"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-teal-50">
        R
      </span>
      <span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-200/80">
          First Mate
        </span>
        <span className="block text-sm font-medium text-teal-50">Call Rho</span>
      </span>
    </button>
  );
}
