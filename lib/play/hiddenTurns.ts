/**
 * Hidden tutorial beats sent to luna without appearing as the child's chat.
 * Matching `__start__` (already unsaved on the server).
 */

export const HIDDEN_TURN = {
  start: "__start__",
  wreckApproach: "__wreck_approach__",
  rhoCall: "__rho_call__",
  rhoWander: "__rho_wander__",
  quizResultPrefix: "__quiz_result__",
} as const;

const HIDDEN_EXACT = new Set<string>([
  HIDDEN_TURN.start,
  HIDDEN_TURN.wreckApproach,
  HIDDEN_TURN.rhoCall,
  HIDDEN_TURN.rhoWander,
]);

export function isHiddenTurn(content: string): boolean {
  if (HIDDEN_EXACT.has(content)) return true;
  return content.startsWith(HIDDEN_TURN.quizResultPrefix);
}

export function expandHiddenTurn(
  content: string,
  displayName: string
): string {
  const captain = displayName.trim() || "Captain";
  if (content === HIDDEN_TURN.start || content === HIDDEN_TURN.wreckApproach) {
    return `[TUTORIAL BEAT U4] ${captain} just walked up to the wreck pile. You are Rho, the humanoid AI First Mate — never the hero. Greet ${captain} by name. Invite them to speak (the mic) or type a little. Ask one short question about the salvage. Do not generate a quiz or a scene image. Under 80 words.`;
  }
  if (content === HIDDEN_TURN.rhoCall) {
    return `[RHO CALL] ${captain} radioed you. Answer as Rho, First Mate. Brief. If salvage is unfinished, point them back to the wreck. Never take the test or the hero role.`;
  }
  if (content === HIDDEN_TURN.rhoWander) {
    return `[GENTLE GATE] ${captain} walked away from the wreck before talking. Call them — warm, not a fail state — and invite them back to the wreck. Under 50 words.`;
  }
  if (content.startsWith(HIDDEN_TURN.quizResultPrefix)) {
    const payload = content.slice(HIDDEN_TURN.quizResultPrefix.length).trim();
    return `[OVERLAY QUIZ RESULT] ${payload} You are Rho. If they missed items, give ONE ZPD hint or a worked example (not the same static retry). If they succeeded, praise specifically and remind them they are the captain. Under 80 words. Do not generate a new quiz or scene image.`;
  }
  return content;
}
