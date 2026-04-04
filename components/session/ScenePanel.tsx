"use client";

import { cn } from "../../lib/utils";

interface ScenePanelProps {
  imageUrl: string | null;
  loading: boolean;
  /** When set, use full height of parent (e.g. right column). Otherwise legacy top band height. */
  className?: string;
}

export default function ScenePanel({ imageUrl, loading, className }: ScenePanelProps) {
  return (
    <div
      className={cn(
        "relative w-full bg-stone-900 overflow-hidden",
        className ?? "h-[42vh] min-h-[220px]"
      )}
    >
      {imageUrl && !loading && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt="Scene"
          className="w-full h-full object-cover transition-opacity duration-700"
        />
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-stone-400 text-xs tracking-widest uppercase">Painting the scene…</p>
          </div>
        </div>
      )}
      {!imageUrl && !loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2 opacity-20">◈</div>
            <p className="text-stone-600 text-xs tracking-widest uppercase">Your story awaits</p>
          </div>
        </div>
      )}
      {/* Gradient overlay at bottom for text readability */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-900/60 to-transparent pointer-events-none" />
    </div>
  );
}
