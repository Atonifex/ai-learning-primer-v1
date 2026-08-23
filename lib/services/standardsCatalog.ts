import { prisma } from "../db/prisma";

export interface StandardEntry {
  code: string;
  /** Short description (first sentence) used in the injected prompt block. */
  description: string;
  /** Strand display name or code, e.g. "Number Sense and Operations". */
  domain: string;
}

/**
 * Returns the standards for a subject, ready to be injected into the system
 * prompt as the canonical list of codes the AI is allowed to record evidence
 * against.
 *
 * Picks the most recently created catalog for the subject (subjects can have
 * multiple versions; we always pin to the latest seeded catalog at runtime).
 *
 * @param subjectSlug e.g. "math_g3"
 * @param limit max number of standards to return (token budget; default 50)
 */
export async function getStandardCodesForSubject(
  subjectSlug: string,
  limit = 50
): Promise<StandardEntry[]> {
  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
    select: { id: true },
  });
  if (!subject) return [];

  const catalog = await prisma.standardsCatalog.findFirst({
    where: { subjectId: subject.id },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });
  if (!catalog) return [];

  const standards = await prisma.standard.findMany({
    where: { catalogId: catalog.id },
    orderBy: { code: "asc" },
    take: limit,
    select: {
      code: true,
      description: true,
      standardGroup: { select: { strand: { select: { displayName: true } } } },
    },
  });

  return standards.map((s) => ({
    code: s.code,
    description: firstSentence(s.description),
    domain: s.standardGroup.strand.displayName,
  }));
}

function firstSentence(text: string): string {
  // Keep the first sentence (or up to 180 chars) — token budget matters.
  const trimmed = text.trim();
  const dot = trimmed.search(/[.!?](\s|$)/);
  const candidate = dot > 0 ? trimmed.slice(0, dot + 1) : trimmed;
  return candidate.length > 180 ? candidate.slice(0, 177) + "..." : candidate;
}

/**
 * Format the standards block for the system prompt.
 *   `MA.3.NSO.1.1 | Number Sense | Read and write numbers from 0 to 10,000...`
 */
export function formatStandardsBlock(standards: StandardEntry[]): string {
  if (!standards.length) {
    return "STANDARDS: (none seeded for this subject — record_standard_observation should not be called this session)";
  }
  const lines = standards.map(
    (s) => `${s.code} | ${s.domain} | ${s.description}`
  );
  return [
    "STANDARDS (only call record_standard_observation with codes from THIS list):",
    ...lines,
  ].join("\n");
}
