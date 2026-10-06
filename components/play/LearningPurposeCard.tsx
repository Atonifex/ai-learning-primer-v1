"use client";

import { useState } from "react";
import { CAMP_SKILLS, LEARNING_PURPOSE_PAGES } from "../../lib/play/day0";

export default function LearningPurposeCard(props: { captain: string; onContinue: () => void }) {
  const [page, setPage] = useState(0);
  const [openSkill, setOpenSkill] = useState<string | null>(null);
  const current = LEARNING_PURPOSE_PAGES[page] ?? LEARNING_PURPOSE_PAGES[0];
  const last = page >= LEARNING_PURPOSE_PAGES.length - 1;

  return (
    <div
      className="h-full min-h-0 w-full overflow-y-auto bg-[#071820] px-6 text-amber-50"
      data-testid="learning-purpose-card"
    >
      <div className="mx-auto flex min-h-full max-w-xl flex-col items-center justify-center py-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-200/70">
        {current.kicker}
      </p>
      <h1 className="mt-3 max-w-lg text-center font-serif text-3xl tracking-wide md:text-4xl">
        {current.title}
      </h1>
      <p className="mt-4 max-w-md text-center text-sm leading-relaxed text-teal-100/85">
        {current.body}
      </p>
      {last && (
        <div className="mt-5 w-full space-y-2">
          <p className="mb-3 text-center text-sm text-amber-200">Captain {props.captain}</p>
          {CAMP_SKILLS.map((skill) => (
            <div key={skill.id} className="rounded-xl border border-teal-200/20 bg-teal-100/5 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">{skill.subject}</h2>
                  <p className="mt-1 text-xs text-teal-100/80">{skill.skills}</p>
                </div>
                <button
                  type="button"
                  aria-label={`How does ${skill.subject} help me and our crew?`}
                  aria-expanded={openSkill === skill.id}
                  aria-controls={`skill-help-${skill.id}`}
                  onClick={() => setOpenSkill((current) => current === skill.id ? null : skill.id)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-200/50 text-lg font-semibold text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                >?</button>
              </div>
              <div id={`skill-help-${skill.id}`} hidden={openSkill !== skill.id}>
                <p className="mt-3 text-xs font-semibold text-amber-200">How does this help me and our crew?</p>
                <p className="mt-2 text-sm leading-relaxed text-teal-100/90">{skill.explanation}</p>
              </div>
            </div>
          ))}
          <p className="pt-2 text-center text-xs leading-relaxed text-teal-100/70">
            The first check finds a starting point. It is not a scored test. You can change your captain name in Settings.
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          if (last) props.onContinue();
          else setPage((n) => n + 1);
        }}
        className="mt-8 rounded-full bg-amber-200 px-7 py-3 font-semibold text-slate-950"
      >
        {last ? "Explore the island" : "Continue"}
      </button>
      </div>
    </div>
  );
}
