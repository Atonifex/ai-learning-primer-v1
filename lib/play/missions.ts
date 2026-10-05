/**
 * Mission Loop v1 — static catalog on seeded bank slugs (§4.6 / A6).
 * Not per-student LLM authoring. Pins + HUD board share this list.
 */

import type { PinId } from "./beachMap";
import type { Grade3SubjectSlug } from "../constants/subjects";

export type MissionId =
  | "wreck-math"
  | "dune-ela"
  | "treeline-sci"
  | "creek-ss"
  | "camp-math";

export type MissionLock = "none" | "wreck-quiz" | "ch1-reflection";

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
  /** Tutorial wreck is the U4 gate; others wait on salvage or Ch1 log. */
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
    id: "dune-ela",
    pinId: "dune",
    activitySlug: "g3-ela-context-clues-bulletin",
    subjectSlug: "ela_g3",
    title: "Storm words in context",
    theme: "Torn bulletin on the dune",
    estimatedMinutes: 8,
    rewards: { xp: 10, rations: 1, mapPin: "Dune marked" },
    lockedUntil: "wreck-quiz",
  },
  {
    id: "treeline-sci",
    pinId: "treeline",
    activitySlug: "g3-sci-plants-make-food",
    subjectSlug: "science_g3",
    title: "What plants use to make food",
    theme: "Green shoots at the treeline",
    estimatedMinutes: 7,
    rewards: { xp: 10, rations: 1, mapPin: "Treeline marked" },
    lockedUntil: "wreck-quiz",
  },
  {
    id: "creek-ss",
    pinId: "creek",
    activitySlug: "g3-ss-social-science-terms",
    subjectSlug: "social_studies_g3",
    title: "Name the social-science jobs",
    theme: "First-night jobs at the creek",
    estimatedMinutes: 8,
    rewards: { xp: 10, rations: 1, mapPin: "Creek marked" },
    lockedUntil: "wreck-quiz",
  },
  {
    id: "camp-math",
    pinId: "camp",
    activitySlug: "g3-ma-search-grid-tens",
    subjectSlug: "math_g3",
    title: "Paces of tens and hundreds",
    theme: "Search-grid from camp",
    estimatedMinutes: 8,
    rewards: { xp: 14, rations: 2, mapPin: "Camp founded" },
    lockedUntil: "ch1-reflection",
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
  gates: { wreckQuizDone: boolean; chapter1ReflectionDone: boolean; completedSlugs: Set<string> }
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
  if (mission.lockedUntil === "ch1-reflection" && !gates.chapter1ReflectionDone) {
    return {
      status: "locked",
      lockReason: "Leave a crew-log note after the wreck, then camp work opens.",
    };
  }
  return { status: "available", lockReason: null };
}

export function decorateMissions(gates: {
  wreckQuizDone: boolean;
  chapter1ReflectionDone: boolean;
  completedSlugs: Set<string>;
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

export function formatMissionsForPrompt(missions: MissionPublic[]): string {
  const lines = missions.map((m) => {
    const reward = `${m.rewards.xp} XP, ${m.rewards.rations} ration, pin: ${m.rewards.mapPin}`;
    return `- ${m.id} [${m.status}] ${m.title} (${m.subjectSlug}, ${m.theme}, ~${m.estimatedMinutes} min, ${reward})${m.lockReason ? ` — locked: ${m.lockReason}` : ""}`;
  });
  const next = missions.find((m) => m.status === "available");
  const campLocked = missions.find(
    (m) => m.id === "camp-math" && m.status === "locked" && m.lockedUntil === "ch1-reflection"
  );
  const nextLine = next
    ? `Next open job: ${next.id} at the ${next.pinId} (${next.subjectSlug}). If they ask to see jobs/tasks/the board, call show_mission_board. If they agree to start a job, call open_mission yourself — never ask them to type a tool name or keyword.`
    : "No open jobs — praise completed work and invite a recap.";
  const crewLine = campLocked
    ? "Camp-math is locked on the crew log. If the captain already wrote a note in chat, call save_crew_log with that note. If not, call open_crew_log. Do not collect the note only in dialogue without saving."
    : null;
  return [
    `MISSION BOARD (guide the captain; never take the quiz yourself). Call show_mission_board to open the on-screen Jobs overlay — do not only narrate a wooden board:`,
    ...lines,
    nextLine,
    ...(crewLine ? [crewLine] : []),
  ].join("\n");
}
