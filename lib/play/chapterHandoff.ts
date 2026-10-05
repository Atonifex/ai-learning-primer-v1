/**
 * Pure chapter-handoff text. Persistence lives in lib/services/worldLedger.ts.
 * A handoff is a contract: the next chapter must reuse the listed artifacts.
 */

export type LedgerFactKind = "ARTIFACT" | "DECISION" | "OPEN_THREAD";

export type LedgerFact = {
  kind: LedgerFactKind;
  label: string;
  text: string;
  standardCodes: string[];
  mustReuse: boolean;
};

export const MISSING_ENGINEER_THREAD =
  "The engineer is still missing.";

export function ch1CrewLogFacts(input: {
  note: string;
  standardCodes: string[];
}): LedgerFact[] {
  return [
    {
      kind: "ARTIFACT",
      label: "crew_log",
      text: input.note.trim(),
      standardCodes: input.standardCodes,
      mustReuse: true,
    },
    {
      kind: "OPEN_THREAD",
      label: "missing_engineer",
      text: MISSING_ENGINEER_THREAD,
      standardCodes: [],
      mustReuse: true,
    },
  ];
}

export function buildHandoffSummary(input: {
  completedChapterTitle: string;
  nextChapterTitle: string | null;
  facts: LedgerFact[];
}): string {
  const note = input.facts.find((fact) => fact.label === "crew_log");
  const next = input.nextChapterTitle ?? "the next chapter";
  const standards = note?.standardCodes.length
    ? ` Standards on the note: ${note.standardCodes.join(", ")}.`
    : "";
  const quoted = note?.text ? ` "${note.text}"` : "";
  return `Closed ${input.completedChapterTitle}. The captain left this note for the engineer:${quoted}.${standards} Must reuse that note in ${next}. Do not restart the wreck. Open thread: ${MISSING_ENGINEER_THREAD}`;
}

export function formatChapterHandoffBlock(input: {
  fromChapterTitle: string;
  summary: string;
  mustReuse: LedgerFact[];
}): string {
  const lines = [
    "CHAPTER HANDOFF (required — this chapter starts from the captain's earlier work):",
    `From: ${input.fromChapterTitle}`,
    input.summary.trim(),
    "",
    "MUST REUSE before any new task. Quote or paraphrase each line. A reply that ignores them fails the turn:",
  ];
  for (const fact of input.mustReuse) {
    lines.push(`- [${fact.label}] ${fact.text}`);
  }
  lines.push(
    "",
    "Do not restart the wreck. Do not ask the captain to introduce themselves again."
  );
  return lines.join("\n");
}

/** True when the system prompt actually carries the artifact, not just a chapter title. */
export function handoffInstructionsAreBinding(
  prompt: string,
  artifactText: string
): boolean {
  const note = artifactText.trim();
  return (
    prompt.includes("CHAPTER HANDOFF") &&
    prompt.includes("MUST REUSE") &&
    prompt.includes("Do not restart the wreck") &&
    note.length >= 2 &&
    prompt.includes(note)
  );
}
