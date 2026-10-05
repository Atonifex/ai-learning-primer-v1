"use client";

import { useState } from "react";
import { LEARNING_PURPOSE_PAGES } from "../../lib/play/day0";

export default function LearningPurposeCard(props: { onContinue: () => void }) {
  const [page, setPage] = useState(0);
  const current = LEARNING_PURPOSE_PAGES[page] ?? LEARNING_PURPOSE_PAGES[0];
  const last = page >= LEARNING_PURPOSE_PAGES.length - 1;

  return (
    <div
      className="flex h-full min-h-0 w-full flex-col items-center justify-center bg-[#071820] px-6 text-amber-50"
      data-testid="learning-purpose-card"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-200/70">
        {current.kicker}
      </p>
      <h1 className="mt-3 max-w-lg text-center font-serif text-3xl tracking-wide md:text-4xl">
        {current.title}
      </h1>
      <p className="mt-4 max-w-md text-center text-sm leading-relaxed text-teal-100/85">
        {current.body}
      </p>
      <button
        type="button"
        onClick={() => {
          if (last) props.onContinue();
          else setPage((n) => n + 1);
        }}
        className="mt-8 rounded-full bg-amber-200 px-7 py-3 font-semibold text-slate-950"
      >
        {last ? "Name the captain" : "Continue"}
      </button>
    </div>
  );
}
