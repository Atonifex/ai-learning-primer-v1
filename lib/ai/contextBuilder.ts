import type {
  LearnerProfileData,
  MemoryItemData,
  StorySpineContext,
  StoryStateData,
} from "../types";
import {
  MAPMAKERS_WORLD_BIBLE,
  getPromptTemplate,
} from "./promptTemplates";

export interface BuiltContext {
  systemPrompt: string;
  memoryLines: string;
}

/**
 * Slice of `Chapter.plannerJson` we care about in the prompt — anchor/chapter
 * questions plus the subject-specific plan for the active session's lens.
 */
export interface CoherenceMapBlockInput {
  sharedBeat?: string;
  anchorQuestion?: string;
  chapterQuestion?: string;
  investigationQuestions?: string[];
  subjectPlan?: {
    targetStandardCodes?: string[];
    investigationQuestions?: string[];
    evidenceExperiences?: string[];
    culminatingTask?: string;
  };
}

function formatMemoryItems(items: MemoryItemData[]): string {
  if (!items.length)
    return "No prior memory yet — this may be the first session.";
  return items
    .map((m) => `- [${m.type.replace(/_/g, " ").toLowerCase()}] ${m.content}`)
    .join("\n");
}

function formatStorySpine(
  spine: StorySpineContext | null,
  previouslyOnLine: string | null
): string {
  const lines: string[] = [];
  if (!spine) {
    lines.push(
      "No structured story spine yet — fall back to the world bible above."
    );
  } else {
    lines.push(
      `Arc: ${spine.arcTitle}${spine.arcSummary ? ` — ${spine.arcSummary}` : ""}`,
      `Chapter: ${spine.chapterTitle}`,
      `Structure: Act ${spine.actCurrent} of ${spine.actTotal} · scene index ${spine.sceneIndex}`,
      spine.pathAheadWhisper
        ? `Narrative tease (whisper — foreshadow without spoiling): ${spine.pathAheadWhisper}`
        : ""
    );
  }
  if (previouslyOnLine?.trim()) {
    lines.push(
      `Previously on (recap for this learner): ${previouslyOnLine.trim()}`
    );
  }
  return lines.filter(Boolean).join("\n");
}

function formatStoryState(state: StoryStateData | null): string {
  if (!state) return "No prior story state — begin a new arc.";
  const characters =
    Array.isArray(state.recurringCharacters) &&
    state.recurringCharacters.length
      ? state.recurringCharacters
          .map((c) => `${c.name}: ${c.description}`)
          .join("; ")
      : "None established yet";
  return [
    `Arc: ${state.arcName}`,
    `Story so far: ${state.currentState}`,
    `Characters: ${characters}`,
    `Themes: ${state.activeThemes?.join(", ") || "None yet"}`,
  ].join("\n");
}

function formatLearnerBlock(profile: LearnerProfileData): string {
  const name = profile.displayName?.trim() || "(no name given)";
  return [
    `Captain (displayName): ${name}`,
    `Grade: ${profile.gradeBand}`,
    `Goals: ${profile.goals}`,
    `Interests: ${profile.interests.join(", ") || "(none yet)"}`,
  ].join("\n");
}

function formatCoherenceMapBlock(map: CoherenceMapBlockInput | null): string {
  if (!map) return "";
  const lines: string[] = ["CHAPTER COHERENCE MAP (use to scope today's beats):"];
  if (map.sharedBeat) lines.push(`- Shared beat: ${map.sharedBeat}`);
  if (map.anchorQuestion) lines.push(`- Anchor question: ${map.anchorQuestion}`);
  if (map.chapterQuestion)
    lines.push(`- Chapter question: ${map.chapterQuestion}`);
  const investigation =
    map.subjectPlan?.investigationQuestions?.length
      ? map.subjectPlan.investigationQuestions
      : map.investigationQuestions;
  if (investigation?.length) {
    lines.push(`- Investigation questions:`);
    for (const q of investigation) lines.push(`    • ${q}`);
  }
  if (map.subjectPlan?.targetStandardCodes?.length) {
    lines.push(
      `- Target standard codes for THIS lens this chapter: ${map.subjectPlan.targetStandardCodes.join(", ")}`
    );
  }
  if (map.subjectPlan?.culminatingTask) {
    lines.push(
      `- Culminating task (narrative application): ${map.subjectPlan.culminatingTask}`
    );
  }
  return lines.join("\n");
}

export interface BuildSystemPromptOpts {
  spine?: StorySpineContext | null;
  previouslyOn?: string | null;
  /** Required: the subject lens for THIS session (math_g3 / ela_g3 / etc.). */
  subjectSlug: string;
  /** Formatted output of `formatStandardsBlock` — injected verbatim. */
  standardsBlock?: string;
  coherenceMap?: CoherenceMapBlockInput | null;
}

/**
 * System prompt = shared world bible + subject lens + learner block +
 * standards block + memory block + coherence map + pedagogy instructions.
 *
 * Difficulty is NEVER a stored or asked field — the pedagogy block tells the
 * model to infer it from STRENGTH / MISCONCEPTION memory items.
 */
export function buildSystemPrompt(
  profile: LearnerProfileData,
  memoryItems: MemoryItemData[],
  storyState: StoryStateData | null,
  recentSummaries: string[],
  opts: BuildSystemPromptOpts
): string {
  const template = getPromptTemplate(opts.subjectSlug);

  const summariesBlock = recentSummaries.length
    ? recentSummaries.map((s, i) => `Session ${i + 1}: ${s}`).join("\n")
    : "No prior sessions.";

  const standardsBlock = opts.standardsBlock?.trim()
    ? opts.standardsBlock
    : "STANDARDS: (none injected — record_standard_observation should not be called this session)";

  const coherence = formatCoherenceMapBlock(opts.coherenceMap ?? null);

  const sections: string[] = [
    `You are Primer, a personal AI tutor for a Grade ${profile.gradeBand} learner. Teach through one continuous story — never as a worksheet in a costume.`,
    MAPMAKERS_WORLD_BIBLE,
    template.basePrompt,
    `LEARNER PROFILE:\n${formatLearnerBlock(profile)}`,
    standardsBlock,
    `LEARNER MEMORY (use to open the session AND calibrate difficulty — this is the only difficulty signal):\n${formatMemoryItems(
      memoryItems
    )}`,
    `STORY SPINE:\n${formatStorySpine(opts.spine ?? null, opts.previouslyOn ?? null)}`,
    `STORY STATE (last update in this chapter's thread):\n${formatStoryState(storyState)}`,
    `RECENT SESSION SUMMARIES:\n${summariesBlock}`,
    coherence,
    template.pedagogyInstructions,
    `YOU ARE RHO, the humanoid AI First Mate — loyal sidekick, never the hero, never take tests. The learner's displayName is the captain. Speak-first: invite talking (mic) or a short typed line. Grade 3 answers may be 1–5 spoken words.

TOOLS (stills-pack loop — do NOT generate scene images):
- record_standard_observation: call with a code from the STANDARDS block only. Pick evidence_tier honestly. Use correctness 0–1.
- generate_learning_activity: only AFTER the first overlay salvage quiz, when a later retrieval moment fits. Do not generate a quiz on the wreck-approach beat — the overlay card handles that.

When a [TUTORIAL BEAT] or [RHO CALL] message arrives, follow it. Keep replies under 80 words. Give the captain one specific thing to DO or DECIDE.`,
  ];

  return sections.filter((s) => s && s.trim()).join("\n\n---\n\n");
}
