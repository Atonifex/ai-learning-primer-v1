"use client";

import FormattedText from "../ui/FormattedText";

interface MessageCardProps {
  content: string;
  isFirst?: boolean;
  onWordClick?: (word: string, context: string, rect: DOMRect) => void;
  onHear?: () => void;
  hearing?: boolean;
  hearLoading?: boolean;
}

export default function MessageCard({
  content,
  isFirst,
  onWordClick,
  onHear,
  hearing,
  hearLoading,
}: MessageCardProps) {
  return (
    <div className={`flex gap-3 ${isFirst ? "mt-0" : "mt-2"}`}>
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center mt-0.5">
        <span className="text-amber-700 text-xs font-semibold">P</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
          <p className="story-text text-lg leading-7 text-stone-800 md:text-xl md:leading-8">
            <FormattedText content={content} onWordClick={onWordClick} />
          </p>
          {onHear && (
            <button
              type="button"
              onClick={onHear}
              aria-label={hearing ? "Stop Rho" : "Hear Rho"}
              aria-pressed={hearing}
              className="mt-2 text-sm font-medium text-amber-800/80 hover:text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
            >
              {hearLoading ? "Getting Rho's voice…" : hearing ? "Stop voice" : "Hear Rho"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
