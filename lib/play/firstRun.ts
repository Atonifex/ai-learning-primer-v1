/** First-run director after the crash video (MASTER §4.10, one verb at a time). */

export const FIRST_RUN_STEPS = [
  "video",
  "purpose",
  "name",
  "move",
  "talk",
  "work",
  "complete",
] as const;

export type FirstRunStep = (typeof FIRST_RUN_STEPS)[number];

export type FirstRunEvent =
  | "video_done"
  | "purpose_done"
  | "name_saved"
  | "walked_to_wreck"
  | "spoke_to_rho"
  | "work_done";

const ORDER: Record<FirstRunStep, number> = {
  video: 0,
  purpose: 1,
  name: 2,
  move: 3,
  talk: 4,
  work: 5,
  complete: 6,
};

export function isFirstRunStep(value: string): value is FirstRunStep {
  return (FIRST_RUN_STEPS as readonly string[]).includes(value);
}

export function parseFirstRunStep(value: unknown): FirstRunStep {
  // Older profiles can be parked on the retired naming screen. Use the account name.
  if (value === "name") return "move";
  if (typeof value === "string" && isFirstRunStep(value)) return value;
  return "video";
}

export function isFirstRunComplete(step: FirstRunStep): boolean {
  return step === "complete";
}

/** Hide extra HUD until the captain has finished the first work verb. */
export function firstRunChrome(step: FirstRunStep): {
  jobs: boolean;
  saga: boolean;
  progress: boolean;
  leave: boolean;
  radio: boolean;
  subjectBadge: boolean;
} {
  const open = isFirstRunComplete(step);
  return {
    jobs: open,
    saga: open,
    progress: open,
    leave: open,
    radio: step === "talk" || step === "work" || open,
    subjectBadge: open,
  };
}

export function firstRunCoach(step: FirstRunStep, captain: string): string | null {
  const name = captain.trim() || "Captain";
  switch (step) {
    case "move":
      return `${name}: tap the sand — walk to the wreck pile. Rho will follow.`;
    case "talk":
      return `At the wreck, tell Rho — hold the mic or type a word.`;
    case "work":
      return `Salvage what we can. Tap an answer that fits.`;
    default:
      return null;
  }
}

const EVENT_TO_STEP: Record<FirstRunEvent, FirstRunStep> = {
  video_done: "purpose",
  purpose_done: "move",
  name_saved: "move",
  walked_to_wreck: "talk",
  spoke_to_rho: "work",
  work_done: "complete",
};

/**
 * A captain stuck on the wreck tutorial after Chapter 1 should leave that tutorial.
 * video / purpose / name stay put so a deliberate replay of the opening still plays.
 */
export function reconcileFirstRunStep(
  step: FirstRunStep,
  chapterOrderIndex: number | null
): FirstRunStep {
  if (chapterOrderIndex == null || chapterOrderIndex < 1) return step;
  if (step === "move" || step === "talk" || step === "work") return "complete";
  return step;
}

/** Advance only forward. Ignore events that belong to an earlier beat. */
export function applyFirstRunEvent(
  current: FirstRunStep,
  event: FirstRunEvent
): FirstRunStep {
  const next = EVENT_TO_STEP[event];
  if (current === "purpose" && event === "purpose_done") return "move";
  if (ORDER[next] <= ORDER[current]) return current;
  if (ORDER[next] === ORDER[current] + 1) return next;
  return current;
}
