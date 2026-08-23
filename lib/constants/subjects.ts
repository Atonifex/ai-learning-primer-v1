/**
 * Core subject slugs are `{domain}_g{grade}` (e.g. math_g3, ela_g4).
 * Onboarding grade 3 enrolls G3 catalogs. Grade 4+ enrolls G4 until G5+
 * catalogs exist — readingLevel can still be 5–8 independently.
 */

export const SUBJECT_DOMAINS = [
  "math",
  "ela",
  "science",
  "social_studies",
] as const;

export type SubjectDomain = (typeof SUBJECT_DOMAINS)[number];

export const PLAYABLE_CURRICULUM_GRADES = ["3", "4"] as const;
export type PlayableCurriculumGrade =
  (typeof PLAYABLE_CURRICULUM_GRADES)[number];

export const GRADE_3_CORE_SUBJECT_SLUGS = [
  "math_g3",
  "ela_g3",
  "science_g3",
  "social_studies_g3",
] as const;

export const GRADE_4_CORE_SUBJECT_SLUGS = [
  "math_g4",
  "ela_g4",
  "science_g4",
  "social_studies_g4",
] as const;

export type Grade3SubjectSlug = (typeof GRADE_3_CORE_SUBJECT_SLUGS)[number];
export type Grade4SubjectSlug = (typeof GRADE_4_CORE_SUBJECT_SLUGS)[number];
export type PlayableCoreSubjectSlug = Grade3SubjectSlug | Grade4SubjectSlug;

export const PLAYABLE_CORE_SUBJECT_SLUGS = [
  ...GRADE_3_CORE_SUBJECT_SLUGS,
  ...GRADE_4_CORE_SUBJECT_SLUGS,
] as const;

export const DEFAULT_PRIMARY_SUBJECT_SLUG: Grade3SubjectSlug = "math_g3";

export const SUBJECT_DISPLAY_NAMES: Record<PlayableCoreSubjectSlug, string> = {
  math_g3: "Grade 3 Math",
  ela_g3: "Grade 3 Reading & Writing",
  science_g3: "Grade 3 Science",
  social_studies_g3: "Grade 3 Social Studies",
  math_g4: "Grade 4 Math",
  ela_g4: "Grade 4 Reading & Writing",
  science_g4: "Grade 4 Science",
  social_studies_g4: "Grade 4 Social Studies",
};

/** Highest seeded curriculum grade. Grades 5–8 start here until those catalogs exist. */
export function curriculumGradeForLearner(
  gradeBand: string
): PlayableCurriculumGrade {
  const n = Number.parseInt(gradeBand, 10);
  if (!Number.isFinite(n) || n <= 3) return "3";
  return "4";
}

export function coreSubjectSlug(
  domain: SubjectDomain,
  grade: PlayableCurriculumGrade
): PlayableCoreSubjectSlug {
  return `${domain}_g${grade}` as PlayableCoreSubjectSlug;
}

export function coreSubjectSlugsForGrade(
  gradeBand: string
): readonly PlayableCoreSubjectSlug[] {
  return curriculumGradeForLearner(gradeBand) === "4"
    ? GRADE_4_CORE_SUBJECT_SLUGS
    : GRADE_3_CORE_SUBJECT_SLUGS;
}

export function defaultPrimarySubjectSlug(
  gradeBand: string
): PlayableCoreSubjectSlug {
  return coreSubjectSlug("math", curriculumGradeForLearner(gradeBand));
}

export function parseSubjectDomain(slug: string): SubjectDomain | null {
  for (const domain of SUBJECT_DOMAINS) {
    if (slug.startsWith(`${domain}_g`)) return domain;
  }
  return null;
}

/** math_g3 + grade 4 captain → math_g4 */
export function remapCoreSubjectToGrade(
  slug: string,
  gradeBand: string
): string {
  const domain = parseSubjectDomain(slug);
  if (!domain) return slug;
  return coreSubjectSlug(domain, curriculumGradeForLearner(gradeBand));
}

/**
 * Shared saga planners are authored under G3 subject keys.
 * G4 sessions still use those story beats.
 */
export function storySpineSubjectSlug(slug: string): string {
  const domain = parseSubjectDomain(slug);
  if (!domain) return slug;
  return coreSubjectSlug(domain, "3");
}

export function isGrade3CoreSubject(slug: string): slug is Grade3SubjectSlug {
  return (GRADE_3_CORE_SUBJECT_SLUGS as readonly string[]).includes(slug);
}

export function isGrade4CoreSubject(slug: string): slug is Grade4SubjectSlug {
  return (GRADE_4_CORE_SUBJECT_SLUGS as readonly string[]).includes(slug);
}

export function isPlayableCoreSubject(
  slug: string
): slug is PlayableCoreSubjectSlug {
  return (PLAYABLE_CORE_SUBJECT_SLUGS as readonly string[]).includes(slug);
}

export const isGrade3CoreSubjectSlug = isGrade3CoreSubject;
