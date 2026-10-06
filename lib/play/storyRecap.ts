/** Generated summaries are optional. Never replace a bad recap with invented story facts. */
const INTERNAL_COPY = /\b(overlay|session|tool|bootstrap|debug|API|QA|test harness|gate|must reuse|prompting|staying on task|not open yet)\b|\b[a-z]+_(g[3-8]|log|note)\b|camp-math/i;

export function childStoryRecap(summary: string | null | undefined): string | null {
  const text = summary?.trim();
  if (!text || INTERNAL_COPY.test(text)) return null;
  return text;
}

export const STORY_RECAP_RULE = "The sessionSummary is shown to the child as Previously on. Write at most two short in-world sentences about things that actually happened and one unresolved story need. Do not mention sessions, overlays, tools, prompts, gates, standard codes, testing, staying on task, or software availability. Do not invent crew discoveries, supplies or completed work. If the transcript contains only technical testing, return an empty sessionSummary.";
