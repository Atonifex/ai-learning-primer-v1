"use client";

import { useCallback, useState } from "react";
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

  const advance = useCallback(async (event: FirstRunEvent) => {
    let next: FirstRunStep | null = null;
    setStep((cur) => {
      next = applyFirstRunEvent(cur, event);
      return next;
    });
    if (next) {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstRunEvent: event }),
      });
    }
  }, []);

  return {
    step,
    advance,
    complete: isFirstRunComplete(step),
    chrome: firstRunChrome(step),
    coach: firstRunCoach(step, captain),
  };
}
