import { mathG3Template } from "./math_g3";
import { elaG3Template } from "./ela_g3";
import { scienceG3Template } from "./science_g3";
import { socialStudiesG3Template } from "./social_studies_g3";
import type { SubjectPromptTemplate } from "./types";
import { learningProgressionInstructions } from "../learningProgressions";

export {
  MAPMAKERS_ARC_TITLE,
  MAPMAKERS_CHAPTERS,
  MAPMAKERS_WORLD_BIBLE,
  MAPMAKERS_WORLD_TITLE,
} from "./_shared_castaway_world";
export type { SubjectPromptTemplate } from "./types";

function retargetToGrade4(
  template: SubjectPromptTemplate,
  slug: string
): SubjectPromptTemplate {
  const rewrite = (text: string) =>
    text
      .replaceAll("Grade 3", "Grade 4")
      .replaceAll("grade 3", "grade 4")
      .replaceAll("third-grader", "fourth-grader")
      .replaceAll("third grader", "fourth grader");
  const fromSlug =
    (template as { subjectSlug?: string }).subjectSlug ??
    (template as { subjectSlug?: string }).subjectSlug ??
    "";
  const json = rewrite(JSON.stringify(template)).replaceAll(fromSlug, slug);
  return {
    ...(JSON.parse(json) as SubjectPromptTemplate),
    subjectSlug: slug,
  };
}

const TEMPLATES: Record<string, SubjectPromptTemplate> = {
  math_g3: mathG3Template,
  ela_g3: elaG3Template,
  science_g3: scienceG3Template,
  social_studies_g3: socialStudiesG3Template,
  math_g4: retargetToGrade4(mathG3Template, "math_g4"),
  ela_g4: retargetToGrade4(elaG3Template, "ela_g4"),
  science_g4: retargetToGrade4(scienceG3Template, "science_g4"),
  social_studies_g4: retargetToGrade4(
    socialStudiesG3Template,
    "social_studies_g4"
  ),
};

export function getPromptTemplate(subjectSlug: string): SubjectPromptTemplate {
  const template = TEMPLATES[subjectSlug];
  if (!template) {
    throw new Error(
      `No prompt template registered for subject "${subjectSlug}". Add it in lib/ai/promptTemplates/.`
    );
  }
  return {
    ...template,
    pedagogyInstructions: `${template.pedagogyInstructions}\n\n${learningProgressionInstructions(subjectSlug)}`,
  };
}
