export interface ArcFocusInput {
  gradeBand: string;
  primarySubjectSlug: string;
  interests: string[];
}

function slugPart(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 48);
}

/**
 * High-level tags when a `StoryArc` is created (woven world; arc-wide emphasis).
 * Subject/grade/interest only — difficulty is inferred from session performance, never tagged.
 */
export function generateArcFocusTags(input: ArcFocusInput): string[] {
  const tags: string[] = [
    `grade:${input.gradeBand}`,
    `subject:${input.primarySubjectSlug}`,
    "level:story-arc",
  ];
  for (const interest of input.interests.slice(0, 5)) {
    const s = slugPart(interest);
    if (s) tags.push(`interest:${s}`);
  }
  return tags;
}

/**
 * Refined tags when a `Chapter` is generated under an arc (subset / emphasis for this beat).
 */
export function refineChapterFocusTags(
  arcFocusTags: string[],
  chapterOrderIndex: number,
  chapterTitle: string
): string[] {
  const titleSlug = slugPart(chapterTitle) || `chapter-${chapterOrderIndex + 1}`;
  const beat =
    chapterOrderIndex === 0
      ? "opening"
      : chapterOrderIndex === 1
        ? "development"
        : "resolution";
  return [
    ...arcFocusTags,
    `chapter:${chapterOrderIndex + 1}`,
    `chapter-title:${titleSlug}`,
    `beat:${beat}`,
  ];
}
