/**
 * Hidden tutorial beats sent to luna without appearing as the child's chat.
 * Matching `__start__` (already unsaved on the server).
 */

export const HIDDEN_TURN = {
  start: "__start__",
  wreckApproach: "__wreck_approach__",
  rhoCall: "__rho_call__",
  subjectCheckReview: "__subject_check_review__",
  rhoWander: "__rho_wander__",
  quizResultPrefix: "__quiz_result__",
  zpdHintPrefix: "__zpd_hint__",
  zpdExamplePrefix: "__zpd_example__",
  zpdFadePrefix: "__zpd_fade__",
  reflectionPrefix: "__reflection__",
  missionStartPrefix: "__mission_start__",
} as const;

const HIDDEN_EXACT = new Set<string>([
  HIDDEN_TURN.start,
  HIDDEN_TURN.wreckApproach,
  HIDDEN_TURN.rhoCall,
  HIDDEN_TURN.subjectCheckReview,
  HIDDEN_TURN.rhoWander,
]);

export function isHiddenTurn(content: string): boolean {
  if (HIDDEN_EXACT.has(content)) return true;
  return (
    content.startsWith(HIDDEN_TURN.quizResultPrefix) ||
    content.startsWith(HIDDEN_TURN.zpdHintPrefix) ||
    content.startsWith(HIDDEN_TURN.zpdExamplePrefix) ||
    content.startsWith(HIDDEN_TURN.zpdFadePrefix) ||
    content.startsWith(HIDDEN_TURN.reflectionPrefix) ||
    content.startsWith(HIDDEN_TURN.missionStartPrefix)
  );
}

export type HiddenTurnContext = {
  /** Chapter 1 is already closed, or the wreck quiz is saved. */
  salvageClosed?: boolean;
  chapterTitle?: string | null;
};

function continueChapter(captain: string, chapterTitle: string | null | undefined): string {
  const chapter = chapterTitle?.trim() || "the active chapter";
  return `[CONTINUE THE CHAPTER] ${captain} opened talk during ${chapter}. Do not restart the wreck and do not ask what to count. Do not invent a measurement, a search party, or a new activity. CAMP NEEDS is the only task list. A job is finished only when that list says completed. If they ask what is next, name the open row or call show_mission_board. Under 80 words.`;
}

export function expandHiddenTurn(
  content: string,
  displayName: string,
  ctx?: HiddenTurnContext
): string {
  const captain = displayName.trim() || "Captain";
  if (content === HIDDEN_TURN.subjectCheckReview) {
    return `[SUBJECT CHECK REVIEW] ${captain} chose Talk it through with Rho. Use the SAVED SUBJECT STARTER block for this session's subject. Do not restart the wreck, repeat the check, or send the captain back to the board. If the saved check needs support, give one small worked example for the saved practice focus and invite a short spoken or typed explanation. If the sample is complete, invite them to explain one idea in their own words. If no saved check is available, say so and offer Focus to restore it; do not invent a result. This is supported discussion, not independent mastery. Under 60 words.`;
  }
  if (content === HIDDEN_TURN.start || content === HIDDEN_TURN.wreckApproach) {
    if (ctx?.salvageClosed) return continueChapter(captain, ctx.chapterTitle);
    return `[TUTORIAL BEAT U4] ${captain} just walked up to the wreck pile. You are Rho, the humanoid AI First Mate — never the hero. Greet ${captain} by name. Invite them to speak (the mic) or type a little. Ask one short question about the salvage. Do not generate a quiz or a scene image. Under 80 words.`;
  }
  if (content === HIDDEN_TURN.rhoCall) {
    if (ctx?.salvageClosed) return continueChapter(captain, ctx.chapterTitle);
    return `[RHO CALL] ${captain} radioed you. Answer as Rho, First Mate. Brief. If salvage is unfinished, point them back to the wreck. If salvage is done, name the next open mission pin (dune / treeline / creek / camp) or call suggest_next_mission. Never take the test or the hero role.`;
  }
  if (content === HIDDEN_TURN.rhoWander) {
    return `[GENTLE GATE] ${captain} walked away from the wreck before talking. Call them — warm, not a fail state — and invite them back to the wreck. Under 50 words.`;
  }
  if (content.startsWith(HIDDEN_TURN.quizResultPrefix)) {
    const payload = content.slice(HIDDEN_TURN.quizResultPrefix.length).trim();
    return `[OVERLAY QUIZ RESULT] ${payload} You are Rho. If they missed items, do NOT loop the same static retry. Start the ZPD ladder: one short hint, then wait. If they succeeded, praise specifically and remind them they are the captain. Under 80 words. Do not generate a new quiz or scene image.`;
  }
  if (content.startsWith(HIDDEN_TURN.zpdHintPrefix)) {
    const payload = content.slice(HIDDEN_TURN.zpdHintPrefix.length).trim();
    return `[ZPD HINT] ${payload} You are Rho. Give ONE new hint in-world (a crate lid, place value). Do not repeat a previous line. Do not give the full answer. Under 50 words. Live model only — no plan rewrite.`;
  }
  if (content.startsWith(HIDDEN_TURN.zpdExamplePrefix)) {
    const payload = content.slice(HIDDEN_TURN.zpdExamplePrefix.length).trim();
    return `[ZPD WORKED EXAMPLE] ${payload} You are Rho. Walk one crate as a worked example (standard / expanded / word form). Then hand the next crate back to ${captain}. Under 80 words.`;
  }
  if (content.startsWith(HIDDEN_TURN.zpdFadePrefix)) {
    const payload = content.slice(HIDDEN_TURN.zpdFadePrefix.length).trim();
    return `[ZPD FADE] ${payload} You are Rho. Fade support: ask ${captain} to try the smaller crate themselves. Encourage; do not solve it. Under 50 words.`;
  }
  if (content.startsWith(HIDDEN_TURN.reflectionPrefix)) {
    const payload = content.slice(HIDDEN_TURN.reflectionPrefix.length).trim();
    return `[CREW LOG] ${captain} left a note for the missing engineer: ${payload || "(short note)"}. If CHAPTER HANDOFF is in your instructions, quote or paraphrase that note in this reply. Do not restart the wreck. Thank them in-world. Do not grade like a worksheet. Mention the next chapter uses this note. Under 60 words.`;
  }
  if (content.startsWith(HIDDEN_TURN.missionStartPrefix)) {
    const payload = content.slice(HIDDEN_TURN.missionStartPrefix.length).trim();
    return `[MISSION START] ${captain} started this job: ${payload || "a pin job"}. You are Rho. Stay in this subject lens. Invite them to the overlay (talk or tap). Do not generate a new quiz. Under 60 words.`;
  }
  return content;
}
