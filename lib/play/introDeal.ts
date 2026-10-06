export type IntroShare = 10 | 15 | 20;
export type IntroPhase = "briefing" | "offer10" | "counter15" | "offer15" | "counter20" | "offer20" | "continuation" | "complete";
export type IntroEvent = "ended" | "yes" | "no";
export type IntroDeal = { version: 3; phase: IntroPhase; acceptedShare: IntroShare | null };
export const EMPTY_INTRO_DEAL: IntroDeal = { version: 3, phase: "briefing", acceptedShare: null };
const PHASES = new Set<IntroPhase>(["briefing", "offer10", "counter15", "offer15", "counter20", "offer20", "continuation", "complete"]);
export function parseIntroDeal(value: unknown): IntroDeal {
  if (!value || typeof value !== "object") return { ...EMPTY_INTRO_DEAL };
  const item = value as Partial<IntroDeal>;
  if (item.version !== 3 || !PHASES.has(item.phase as IntroPhase)) return { ...EMPTY_INTRO_DEAL };
  const share = item.acceptedShare;
  if (share !== null && share !== 10 && share !== 15 && share !== 20) return { ...EMPTY_INTRO_DEAL };
  if ((item.phase === "continuation" || item.phase === "complete") !== (share !== null)) return { ...EMPTY_INTRO_DEAL };
  return { version: 3, phase: item.phase!, acceptedShare: share };
}
export function introChoices(phase: IntroPhase): readonly ("yes" | "no")[] {
  if (phase === "offer20") return ["yes"];
  if (phase === "offer10" || phase === "offer15") return ["yes", "no"];
  return [];
}
export function introOffer(phase: IntroPhase): IntroShare {
  return phase === "offer20" || phase === "counter20" ? 20 : phase === "offer15" || phase === "counter15" ? 15 : 10;
}
export function advanceIntroDeal(state: IntroDeal, event: IntroEvent): IntroDeal {
  const next = { ...state };
  if (event === "ended") {
    if (state.phase === "briefing") next.phase = "offer10";
    if (state.phase === "counter15") next.phase = "offer15";
    if (state.phase === "counter20") next.phase = "offer20";
    if (state.phase === "continuation") next.phase = "complete";
  } else if (introChoices(state.phase).includes(event)) {
    if (event === "yes") { next.acceptedShare = introOffer(state.phase); next.phase = "continuation"; }
    else next.phase = state.phase === "offer10" ? "counter15" : "counter20";
  }
  return next;
}
export const INTRO_MEDIA_ROOT = "/cinematics/prologue-v5";
export function introMedia(phase: IntroPhase) {
  const id = phase === "briefing" ? "briefing" : phase === "counter15" ? "offer15" : phase === "counter20" ? "offer20" : phase === "continuation" ? "continuation" : "waiting-loop";
  return { id, src: `${INTRO_MEDIA_ROOT}/${id}.mp4`, captions: `${INTRO_MEDIA_ROOT}/${id}.en.vtt`, poster: `${INTRO_MEDIA_ROOT}/references/${phase === "continuation" ? "accepted-thumb" : "briefing-anchor"}.png`, loop: phase.startsWith("offer") };
}
