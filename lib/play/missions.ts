/**
 * Mission Loop v1 — static catalog on seeded bank slugs (§4.6 / A6).
 * Tutorial shore: wreck, Treeline garden lesson, Camp resource planning.
 * Dune/Creek removed from the tutorial map (2026-10-06).
 */

import type { PinId } from "./beachMap";
import type { Grade3SubjectSlug } from "../constants/subjects";
import { formatCampForPrompt, type CampPublic } from "./camp";
import { hasSavedMathPlacement } from "./mathPlacement";

export type MissionId = "wreck-math" | "treeline-sci" | "camp-math";

export type MissionLock = "none" | "wreck-quiz";

export type MissionRewardStub = {
  xp: number;
  rations: number;
  mapPin: string;
};

export type MissionDef = {
  id: MissionId;
  pinId: PinId;
  activitySlug: string;
  subjectSlug: Grade3SubjectSlug;
  title: string;
  theme: string;
  estimatedMinutes: number;
  rewards: MissionRewardStub;
  /** Tutorial wreck is the U4 gate; others wait on salvage. */
  lockedUntil: MissionLock;
};

export const TUTORIAL_MISSIONS: MissionDef[] = [
  {
    id: "wreck-math",
    pinId: "wreck",
    activitySlug: "g3-ma-wreck-number-forms",
    subjectSlug: "math_g3",
    title: "Wreck count in three forms",
    theme: "Salvage crate lids",
    estimatedMinutes: 8,
    rewards: { xp: 12, rations: 1, mapPin: "Wreck counted" },
    lockedUntil: "none",
  },
  {
    id: "treeline-sci",
    pinId: "treeline",
    activitySlug: "g3-sci-plants-make-food",
    subjectSlug: "science_g3",
    title: "What plants need to grow",
    theme: "Start the camp garden (Sun, air, water)",
    estimatedMinutes: 18,
    rewards: { xp: 10, rations: 1, mapPin: "Garden beds" },
    lockedUntil: "wreck-quiz",
  },
  {
    id: "camp-math",
    pinId: "camp",
    activitySlug: "g3-ma-search-grid-tens",
    subjectSlug: "math_g3",
    title: "Camp resource plan",
    theme: "Budget, rations, and build materials",
    estimatedMinutes: 18,
    rewards: { xp: 14, rations: 2, mapPin: "Camp founded" },
    lockedUntil: "wreck-quiz",
  },
];

export type MissionStatus = "locked" | "available" | "completed";

export type MissionPublic = MissionDef & {
  status: MissionStatus;
  lockReason: string | null;
};

export function missionById(id: string): MissionDef | null {
  return TUTORIAL_MISSIONS.find((m) => m.id === id) ?? null;
}

export function missionByPin(pinId: PinId): MissionDef | null {
  return TUTORIAL_MISSIONS.find((m) => m.pinId === pinId) ?? null;
}

export function missionBySlug(slug: string): MissionDef | null {
  return TUTORIAL_MISSIONS.find((m) => m.activitySlug === slug) ?? null;
}

export function resolveMissionStatus(
  mission: MissionDef,
  gates: {
    wreckQuizDone: boolean;
    chapter1ReflectionDone?: boolean;
    completedSlugs: Set<string>;
    placementReady?: boolean;
  }
): { status: MissionStatus; lockReason: string | null } {
  if (gates.completedSlugs.has(mission.activitySlug)) {
    return { status: "completed", lockReason: null };
  }
  if (mission.lockedUntil === "wreck-quiz" && !gates.wreckQuizDone) {
    return {
      status: "locked",
      lockReason: "Salvage the wreck first, Captain. The rest can wait.",
    };
  }
  const placementReady = gates.placementReady ?? hasSavedMathPlacement();
  if (!placementReady && mission.id !== "wreck-math") {
    return {
      status: "locked",
      lockReason: "Other camp needs wait until we have a math starting point.",
    };
  }
  return { status: "available", lockReason: null };
}

export function decorateMissions(gates: {
  wreckQuizDone: boolean;
  chapter1ReflectionDone?: boolean;
  completedSlugs: Set<string>;
  placementReady?: boolean;
}): MissionPublic[] {
  return TUTORIAL_MISSIONS.map((mission) => {
    const { status, lockReason } = resolveMissionStatus(mission, gates);
    return { ...mission, status, lockReason };
  });
}

export function stubXpFromMissions(missions: MissionPublic[]): number {
  return missions
    .filter((m) => m.status === "completed")
    .reduce((sum, m) => sum + m.rewards.xp, 0);
}

export function stubRationsFromMissions(missions: MissionPublic[]): number {
  const base = 3;
  return (
    base +
    missions
      .filter((m) => m.status === "completed")
      .reduce((sum, m) => sum + m.rewards.rations, 0)
  );
}

export function formatMissionsForPrompt(missions: MissionPublic[], camp?: CampPublic): string {
  const lines = missions.map((m) => {
    return `- ${m.id} [${m.status}] ${m.title} (${m.subjectSlug}, ${m.theme}, ~${m.estimatedMinutes} min)${m.lockReason ? ` — locked: ${m.lockReason}` : ""}`;
  });
  const next = missions.find((m) => m.status === "available");
  const nextLine = next
    ? `Next open job: ${next.id} at the ${next.pinId} (${next.subjectSlug}). If they ask to see jobs/tasks/the board, call show_mission_board. If they agree to start a job, call open_mission yourself — never ask them to type a tool name or keyword.`
    : "No open jobs. Call show_mission_board: its next-step button opens the short math starting check if needed, or subject choice when shore jobs are done. Never substitute repeated recall questions in chat for a usable next step.";
  return [
    `CAMP NEEDS (guide the captain; never take the quiz yourself). Call show_mission_board to open the on-screen Camp needs overlay — do not only narrate a wooden board:`,
    ...lines,
    "Resource changes come only from saved camp state. Do not promise rations, XP, map unlocks or crew discoveries for these jobs.",
    "Tutorial shore pins are wreck, treeline, and camp only (no dune or creek jobs).",
    nextLine,
    camp ? formatCampForPrompt(camp) : "",
  ]
    .filter(Boolean)
    .join("\n");
}
