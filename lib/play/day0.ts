/**
 * Day 0 setup after the cinematic. Finite boxes the captain can finish
 * in one sitting. The math box is done when the five-question check is saved.
 */

import type { FirstRunStep } from "./firstRun";
import { isFirstRunComplete, parseFirstRunStep } from "./firstRun";
import type { MissionPublic } from "./missions";
import { hasSavedMathPlacement } from "./mathPlacement";
import { PRIMER_INVITATION } from "../productIdentity";

export const CHAPTER_PROBLEM = "Food will not last. Crew is scattered.";

export const LEARNING_PURPOSE_PAGES = [
  {
    id: "purpose",
    kicker: "How Primer works",
    title: "Become your best self",
    body: PRIMER_INVITATION,
  },
  {
    id: "skills",
    kicker: "Skills for camp",
    title: "These are the skills camp needs",
    body: "We will check what you already know, then practice the next one. Rho will help. Look for the skill in plain words — not a code on every button.",
  },
] as const;

export const CAMP_SKILLS = [
  {
    id: "math",
    subject: "Math",
    skills: "Measure, calculate, and plan",
    explanation: "Work out how much food each person needs, divide supplies fairly, and plan how to spend the camp's money. Measurements and calculations help you compare routes and check a plan before you use it.",
  },
  {
    id: "english",
    subject: "English",
    skills: "Read, explain, and persuade",
    explanation: "Understand messages and instructions. Make a clear, convincing case for the Merchant Corp to send resources, or invite new people to join your crew. Listening and choosing your words well can help you resolve disagreements with rival crews.",
  },
  {
    id: "science",
    subject: "Science",
    skills: "Observe, test, and explain",
    explanation: "Investigate how phones and radios send messages, and what plants need to grow. Compare evidence, test an idea, and improve your explanation so your crew can make better plans for communication and food.",
  },
  {
    id: "social-studies",
    subject: "Social Studies & History",
    skills: "Understand people, communities, and the past",
    explanation: "History helps you understand where people and their ideas came from. Psychology asks how we think and learn; sociology asks how groups work together. These questions can help you listen to different perspectives, organize your crew, and become a thoughtful leader.",
  },
] as const;

export type Day0BoxId = "walk" | "talk" | "mathCheck" | "camp";

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
  mathPlacementCode?: string | null;
  mathPlacementStatus?: string | null;
}): Day0Box[] {
  const step = parseFirstRunStep(input.firstRunStep);
  const rank = STEP_ORDER[step];
  return [
    { id: "walk", label: "Walk to the wreck", done: rank >= STEP_ORDER.talk || isFirstRunComplete(step) },
    { id: "talk", label: "Talk with Rho", done: rank >= STEP_ORDER.work || isFirstRunComplete(step) },
    {
      id: "mathCheck",
      label: "Math check",
      done: hasSavedMathPlacement(input.mathPlacementCode, input.mathPlacementStatus),
    },
    { id: "camp", label: "Found camp", done: input.campFounded },
  ];
}

export function day0AllDone(boxes: Day0Box[]): boolean {
  return boxes.every((box) => box.done);
}

/** Show the path ahead without allowing locked activities to start. */
export function campNeedsMissions(
  missions: MissionPublic[],
  placementReady = hasSavedMathPlacement()
): MissionPublic[] {
  return [...missions].sort((a, b) => {
    const order = { available: 0, locked: 1, completed: 2 };
    return order[a.status] - order[b.status];
  });
}

export function campNeedsTitle(placementReady = hasSavedMathPlacement()): string {
  return placementReady ? "Jobs" : "Camp needs";
}
