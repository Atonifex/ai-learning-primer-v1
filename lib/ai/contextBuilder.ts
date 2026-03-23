import type { LearnerProfileData, MemoryItemData, StoryStateData } from "../types";

export interface BuiltContext {
  systemPrompt: string;
  memoryLines: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
  ES: "Spanish",
  ZH: "Chinese (Mandarin)",
};

const LEVEL_NAMES: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

function formatMemoryItems(items: MemoryItemData[]): string {
  if (!items.length) return "No prior memory yet — this may be the first session.";
  return items
    .map((m) => `- [${m.type.replace(/_/g, " ").toLowerCase()}] ${m.content}`)
    .join("\n");
}

function formatStoryState(state: StoryStateData | null): string {
  if (!state) return "No prior story state — begin a new arc.";
  const characters =
    Array.isArray(state.recurringCharacters) && state.recurringCharacters.length
      ? state.recurringCharacters.map((c: { name: string; description: string }) => `${c.name}: ${c.description}`).join("; ")
      : "None established yet";
  return [
    `Arc: ${state.arcName}`,
    `Story so far: ${state.currentState}`,
    `Characters: ${characters}`,
    `Themes: ${state.activeThemes?.join(", ") || "None yet"}`,
  ].join("\n");
}

export function buildSystemPrompt(
  profile: LearnerProfileData,
  memoryItems: MemoryItemData[],
  storyState: StoryStateData | null,
  recentSummaries: string[]
): string {
  const lang = LANGUAGE_NAMES[profile.activeLanguage] || profile.activeLanguage;
  const level = LEVEL_NAMES[profile.currentLevel] || profile.currentLevel;

  const langInstructions =
    profile.activeLanguage === "ZH"
      ? `For Chinese: include Pinyin alongside characters for new vocabulary (e.g., 你好 nǐ hǎo). Gradually reduce Pinyin as the learner improves.`
      : `For Spanish: use natural, conversational Spanish. Include accents correctly. Use regional-neutral Latin American Spanish unless learner specifies otherwise.`;

  const summariesBlock =
    recentSummaries.length
      ? recentSummaries.map((s, i) => `Session ${i + 1}: ${s}`).join("\n")
      : "No prior sessions.";

  return `You are Primer, a deeply personal language learning companion. You teach through immersive, story-driven experiences — not lectures, not bullet points, not worksheets.

LEARNER PROFILE:
- Learning: ${lang}
- Level: ${level}
- Goals: ${profile.goals}
- Interests: ${profile.interests.join(", ")}

WHAT YOU KNOW ABOUT THIS LEARNER:
${formatMemoryItems(memoryItems)}

CURRENT STORY STATE:
${formatStoryState(storyState)}

RECENT SESSION SUMMARIES:
${summariesBlock}

YOUR APPROACH:
- Teach through narrative, dialogue, and guided discovery
- Weave vocabulary and grammar naturally into the story — never lecture
- Correct mistakes gently, within the flow of the narrative
- Invite the learner to respond in ${lang} when appropriate
- Match difficulty to their level: ${level}
- Ask questions, create moments of choice, make learning feel like an adventure
- Maintain continuity: reference prior sessions, characters, and themes when they exist
- Be warm, curious, encouraging — feel like a trusted guide, not a chatbot

${langInstructions}

GENERATING SCENE IMAGES:
Call generate_scene_image when:
- The session opens with a new scene
- The setting changes significantly
- A visually powerful moment occurs
Do NOT call it for every message — only for meaningful visual moments.

When the learner sends "__start__", generate the opening of this session's story. Describe the scene vividly, introduce context or characters, and give the learner something engaging to respond to in ${lang}. Always call generate_scene_image for the opening scene.`;
}
