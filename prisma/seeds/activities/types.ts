/**
 * Wire in a follow-up after catalog sync.
 *
 * Shared shapes for the Grade 3 activity bank and a future LearningActivity seed.
 * Do not import this from prisma/seed.ts until the G3 catalogs in prisma/seeds
 * match curriculum_resources authoring files.
 */

export type SubjectSlug = "math_g3" | "ela_g3" | "science_g3" | "social_studies_g3";

export type PrismaActivityKind =
  | "READING"
  | "INTERACTIVE_GAME"
  | "MINI_QUIZ"
  | "CHALLENGE"
  | "STORY_SCENE"
  | "JOURNAL_PROMPT";

export type BankActivityKind =
  | "SHIP_LOG_READING"
  | "ISLAND_BOOK"
  | "CREW_DIALOGUE"
  | "PLAN_WRITING"
  | "CALCULATOR"
  | "SPREADSHEET"
  | "MINI_QUIZ"
  | "CHECKPOINT_TEST"
  | "CHAPTER_REFLECTION"
  | "SPEECH"
  | "CREATIVE_PROJECT"
  | "MAP_EXPLORE"
  | "INTERACTIVE_SORT"
  | "STORY_SCENE";

export type QuizItemType = "multiple_choice" | "free_response";

export type QuizItem = {
  itemType: QuizItemType;
  prompt: string;
  choices?: string[];
  /** 0-based index into choices when itemType is multiple_choice */
  correctIndex?: number;
  sampleAnswer?: string;
};

export type ActivityTemplate = {
  slug: string;
  title: string;
  kind: BankActivityKind;
  prismaKind: PrismaActivityKind;
  subjectSlug: SubjectSlug;
  targetStandardCodes: string[];
  chapterId?: string;
  unitId?: string;
  /** Student-facing, in-world. Bind captain name / location via storySkinNotes. */
  prompt: string;
  scaffoldHints: [string, string, string];
  answerRubric: string;
  storySkinNotes: string;
  estimatedMinutes: number;
  authoring: "HAND_AUTHORED";
  quizItems?: QuizItem[];
  readingText?: string;
};

export type LearningActivitySeed = {
  slug: string;
  displayName: string;
  kind: PrismaActivityKind;
  description: string;
  narrativeContext: string;
  targetStandardCodes: string[];
  estimatedMinutes?: number;
  authoring: "HAND_AUTHORED";
};

export const BANK_KIND_TO_PRISMA: Record<BankActivityKind, PrismaActivityKind> = {
  SHIP_LOG_READING: "READING",
  ISLAND_BOOK: "READING",
  CREW_DIALOGUE: "STORY_SCENE",
  PLAN_WRITING: "JOURNAL_PROMPT",
  CALCULATOR: "CHALLENGE",
  SPREADSHEET: "CHALLENGE",
  MINI_QUIZ: "MINI_QUIZ",
  CHECKPOINT_TEST: "CHALLENGE",
  CHAPTER_REFLECTION: "JOURNAL_PROMPT",
  SPEECH: "STORY_SCENE",
  CREATIVE_PROJECT: "CHALLENGE",
  MAP_EXPLORE: "INTERACTIVE_GAME",
  INTERACTIVE_SORT: "INTERACTIVE_GAME",
  STORY_SCENE: "STORY_SCENE",
};
