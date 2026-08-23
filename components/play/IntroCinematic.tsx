"use client";

import { useState } from "react";
import { CINEMATIC_MP4 } from "../../lib/play/stills";
import SafeStill from "./SafeStill";

export default function IntroCinematic(props: { onSkip: () => void }) {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col bg-[#071820]">
      <div className="relative min-h-0 flex-1">
        {!videoFailed ? (
          <video
            className="h-full w-full object-cover"
            src={CINEMATIC_MP4}
            autoPlay
            muted
            playsInline
            onError={() => setVideoFailed(true)}
            onEnded={props.onSkip}
            aria-label="Crash landing intro"
          />
        ) : (
          <SafeStill still="cinematicPoster" alt="The ship hits the reef. Dawn. A beach." />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071820] via-transparent to-[#071820]/40" />
        <div className="absolute bottom-24 left-0 right-0 px-6 text-center">
          <p className="font-serif text-2xl tracking-wide text-amber-50 drop-shadow md:text-3xl">
            The Guild ship does not make the lagoon.
          </p>
          <p className="mt-2 text-sm text-teal-100/80">You wake on the sand. Rho is already moving.</p>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center justify-center pb-10">
        <button
          type="button"
          onClick={props.onSkip}
          className="rounded-full border border-amber-200/40 bg-amber-950/50 px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 hover:bg-amber-900/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          Skip — wake on the beach
        </button>
      </div>
    </div>
  );
}
