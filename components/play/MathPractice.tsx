"use client";

import { useState } from "react";
import { practiceFeedback, type MathPracticeItem } from "../../lib/play/mathPractice";

type Stage = "example" | "question" | "feedback";

export default function MathPractice(props: { item: MathPracticeItem }) {
  const [stage, setStage] = useState<Stage>("example");
  const [correct, setCorrect] = useState(false);
  const item = props.item;

  return (
    <div className="mt-3 rounded-xl border border-amber-900/20 bg-white p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-800/80">
        One idea · {item.standardCode}
      </p>
      {stage === "example" && (
        <>
          <p className="mt-2 text-xs font-medium text-stone-500">Watch this one first.</p>
          <p className="mt-1 text-sm text-stone-900">{item.example}</p>
          <button
            type="button"
            onClick={() => setStage("question")}
            className="mt-3 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-medium text-white"
          >
            I&apos;ll try the next one
          </button>
        </>
      )}
      {stage === "question" && (
        <>
          <p className="mt-2 text-sm text-stone-900">{item.prompt}</p>
          <div className="mt-2 space-y-2">
            {item.choices.map((choice, index) => (
              <button
                key={choice}
                type="button"
                onClick={() => {
                  setCorrect(index === item.correctIndex);
                  setStage("feedback");
                }}
                className="block w-full rounded-lg border border-amber-900/20 px-3 py-2 text-left text-sm text-stone-900 hover:border-amber-700"
              >
                {choice}
              </button>
            ))}
          </div>
        </>
      )}
      {stage === "feedback" && (
        <p className="mt-2 text-sm text-stone-900">{practiceFeedback(item, correct)}</p>
      )}
    </div>
  );
}
