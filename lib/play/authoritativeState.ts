/**
 * Facts the live turn must trust. Memory and "Previously on" are color.
 * A job is finished only when Camp needs says so. A later chapter is open
 * only when the chapter row says so.
 */

export type AuthoritativeMission = {
  id: string;
  status: string;
  lockReason: string | null;
};

export function salvageTalkIsClosed(input: {
  chapterOrderIndex?: number | null;
  wreckQuizDone: boolean;
}): boolean {
  if (input.wreckQuizDone) return true;
  return (input.chapterOrderIndex ?? 0) >= 1;
}

export function formatAuthoritativeState(input: {
  chapterTitle?: string | null;
  chapterOrderIndex?: number | null;
  missions: AuthoritativeMission[];
}): string {
  const title = input.chapterTitle?.trim() || "No chapter row is loaded";
  const order = input.chapterOrderIndex;
  const chapterLine =
    order == null
      ? `Active chapter title: ${title}. Do not announce a later chapter.`
      : `Active chapter index ${order}: ${title}. A later chapter named in memory or Previously on is not open.`;
  const jobs = input.missions.length
    ? input.missions
        .map(
          (mission) =>
            `- ${mission.id} is ${mission.status}${mission.lockReason ? ` (${mission.lockReason})` : ""}`
        )
        .join("\n")
    : "- No camp needs were loaded.";
  const completed = input.missions
    .filter((mission) => mission.status === "completed")
    .map((mission) => mission.id);
  const doneLine = completed.length
    ? `Completed jobs: ${completed.join(", ")}.`
    : "No camp-need job is completed. If memory says a pin was earned, that claim is not saved.";
  return [
    "AUTHORITATIVE STATE (this wins over learner memory, Previously on, story summaries, and a tutorial beat):",
    chapterLine,
    doneLine,
    "Jobs:",
    jobs,
    "Do not offer a task that is not one of these jobs unless generate_learning_activity just returned success.",
    "Do not say you generated an activity unless that tool result says success.",
  ].join("\n");
}
