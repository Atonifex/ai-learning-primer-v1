"use client";

import { useCallback, useRef, useState } from "react";
import {
  applyFirstRunEvent,
  firstRunChrome,
  firstRunCoach,
  isFirstRunComplete,
  parseFirstRunStep,
  type FirstRunEvent,
  type FirstRunStep,
} from "../../lib/play/firstRun";

export function useFirstRunTutorial(initialStep: string, captain: string) {
  const [step, setStep] = useState<FirstRunStep>(() => parseFirstRunStep(initialStep));
  const stepRef = useRef(step);
  stepRef.current = step;
  const persistQueue = useRef(Promise.resolve());

  const advance = useCallback((event: FirstRunEvent) => {
    const current = stepRef.current;
    const next = applyFirstRunEvent(current, event);
    if (next === current) return persistQueue.current;
    stepRef.current = next;
    setStep(next);
    persistQueue.current = persistQueue.current.then(async () => {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstRunEvent: event }),
      });
    });
    return persistQueue.current;
  }, []);

  return {
    step,
    advance,
    complete: isFirstRunComplete(step),
    chrome: firstRunChrome(step),
    coach: firstRunCoach(step, captain),
  };
}
