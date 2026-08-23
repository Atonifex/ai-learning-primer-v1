export const GRADE_3_CORE_SUBJECT_SLUGS = [
  "math_g3",
  "ela_g3",
  "science_g3",
  "social_studies_g3",
] as const;

export type Grade3SubjectSlug = (typeof GRADE_3_CORE_SUBJECT_SLUGS)[number];

export const DEFAULT_PRIMARY_SUBJECT_SLUG: Grade3SubjectSlug = "math_g3";

export const SUBJECT_DISPLAY_NAMES: Record<Grade3SubjectSlug, string> = {
  math_g3: "Grade 3 Math",
  ela_g3: "Grade 3 Reading & Writing",
  science_g3: "Grade 3 Science",
  social_studies_g3: "Grade 3 Social Studies",
};

export function isGrade3CoreSubject(slug: string): slug is Grade3SubjectSlug {
  return (GRADE_3_CORE_SUBJECT_SLUGS as readonly string[]).includes(slug);
}
