import { isHiddenTurn } from "./hiddenTurns";

const SHORT_AFFIRM =
  /^(yes|yeah|yep|yup|ok|okay|sure|please|go ahead|do it|open(\s+the)?\s*camp([-\s]?math)?|open\s+camp-math)[.!]?$/i;

/**
 * Pick a crew-log note the captain already said so Rho can save it without
 * asking them to retype or speak a tool name.
 */
export function findCrewLogNoteCandidate(
  userMessage: string,
  priorMessages: { role: string; content: string }[]
): string | null {
  const tryNote = (raw: string): string | null => {
    const t = raw.trim();
    if (t.length < 12) return null;
    if (isHiddenTurn(t)) return null;
    if (SHORT_AFFIRM.test(t)) return null;
    return t;
  };

  const fromTurn = tryNote(userMessage);
  if (fromTurn) return fromTurn;

  for (let i = priorMessages.length - 1; i >= 0; i--) {
    const m = priorMessages[i];
    if (!m || m.role !== "USER") continue;
    const hit = tryNote(m.content);
    if (hit) return hit;
  }
  return null;
}

/** Wreck-quiz dismiss should open the crew log whenever it is not done yet. */
export function shouldOpenCrewLogAfterWreckQuiz(opts: {
  isWreckQuiz: boolean;
  reflectionDone: boolean;
}): boolean {
  return opts.isWreckQuiz && !opts.reflectionDone;
}
