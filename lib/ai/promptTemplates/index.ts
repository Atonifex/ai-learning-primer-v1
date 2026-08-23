import { mathG3Template } from "./math_g3";
import { elaG3Template } from "./ela_g3";
import { scienceG3Template } from "./science_g3";
import { socialStudiesG3Template } from "./social_studies_g3";
import type { SubjectPromptTemplate } from "./types";

export {
  MAPMAKERS_ARC_TITLE,
  MAPMAKERS_CHAPTERS,
  MAPMAKERS_WORLD_BIBLE,
  MAPMAKERS_WORLD_TITLE,
} from "./_shared_castaway_world";
export type { SubjectPromptTemplate } from "./types";

const TEMPLATES: Record<string, SubjectPromptTemplate> = {
  math_g3: mathG3Template,
  ela_g3: elaG3Template,
  science_g3: scienceG3Template,
  social_studies_g3: socialStudiesG3Template,
};

export function getPromptTemplate(subjectSlug: string): SubjectPromptTemplate {
  const template = TEMPLATES[subjectSlug];
  if (!template) {
    throw new Error(
      `No prompt template registered for subject "${subjectSlug}". Add it in lib/ai/promptTemplates/.`
    );
  }
  return template;
}
