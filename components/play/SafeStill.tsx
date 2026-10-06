"use client";

import { useEffect, useRef, useState } from "react";
import { stillLabel, stillSrc, type StillKey } from "../../lib/play/stills";
import { cn } from "../../lib/utils";

export default function SafeStill(props: {
  still: StillKey;
  alt?: string;
  className?: string;
  imgClassName?: string;
  fallbackLabel?: string;
}) {
  const [failedStill, setFailedStill] = useState<StillKey | null>(null);
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // A cached/network failure can happen before hydration attaches onError.
    const frame = requestAnimationFrame(() => {
      if (image.current?.complete && image.current.naturalWidth === 0) setFailedStill(props.still);
    });
    return () => cancelAnimationFrame(frame);
  }, [props.still]);
  const label = stillLabel(props.still);
  const alt = props.alt ?? label;

  if (failedStill === props.still) {
    return (
      <div
        role="img"
        aria-label={`${alt} (placeholder)`}
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-1 bg-teal-950/80 px-3 text-center",
          props.className
        )}
      >
        {!props.fallbackLabel && <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400/80">
          TODO(stills)
        </span>}
        <span className="text-sm font-medium text-teal-50">{props.fallbackLabel ?? label}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={image}
      src={stillSrc(props.still)}
      alt={alt}
      className={cn("h-full w-full object-cover", props.imgClassName, props.className)}
      onError={() => setFailedStill(props.still)}
    />
  );
}
