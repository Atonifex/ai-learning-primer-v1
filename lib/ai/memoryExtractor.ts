import OpenAI from "openai";
import { aiDebug, isAiDebug } from "./aiDebug";
import type { MemoryItemData, MessageData, StoryStateData } from "../types";
import { SUBJECT_DISPLAY_NAMES } from "../constants/subjects";
import { STORY_RECAP_RULE } from "../play/storyRecap";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ExtractionResult {
  memoryItems: MemoryItemData[];
  storyUpdate: StoryStateData;
  sessionSummary: string;
}

function subjectLensLabel(subjectSlug: string): string {
  return (
    SUBJECT_DISPLAY_NAMES[subjectSlug as keyof typeof SUBJECT_DISPLAY_NAMES] ??
    subjectSlug
  );
}

/**
 * Subject- and grade-aware memory extraction. The output drives both story
 * continuity (STORY_BEAT is read by every subject next session) and difficulty
 * calibration (MISCONCEPTION + STRENGTH replace any stored pace field).
 */
export async function extractSessionMemory(
  messages: MessageData[],
  opts: { subjectSlug: string; gradeBand: string },
  existingMemory: MemoryItemData[]
): Promise<ExtractionResult> {
  const transcript = messages
    .filter((m) => m.content && m.content !== "__start__")
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const existingMemoryText = existingMemory.length
    ? existingMemory.map((m) => `- [${m.type}] ${m.content}`).join("\n")
    : "None";

  const subjectLabel = subjectLensLabel(opts.subjectSlug);

  const prompt = `You are a learning analyst reviewing a Grade ${opts.gradeBand} session in the "${subjectLabel}" lens of the shared expedition arc.

EXISTING MEMORY (avoid duplicates):
${existingMemoryText}

SESSION TRANSCRIPT:
${transcript}

Extract structured information and return ONLY valid JSON with this exact shape:
{
  "memoryItems": [
    {
      "type": "MISCONCEPTION" | "STRENGTH" | "VOCABULARY_GAP" | "RECURRING_MISTAKE" | "INTEREST_SIGNAL" | "CONFIDENCE_LEVEL" | "STORY_BEAT" | "GOAL" | "PREFERENCE",
      "content": "specific, actionable, learner-facing description",
      "confidence": 0.0-1.0
    }
  ],
  "storyUpdate": {
    "arcName": "The Mapmaker's Expedition",
    "currentState": "2-3 sentence in-world summary of where the story ended (subject-agnostic — readable by any subject next session)",
    "recurringCharacters": [
      { "name": "character name", "description": "brief description", "characterKey": "optional lowercase-hyphen slug" }
    ],
    "activeThemes": ["theme1", "theme2"]
  },
  "sessionSummary": "2-3 sentence summary of what the captain practiced this session and where it leaves the story"
}

Memory type rules:
- STORY_BEAT: narrative events the captain should reconnect to next session, regardless of subject. ALWAYS include at least one if there was meaningful narrative ("Bosun Mara was found near the creek"). These are the cross-subject memory items.
- MISCONCEPTION: a clear, specific reasoning gap on a standard — what the captain got wrong and why. Tag with the subject ("Subtracts when problem implies addition") so the next subject session can see it.
- STRENGTH: a moment of confident, correct, justified reasoning. Used by the AI next session to calibrate difficulty UP.
- VOCABULARY_GAP: only for ELA/world-language sessions where a specific word blocked comprehension.
- CONFIDENCE_LEVEL: inferred or self-reported confidence; one sentence ("Hesitant about reading bar graphs").
- INTEREST_SIGNAL: an interest the captain expressed in-world ("Lit up when the story turned to navigation").
- RECURRING_MISTAKE, GOAL, PREFERENCE: only when clearly evidenced.

Other rules:
- ${STORY_RECAP_RULE}
- Only extract items clearly evidenced in the transcript. No speculation.
- Confidence reflects how certain you are based on the transcript.
- Do not duplicate items already in EXISTING MEMORY.
- Do NOT return correctness scores, mastery estimates, or skill level deltas (those go through StandardsEvidence via the record_standard_observation tool, not here).`;

  if (isAiDebug()) {
    aiDebug("memoryExtractor", "request", {
      model: "gpt-5.4-nano",
      messageCount: messages.length,
      subjectSlug: opts.subjectSlug,
      gradeBand: opts.gradeBand,
      promptChars: prompt.length,
    });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-5.4-nano",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Empty extraction response");

  const result = JSON.parse(content) as ExtractionResult;
  if (isAiDebug()) {
    aiDebug("memoryExtractor", "response", {
      memoryItems: result.memoryItems.length,
      sessionSummaryChars: result.sessionSummary?.length ?? 0,
    });
  }
  return result;
}
