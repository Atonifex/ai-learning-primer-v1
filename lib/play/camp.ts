/**
 * Tiny camp / crew engine (Day 0). Resources, five named slots, and four
 * visual stages. Grants are idempotent so salvage cannot double-pay.
 * Diagnostics and later dives should call applyCampGrant; they are not built here.
 */

export const CAMP_STAGES = ["clearing", "crates", "tent", "fire"] as const;
export type CampStage = (typeof CAMP_STAGES)[number];

export const CAMP_CREW = [
  { id: "mara", name: "Bosun Mara", role: "Bosun" },
  { id: "pell", name: "Cook Pell", role: "Cook" },
  { id: "idi", name: "Scout Idi", role: "Scout" },
  { id: "vey", name: "Carpenter Vey", role: "Carpenter" },
  { id: "tem", name: "Signaler Tem", role: "Signaler" },
] as const;

export type CampCrewId = (typeof CAMP_CREW)[number]["id"];
export type CampCrewStatus = "missing" | "signaled" | "found";

export type CampCrewSlot = {
  id: CampCrewId;
  name: string;
  role: string;
  status: CampCrewStatus;
};

export type CampState = {
  stage: CampStage;
  rations: number;
  scrap: number;
  timber: number;
  canvas: number;
  appliedGrantIds: string[];
  crew: CampCrewSlot[];
};

export type CampGrant = {
  id: string;
  rations?: number;
  scrap?: number;
  timber?: number;
  canvas?: number;
  minStage?: CampStage;
  signalCrewId?: CampCrewId;
  findCrewId?: CampCrewId;
};

export type CampPublic = {
  stage: CampStage;
  stageLabel: string;
  founded: boolean;
  rations: number;
  scrap: number;
  timber: number;
  canvas: number;
  crew: CampCrewSlot[];
  crewFound: number;
  crewTotal: number;
};

/** Finishing the five-question math check pitches a tent and sets one ration aside. */
export const MATH_CHECK_GRANT: CampGrant = {
  id: "math-placement",
  rations: 1,
  canvas: 1,
  minStage: "tent",
};

export const MATH_CHECK_CAMP_LINE =
  "A tent is up, and one ration is set aside. The rest of the crew is still missing.";

/** Temporary Day 0 hook: finishing wreck salvage founds a crate pile. */
export const WRECK_SALVAGE_GRANT: CampGrant = {
  id: "wreck-salvage",
  rations: 2,
  scrap: 1,
  minStage: "crates",
};

const STAGE_LABEL: Record<CampStage, string> = {
  clearing: "Clearing",
  crates: "Crate pile",
  tent: "Tent",
  fire: "Fire",
};

export function stageIndex(stage: CampStage): number {
  return CAMP_STAGES.indexOf(stage);
}

export function higherStage(current: CampStage, min?: CampStage): CampStage {
  if (!min) return current;
  return stageIndex(min) > stageIndex(current) ? min : current;
}

export function emptyCamp(): CampState {
  return {
    stage: "clearing",
    rations: 0,
    scrap: 0,
    timber: 0,
    canvas: 0,
    appliedGrantIds: [],
    crew: CAMP_CREW.map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      status: "missing",
    })),
  };
}

export function foundCrewCount(crew: CampCrewSlot[]): number {
  return crew.filter((slot) => slot.status === "found").length;
}

export function toCampPublic(state: CampState): CampPublic {
  return {
    stage: state.stage,
    stageLabel: STAGE_LABEL[state.stage],
    founded: state.stage !== "clearing",
    rations: state.rations,
    scrap: state.scrap,
    timber: state.timber,
    canvas: state.canvas,
    crew: state.crew,
    crewFound: foundCrewCount(state.crew),
    crewTotal: CAMP_CREW.length,
  };
}

function bumpCrew(crew: CampCrewSlot[], id: CampCrewId | undefined, status: CampCrewStatus): CampCrewSlot[] {
  if (!id) return crew;
  const rank: Record<CampCrewStatus, number> = { missing: 0, signaled: 1, found: 2 };
  return crew.map((slot) => {
    if (slot.id !== id) return slot;
    return rank[status] > rank[slot.status] ? { ...slot, status } : slot;
  });
}

export function applyCampGrant(state: CampState, grant: CampGrant): CampState {
  if (state.appliedGrantIds.includes(grant.id)) return state;
  return {
    stage: higherStage(state.stage, grant.minStage),
    rations: state.rations + (grant.rations ?? 0),
    scrap: state.scrap + (grant.scrap ?? 0),
    timber: state.timber + (grant.timber ?? 0),
    canvas: state.canvas + (grant.canvas ?? 0),
    appliedGrantIds: [...state.appliedGrantIds, grant.id],
    crew: bumpCrew(bumpCrew(state.crew, grant.signalCrewId, "signaled"), grant.findCrewId, "found"),
  };
}

export function parseStoredCamp(raw: {
  stage?: string;
  rations?: number;
  scrap?: number;
  timber?: number;
  canvas?: number;
  appliedGrantIds?: string[];
  crew?: unknown;
} | null): CampState {
  const base = emptyCamp();
  if (!raw) return base;
  const stage = CAMP_STAGES.includes(raw.stage as CampStage) ? (raw.stage as CampStage) : base.stage;
  const storedCrew = Array.isArray(raw.crew) ? raw.crew : [];
  const byId = new Map(
    storedCrew
      .filter((row): row is { id: string; status: string } => Boolean(row && typeof row === "object" && "id" in row))
      .map((row) => [row.id, row.status])
  );
  return {
    stage,
    rations: Math.max(0, raw.rations ?? 0),
    scrap: Math.max(0, raw.scrap ?? 0),
    timber: Math.max(0, raw.timber ?? 0),
    canvas: Math.max(0, raw.canvas ?? 0),
    appliedGrantIds: Array.isArray(raw.appliedGrantIds) ? raw.appliedGrantIds : [],
    crew: base.crew.map((slot) => {
      const status = byId.get(slot.id);
      if (status === "signaled" || status === "found" || status === "missing") {
        return { ...slot, status };
      }
      return slot;
    }),
  };
}

export function formatCampForPrompt(camp: CampPublic): string {
  const missing = camp.crew.filter((slot) => slot.status === "missing").map((slot) => slot.name);
  const signaled = camp.crew.filter((slot) => slot.status === "signaled").map((slot) => slot.name);
  const found = camp.crew.filter((slot) => slot.status === "found").map((slot) => slot.name);
  return [
    "CAMP (saved, not imagined):",
    `Stage: ${camp.stageLabel}. Rations ${camp.rations}, scrap ${camp.scrap}, timber ${camp.timber}, canvas ${camp.canvas}.`,
    `Crew found ${camp.crewFound} of ${camp.crewTotal}.${found.length ? ` Home: ${found.join(", ")}.` : ""}${signaled.length ? ` Radio ping: ${signaled.join(", ")}.` : ""}${missing.length ? ` Still missing: ${missing.join(", ")}.` : ""}`,
    "Do not invent extra buildings, found crew, or resource piles beyond this snapshot.",
    "Crew recovery is later: a radio ping is not finding Bosun Mara. Ship rebuild is later: the wreck is salvage, not a crafting tree.",
  ].join("\n");
}
