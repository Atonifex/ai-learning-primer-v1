"use client";

import ClickableText from "./ClickableText";

interface MessageCardProps {
  content: string;
  isFirst?: boolean;
  onWordClick?: (word: string, sentence: string, rect: DOMRect) => void;
}

export default function MessageCard({ content, isFirst, onWordClick }: MessageCardProps) {
  return (
    <div className={`flex gap-3 ${isFirst ? "mt-0" : "mt-2"}`}>
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center mt-0.5">
        <span className="text-amber-700 text-xs font-semibold">P</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
          <p className="story-text text-stone-800 text-[15px] whitespace-pre-wrap">
            {onWordClick ? (
              <ClickableText content={content} onWordClick={onWordClick} />
            ) : (
              content
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
