import OpenAI from "openai";
import { aiDebug, isAiDebug } from "./aiDebug";
import type { MessageData, MemoryItemData, SkillUpdate, StoryStateData, Language } from "../types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ExtractionResult {
  memoryItems: MemoryItemData[];
  skillUpdates: SkillUpdate[];
  storyUpdate: StoryStateData;
  sessionSummary: string;
}

export async function extractSessionMemory(
  messages: MessageData[],
  language: Language,
  existingMemory: MemoryItemData[]
): Promise<ExtractionResult> {
  const transcript = messages
    .filter((m) => m.content && m.content !== "__start__")
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const existingMemoryText = existingMemory.length
    ? existingMemory.map((m) => `- [${m.type}] ${m.content}`).join("\n")
    : "None";

  const prompt = `You are a learning analyst reviewing a ${language === "ES" ? "Spanish" : "Chinese"} language learning session.

EXISTING MEMORY (to avoid duplicates):
${existingMemoryText}

SESSION TRANSCRIPT:
${transcript}

Extract structured information and return ONLY valid JSON with this exact shape:
{
  "memoryItems": [
    { "type": "VOCABULARY_GAP" | "RECURRING_MISTAKE" | "MISCONCEPTION" | "CONFIDENCE_SIGNAL" | "INTEREST" | "GOAL" | "PREFERENCE" | "STORY_CONTINUITY", "content": "specific, actionable description", "confidence": 0.0-1.0 }
  ],
  "skillUpdates": [
    { "skillName": "specific skill name", "language": "${language}", "estimatedLevel": 0.0-1.0, "confidence": 0.0-1.0 }
  ],
  "storyUpdate": {
    "arcName": "name of this session's story arc",
    "currentState": "2-3 sentence summary of where the story ended",
    "recurringCharacters": [{ "name": "character name", "description": "brief description" }],
    "activeThemes": ["theme1", "theme2"]
  },
  "sessionSummary": "2-3 sentence summary of what was learned and practiced in this session"
}

Rules:
- Only extract items that are clearly evidenced in the transcript
- Keep memory items specific and actionable (not vague like "needs improvement")
- Confidence should reflect how certain you are, based on transcript evidence
- Do not duplicate items that already exist in the existing memory (above)
- Include at least one STORY_CONTINUITY item if there was meaningful narrative`;

  if (isAiDebug()) {
    aiDebug("memoryExtractor", "request", {
      model: "gpt-5.4-nano",
      messageCount: messages.length,
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
      skillUpdates: result.skillUpdates.length,
      sessionSummaryChars: result.sessionSummary?.length ?? 0,
    });
  }
  return result;
}
