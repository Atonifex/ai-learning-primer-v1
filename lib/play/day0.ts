/**
 * Day 0 setup after the cinematic. Finite boxes the captain can finish
 * in one sitting. Math-check completion currently follows wreck salvage
 * until the 5-question diagnostic persists a starting point.
 */

import type { FirstRunStep } from "./firstRun";
import { isFirstRunComplete, parseFirstRunStep } from "./firstRun";
import type { MissionPublic } from "./missions";
import { hasSavedMathPlacement } from "./mathPlacement";

export const CHAPTER_PROBLEM = "Food will not last. Crew is scattered.";

export const LEARNING_PURPOSE_PAGES = [
  {
    id: "purpose",
    kicker: "How Primer works",
    title: "This is a learning adventure",
    body: "You'll use math, reading, science, and social studies to help your crew. The first check finds a starting point. It is not a scored test. You don't need to know everything yet.",
  },
  {
    id: "skills",
    kicker: "Skills for camp",
    title: "These are the skills camp needs",
    body: "We will check what you already know, then practice the next one. Rho will help. Look for the skill in plain words — not a code on every button.",
  },
] as const;

export type Day0BoxId = "name" | "walk" | "talk" | "mathCheck" | "camp";

export type Day0Box = {
  id: Day0BoxId;
  label: string;
  done: boolean;
};

const STEP_ORDER: Record<FirstRunStep, number> = {
  video: 0,
  purpose: 1,
  name: 2,
  move: 3,
  talk: 4,
  work: 5,
  complete: 6,
};

export function day0Checklist(input: {
  firstRunStep: string;
  wreckQuizDone: boolean;
  campFounded: boolean;
}): Day0Box[] {
  const step = parseFirstRunStep(input.firstRunStep);
  const rank = STEP_ORDER[step];
  return [
    { id: "name", label: "Name the captain", done: rank >= STEP_ORDER.move || isFirstRunComplete(step) },
    { id: "walk", label: "Walk to the wreck", done: rank >= STEP_ORDER.talk || isFirstRunComplete(step) },
    { id: "talk", label: "Talk with Rho", done: rank >= STEP_ORDER.work || isFirstRunComplete(step) },
    {
      id: "mathCheck",
      label: "Math check",
      done: input.wreckQuizDone || hasSavedMathPlacement(),
    },
    { id: "camp", label: "Found camp", done: input.campFounded },
  ];
}

export function day0AllDone(boxes: Day0Box[]): boolean {
  return boxes.every((box) => box.done);
}

/** Until math placement is saved, Camp needs is wreck salvage — not four subjects. */
export function campNeedsMissions(
  missions: MissionPublic[],
  placementReady = hasSavedMathPlacement()
): MissionPublic[] {
  if (placementReady) return missions;
  return missions.filter((mission) => mission.id === "wreck-math");
}

export function campNeedsTitle(placementReady = hasSavedMathPlacement()): string {
  return placementReady ? "Jobs" : "Camp needs";
}
