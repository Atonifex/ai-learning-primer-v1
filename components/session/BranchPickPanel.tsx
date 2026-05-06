"use client";

import { useState } from "react";
import type { BranchPointUi } from "../../lib/types";

interface BranchPickPanelProps {
  sessionId: string;
  branchPoint: BranchPointUi;
  onResolved: (nextSessionId: string) => void;
  disabled?: boolean;
}

export default function BranchPickPanel({
  sessionId,
  branchPoint,
  onResolved,
  disabled,
}: BranchPickPanelProps) {
  const [picking, setPicking] = useState(false);
  const busy = disabled || picking;

  return (
    <div className="flex-shrink-0 border-t border-stone-200 bg-stone-100/90 px-4 py-4">
      <div className="mx-auto max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 mb-2">
          Choose the next chapter
        </p>
        {branchPoint.promptText && (
          <p className="text-sm text-stone-700 mb-4">{branchPoint.promptText}</p>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          {branchPoint.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={busy}
              onClick={async () => {
                setPicking(true);
                try {
                  const res = await fetch(`/api/session/${sessionId}/branch-pick`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ branchOptionId: opt.id }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Branch failed");
                  onResolved(data.nextSessionId as string);
                } catch (e) {
                  console.error(e);
                  setPicking(false);
                }
              }}
              className="flex flex-col rounded-xl border border-stone-200 bg-white p-3 text-left shadow-sm transition hover:border-amber-300 hover:shadow disabled:opacity-50"
            >
              {opt.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={opt.imageUrl}
                  alt=""
                  className="mb-2 h-24 w-full rounded-lg object-cover"
                />
              )}
              <span className="text-sm font-medium text-stone-900">{opt.title}</span>
              <span className="mt-1 text-xs text-stone-500 line-clamp-3">{opt.teaser}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
