"use client";

import { useEffect, useState } from "react";

interface PreviouslyOnCardProps {
  sessionId: string;
  text: string;
}

export default function PreviouslyOnCard({ sessionId, text }: PreviouslyOnCardProps) {
  const storageKey = `primer_previously_on_dismissed_${sessionId}`;
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(storageKey) === "1");
    } catch {
      setDismissed(false);
    }
  }, [storageKey]);

  if (!text.trim() || dismissed) return null;

  return (
    <div className="flex-shrink-0 border-b border-amber-200/80 bg-amber-50/90 px-4 py-3">
      <div className="mx-auto flex max-w-2xl flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-900/80">
            Previously on
          </span>
          <button
            type="button"
            onClick={() => {
              try {
                sessionStorage.setItem(storageKey, "1");
              } catch {
                /* ignore */
              }
              setDismissed(true);
            }}
            className="text-xs text-amber-800/70 hover:text-amber-950"
          >
            Dismiss
          </button>
        </div>
        <p className="text-sm leading-relaxed text-stone-800">{text}</p>
      </div>
    </div>
  );
}
