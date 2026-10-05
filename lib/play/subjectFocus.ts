import {
  coreSubjectSlugsForGrade,
  SUBJECT_DISPLAY_NAMES,
  type PlayableCoreSubjectSlug,
} from "../constants/subjects";
import {
  isFirstRunComplete,
  parseFirstRunStep,
} from "./firstRun";
import { hasSavedMathPlacement } from "./mathPlacement";

export type SubjectChoice = {
  slug: PlayableCoreSubjectSlug;
  label: string;
};

export type FocusStandardRow = {
  code: string;
  description: string;
  evidenceCount: number;
  strandName: string;
};

export type SwitchDecision =
  | { action: "choose"; slug: string }
  | { action: "stay"; slug: string }
  | { action: "confirm"; from: string; to: string; prompt: string };

export function subjectChoicesForGrade(gradeBand: string): SubjectChoice[] {
  return coreSubjectSlugsForGrade(gradeBand).map((slug) => ({
    slug,
    label: SUBJECT_DISPLAY_NAMES[slug],
  }));
}

export function choiceLabel(slug: string): string {
  if (slug in SUBJECT_DISPLAY_NAMES) {
    return SUBJECT_DISPLAY_NAMES[slug as PlayableCoreSubjectSlug];
  }
  return slug;
}

export function isChoiceForGrade(slug: string, gradeBand: string): boolean {
  return subjectChoicesForGrade(gradeBand).some((choice) => choice.slug === slug);
}

/**
 * The first pick of a sitting is the choice. A later different subject
 * waits for an explicit yes.
 */
export function decideSubjectSwitch(input: {
  sittingSubject: string | null;
  requested: string;
  confirmed: boolean;
}): SwitchDecision {
  const sitting = input.sittingSubject?.trim() || null;
  if (!sitting || sitting === input.requested) {
    return sitting === input.requested
      ? { action: "stay", slug: input.requested }
      : { action: "choose", slug: input.requested };
  }
  if (!input.confirmed) {
    return {
      action: "confirm",
      from: sitting,
      to: input.requested,
      prompt: `Leave ${choiceLabel(sitting)} for ${choiceLabel(input.requested)}? This changes today's subject on purpose.`,
    };
  }
  return { action: "choose", slug: input.requested };
}

export function focusProgressSummary(rows: { evidenceCount: number }[]): {
  observed: number;
  total: number;
  line: string;
} {
  const total = rows.length;
  const observed = rows.filter((row) => row.evidenceCount > 0).length;
  const line =
    total === 0
      ? "No standards are in this subject yet."
      : `${observed} of ${total} standards seen`;
  return { observed, total, line };
}

export function flattenFocusStandards(
  strands: {
    name: string;
    groups: {
      standards: { code: string; description: string; evidenceCount: number }[];
    }[];
  }[]
): FocusStandardRow[] {
  return strands.flatMap((strand) =>
    strand.groups.flatMap((group) =>
      group.standards.map((standard) => ({
        code: standard.code,
        description: standard.description,
        evidenceCount: standard.evidenceCount,
        strandName: strand.name,
      }))
    )
  );
}

export function shouldOpenSubjectFocus(input: {
  firstRunStep: string;
  dialogueQuery: boolean;
  boardQuery: boolean;
  missionQuery: boolean;
  clipQuery?: boolean;
  placementReady?: boolean;
}): boolean {
  if (!isFirstRunComplete(parseFirstRunStep(input.firstRunStep))) return false;
  if (!(input.placementReady ?? hasSavedMathPlacement())) return false;
  if (input.dialogueQuery || input.boardQuery || input.missionQuery || input.clipQuery) {
    return false;
  }
  return true;
}
