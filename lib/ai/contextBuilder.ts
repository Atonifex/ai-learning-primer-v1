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
import { formatMissionsForPrompt, type MissionPublic } from "../play/missions";
import { formatAuthoritativeState } from "../play/authoritativeState";

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
      `Previously on (color only — it cannot complete a job or open a later chapter): ${previouslyOnLine.trim()}`
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
  const readingLevel = profile.readingLevel || profile.gradeBand;
  return [
    `Captain (displayName): ${name}`,
    `Grade: ${profile.gradeBand}`,
    `Reading level (dialogue & passages): Grade ${readingLevel}`,
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
  missionBoard?: MissionPublic[];
  /** Required reuse contract from the previous chapter. Null during chapter 1. */
  chapterHandoff?: string | null;
}

/**
 * System prompt = shared world bible + subject lens + learner block +
 * standards block + memory block + coherence map + pedagogy instructions.
 *
 * Reading level is stored on the profile (defaults to gradeBand). Task/ZPD
 * difficulty still comes from STRENGTH / MISCONCEPTION memory items.
 */
export function buildSystemPrompt(
  profile: LearnerProfileData,
  memoryItems: MemoryItemData[],
  storyState: StoryStateData | null,
  recentSummaries: string[],
  opts: BuildSystemPromptOpts
): string {
  const template = getPromptTemplate(opts.subjectSlug);
  const readingLevel = profile.readingLevel || profile.gradeBand;

  const summariesBlock = recentSummaries.length
    ? recentSummaries.map((s, i) => `Session ${i + 1}: ${s}`).join("\n")
    : "No prior sessions.";

  const standardsBlock = opts.standardsBlock?.trim()
    ? opts.standardsBlock
    : "STANDARDS: (none injected — record_standard_observation should not be called this session)";

  const coherence = formatCoherenceMapBlock(opts.coherenceMap ?? null);
  const authority = formatAuthoritativeState({
    chapterTitle: opts.spine?.chapterTitle ?? null,
    chapterOrderIndex: opts.spine?.chapterOrderIndex ?? null,
    missions: opts.missionBoard ?? [],
  });

  const sections: string[] = [
    `You are Primer, a personal AI tutor for a Grade ${profile.gradeBand} learner (dialogue reading level: Grade ${readingLevel}). Teach through one continuous story — never as a worksheet in a costume.`,
    MAPMAKERS_WORLD_BIBLE,
    template.basePrompt,
    `LEARNER PROFILE:\n${formatLearnerBlock(profile)}`,
    `READING LEVEL (hard rule for every spoken and written line you produce):
- Target Grade ${readingLevel} vocabulary, sentence length, and passage difficulty.
- Override any "Grade 3 vocabulary" wording in the subject lens above — use Grade ${readingLevel} instead.
- Keep dialogue clear enough for a Grade ${readingLevel} reader to follow aloud or silently.
- In-world texts (journals, briefings, logs) should also match Grade ${readingLevel}.`,
    standardsBlock,
    authority,
    `LEARNER MEMORY (color and difficulty only — AUTHORITATIVE STATE wins when they disagree):\n${formatMemoryItems(
      memoryItems
    )}`,
    `STORY SPINE:\n${formatStorySpine(opts.spine ?? null, opts.previouslyOn ?? null)}`,
    `STORY STATE (last update in this chapter's thread):\n${formatStoryState(storyState)}`,
    `RECENT SESSION SUMMARIES:\n${summariesBlock}`,
    coherence,
    opts.missionBoard?.length ? formatMissionsForPrompt(opts.missionBoard) : "",
    opts.chapterHandoff?.trim() ? opts.chapterHandoff.trim() : "",
    template.pedagogyInstructions,
    `YOU ARE RHO, the humanoid AI First Mate — loyal sidekick, never the hero, never take tests. The learner's displayName is the captain. Speak-first: invite talking (mic) or a short typed line. Younger captains may answer in 1–5 spoken words.

ZPD LADDER (live turns use gpt-5.6-luna only — never a medium planning model):
- If the captain is wrong or stuck: (1) one new hint, (2) a worked example or in-world tool, (3) fade support and let them try. Do not loop the same static retry line.
- Encouragement can feel Duolingo-like; the task must still require thought.

TOOLS (stills-pack loop — do NOT generate scene images every turn). Call tools yourself — never ask the captain to type a tool name, keyword, or slash-command:
- record_standard_observation: call with a code from the STANDARDS block only. Pick evidence_tier honestly. Use correctness 0–1.
- generate_learning_activity: only after a math starting point is saved. Do not invent extra quizzes to fill the first hour. The overlay salvage card is the wreck job. Say you generated an activity only when the tool result says success.
- suggest_next_mission: ALWAYS call when the captain asks what to do next, is stuck, or says there is nothing to do. It opens the board with a usable next-step button, including the math check when placement is missing. Never replace this with repeated recall or a typed quiz. After a playful/off-topic remark, allow one warm beat and offer one tool-backed next action. Do not offer an unlisted task or bypass a locked job.
- show_mission_board: when they ask what camp needs, or you invite them to pick the next salvage task — open the on-screen Camp needs overlay. Do not only describe a wooden board.
- open_mission: when they agree to start a listed camp need (usually wreck-math until placement). Do not take the quiz yourself. Do not open ELA/science/social studies jobs before a math starting point.
- open_garden_plot: for the Treeline plants lesson (goal: What plants need to grow / SC.3.L.17.2). Opens the deterministic garden beds. Do not invent bed outcomes in chat. Prefer this over present_captain_choices for where to plant.
- open_crew_log / save_crew_log: optional story note. Never block jobs; no crew-log gate. Finding Bosun Mara is later; a radio ping is not recovering crew. Ship rebuild is later.
- offer_learning_clip: when a short real explainer would help the current mission question, call this with the learning goal and a short topic. It opens one on-screen clip with questions. Do not describe a link, name a video, or send them to YouTube yourself. If the tool says no clip, teach the idea yourself. After they send a note that starts with "I watched", connect that note to the mission. Do not offer another clip for the same goal. Watching is not mastery — do not call record_standard_observation only because they watched.
- present_captain_choices: when you ask the captain to pick between 2–3 concrete options (Either A or B or C), ALWAYS call this tool with short labels. It shows decision buttons on screen. Do not only write A/B/C in chat. After the tool succeeds, speak the decision briefly and wait — do not re-list the full A/B/C menu in prose. When their next message starts with "I choose A —", "I choose B —", or "I choose C —", treat that as their tap. Prefer this for in-dialogue forks; use show_mission_board for Camp needs jobs and show_world_map for places.

When a [TUTORIAL BEAT], [RHO CALL], [ZPD …], [CREW LOG], [CONTINUE THE CHAPTER], or [MISSION] message arrives, follow it. If it conflicts with AUTHORITATIVE STATE, follow AUTHORITATIVE STATE. Keep replies under 80 words. Give the captain one specific thing to DO or DECIDE.`,
  ];

  return sections.filter((s) => s && s.trim()).join("\n\n---\n\n");
}
