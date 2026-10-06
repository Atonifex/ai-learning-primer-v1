export function ledgerLabel(label: string, kind: string): string {
  if (label === "crew_log") return "Note to carry forward";
  if (label === "missing_engineer" || kind === "OPEN_THREAD") return "Open mystery";
  if (label.startsWith("map_note:")) {
    const places: Record<string, string> = { wreck: "Wreck", camp: "Camp", treeline: "Treeline" };
    return `Map note${places[label.slice(9)] ? ` · ${places[label.slice(9)]}` : ""}`;
  }
  return kind === "DECISION" ? "Captain's decision" : "Story note";
}

export function evidenceLabel(tier: string, source: string): string {
  const tiers: Record<string, string> = { GUIDED: "With support", CONVERSATIONAL: "Discussed with Rho", CHECKPOINT: "Checkpoint" };
  const sources: Record<string, string> = { ASSESSMENT: "Starting check", ACTIVITY: "Learning activity", CONVERSATIONAL: "Conversation" };
  return `${tiers[tier] ?? "Learning evidence"} · ${sources[source] ?? "Recorded observation"}`;
}

export function observationNote(notes: string | null): string | null {
  if (!notes) return null;
  if (/^(math-five:|subject-check:|Overlay quiz )/.test(notes)) return null;
  return notes;
}

export const CURRICULUM_COVERAGE = "This beta has Grade 3 and Grade 4 standards. Shore activities and starting checks currently use Grade 3 skills. Grades 5–8 curriculum is not available yet; this is not a placement into a lower school grade.";

export const EVIDENCE_EXPLANATION = "These are practice estimates from recorded work, not grades or a diagnosis. Examples and hints count as support. Skills with no observations have not been assessed.";
export function masteryEstimate(mastery: number, evidenceCount: number) {
  return evidenceCount === 0 ? "Not observed" : `${Math.round(mastery)}/100 estimate`;
}
