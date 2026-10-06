"use client";

import { useEffect, useRef } from "react";
import FormattedText from "../ui/FormattedText";

interface ConceptPopupProps {
  word: string;
  rect: DOMRect;
  content: string;
  streaming: boolean;
  onClose: () => void;
  contained?: boolean;
}

const POPUP_WIDTH = 288;
const GAP = 10;

export default function ConceptPopup({
  word,
  rect,
  content,
  streaming,
  onClose,
  contained = false,
}: ConceptPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  const left = Math.min(
    Math.max(8, rect.left + rect.width / 2 - POPUP_WIDTH / 2),
    window.innerWidth - POPUP_WIDTH - 8
  );
  const bottom = window.innerHeight - rect.top + GAP;
  const arrowLeft = Math.min(
    Math.max(12, rect.left + rect.width / 2 - left - 6),
    POPUP_WIDTH - 20
  );

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    // Defer mousedown listener so the opening click doesn't immediately close the popup
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleMouseDown);
    }, 0);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className={contained ? "contained-definition" : "fixed z-50 bg-white rounded-xl shadow-xl border border-stone-200 p-3"}
      style={contained ? undefined : { width: POPUP_WIDTH, bottom, left }}
      role="region" aria-label={`Meaning of ${word}`}
      onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); onClose(); } }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider truncate pr-2">
          {word}
        </span>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-stone-300 hover:text-stone-500 transition-colors"
          aria-label="Close"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="min-h-[1.75rem]">
        {streaming && !content ? (
          <div className="flex gap-1 items-center py-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1 w-1 rounded-full bg-amber-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        ) : (
          <p className="text-stone-700 text-[13px] leading-relaxed">
            <FormattedText content={content} />
            {streaming && (
              <span className="inline-block w-0.5 h-3 bg-amber-400 ml-0.5 animate-pulse align-middle" />
            )}
          </p>
        )}
      </div>

      {!contained && <div
        className="absolute -bottom-[7px] w-3 h-3 bg-white border-r border-b border-stone-200 rotate-45"
        style={{ left: arrowLeft }}
      />}
    </div>
  );
}
