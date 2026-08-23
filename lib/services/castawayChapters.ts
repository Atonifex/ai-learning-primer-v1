/**
 * Bridge: Amplify-shaped curriculum chapters → story spine ChapterTemplate.
 * Saga spine stays in TypeScript; learners get copies on StoryWorld/Chapter.
 */

import {
  grade3CastawayCurriculum,
  type CurriculumChapter,
} from "../../curriculum_resources/grade3_castaway_curriculum";
import type { ChapterTemplate } from "../ai/promptTemplates/_shared_castaway_world";

const WRECK_WHISPER =
  "Rho says the tide is coming in fast — whatever isn't measured by sundown might be gone by morning.";
const FOOD_WHISPER =
  "Cook Pell whispers that someone short-counted the water barrels — Rho thinks the captain should check the math.";

export function curriculumChapterToTemplate(
  chapter: CurriculumChapter,
  pathAheadWhisper?: string,
): ChapterTemplate {
  return {
    title: chapter.title,
    sharedBeat: chapter.sharedBeat,
    anchorQuestion: chapter.anchorQuestion,
    chapterQuestion: chapter.chapterQuestion,
    investigationQuestions: chapter.investigationQuestions,
    pathAheadWhisper,
    subjectPlans: chapter.subjectPlans,
  };
}

/** Tutorial Ch1 (wreck) + Ch2 (food / divide supplies) from the castaway curriculum. */
export function getWreckAndFoodChapterTemplates(): ChapterTemplate[] {
  const unit1 = grade3CastawayCurriculum.units.find((u) => u.id === "u1-crash");
  if (!unit1 || unit1.chapters.length < 2) {
    throw new Error("grade3_castaway_curriculum missing Unit 1 wreck + food chapters");
  }
  return [
    curriculumChapterToTemplate(unit1.chapters[0], WRECK_WHISPER),
    curriculumChapterToTemplate(unit1.chapters[1], FOOD_WHISPER),
  ];
}

export function wreckFoodPlannerJson(template: ChapterTemplate, curriculumChapterId: string) {
  return {
    curriculumChapterId,
    sharedBeat: template.sharedBeat,
    anchorQuestion: template.anchorQuestion,
    chapterQuestion: template.chapterQuestion,
    investigationQuestions: template.investigationQuestions,
    subjectPlans: template.subjectPlans,
  };
}

export const WRECK_FOOD_CURRICULUM_IDS = ["u1-ch1", "u1-ch2"] as const;
