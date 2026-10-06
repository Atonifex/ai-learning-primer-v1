"use client";

import { useDialogFocus } from "./useDialogFocus";

export default function LeaveConfirmation(props: { leaving: boolean; onClose: () => void; onLeave: () => void }) {
  const ref = useDialogFocus(props.onClose);
  return <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="leave-title"
    className="leave-confirmation absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6">
      <h3 id="leave-title" className="text-lg font-semibold">End this session?</h3>
      <p className="mt-2 text-sm text-stone-500">Primer will save your progress. Time on the beach is already recorded.</p>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={props.onClose} className="min-h-11 flex-1 rounded-xl border border-stone-200 py-2.5 text-sm">Keep playing</button>
        <button type="button" onClick={props.onLeave} disabled={props.leaving} className="min-h-11 flex-1 rounded-xl bg-stone-900 py-2.5 text-sm text-white">{props.leaving ? "Saving…" : "End session"}</button>
      </div>
    </div>
  </div>;
}
