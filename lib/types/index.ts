export type Language = "ES" | "ZH";
export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type MessageRole = "USER" | "ASSISTANT";
export type SessionStatus = "ACTIVE" | "COMPLETED" | "ABANDONED";
export type MemoryType =
  | "VOCABULARY_GAP"
  | "RECURRING_MISTAKE"
  | "MISCONCEPTION"
  | "CONFIDENCE_SIGNAL"
  | "INTEREST"
  | "GOAL"
  | "PREFERENCE"
  | "STORY_CONTINUITY";

export interface MessageData {
  id: string;
  role: MessageRole;
  content: string;
  imageUrl?: string | null;
  imagePrompt?: string | null;
  /** Supabase Storage path when uploaded (bucket-relative). */
  imageStoragePath?: string | null;
  orderIndex: number;
  createdAt: Date;
}

export interface SessionData {
  id: string;
  language: Language;
  status: SessionStatus;
  arcName?: string | null;
  startedAt: Date;
  messages: MessageData[];
}

export interface LearnerProfileData {
  id: string;
  activeLanguage: Language;
  currentLevel: Level;
  goals: string;
  interests: string[];
}

export interface MemoryItemData {
  type: MemoryType;
  content: string;
  confidence: number;
}

export interface SkillUpdate {
  skillName: string;
  language: Language;
  estimatedLevel: number;
  confidence: number;
}

export interface RecurringCharacterEntry {
  name: string;
  description: string;
  /** Optional stable slug for portrait routing; filled by extraction or server. */
  characterKey?: string;
}

export interface StoryStateData {
  arcName: string;
  currentState: string;
  recurringCharacters: RecurringCharacterEntry[];
  activeThemes: string[];
}

export type StreamChunk =
  | { type: "text"; content: string }
  | { type: "image_start" }
  | {
      type: "image_done";
      url: string;
      prompt: string;
      charactersInScene?: string[];
    }
  | { type: "done"; messageId: string };
