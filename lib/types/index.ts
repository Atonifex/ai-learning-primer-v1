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

/** Chapter + arc focus tags for prompts (see `lib/story/focusTags.ts`). */
export interface SessionChapterContext {
  id: string;
  title: string;
  focusTags: string[];
  actCurrent: number;
  actTotal: number;
  pathAheadWhisper: string | null;
  arc: {
    id: string;
    title: string;
    focusTags: string[];
  };
}

export interface SessionData {
  id: string;
  language: Language;
  subjectSlug?: string;
  status: SessionStatus;
  arcName?: string | null;
  startedAt: Date;
  sceneIndex: number;
  messages: MessageData[];
  chapter?: SessionChapterContext | null;
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

/** Injected into system prompt from StoryWorld / StoryArc / Chapter (Phase 3). */
export interface StorySpineContext {
  worldTitle: string;
  worldBible: string;
  arcTitle: string;
  arcSummary: string | null;
  arcFocusTags: string[];
  chapterTitle: string;
  chapterFocusTags: string[];
  actCurrent: number;
  actTotal: number;
  pathAheadWhisper: string | null;
  sceneIndex: number;
  plannerJson: unknown;
}

export interface BranchOptionUi {
  id: string;
  orderIndex: number;
  title: string;
  teaser: string;
  imageUrl: string | null;
}

export interface BranchPointUi {
  id: string;
  promptText: string | null;
  options: BranchOptionUi[];
}

/** Extra session payload for ScenePanel + Previously On + branches (Phase 4). */
export interface SessionStoryUi {
  worldTitle: string;
  worldBible: string;
  previouslyOn: string | null;
  showPreviouslyOn: boolean;
  branchPoint: BranchPointUi | null;
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
