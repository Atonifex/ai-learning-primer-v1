import { prisma } from "../db/prisma";

const DEFAULT_SUBJECT_SLUG = "ela_g3";
const DEFAULT_CATALOG_VERSION = "v1";

export async function getOrCreateDefaultSubject(): Promise<{ id: string; slug: string }> {
  const existing = await prisma.subject.findUnique({
    where: { slug: DEFAULT_SUBJECT_SLUG },
    select: { id: true, slug: true },
  });
  if (existing) return existing;

  return prisma.subject.create({
    data: {
      slug: DEFAULT_SUBJECT_SLUG,
      domain: "ELA",
      gradeBand: "3",
      framework: "FL_BEST",
      displayName: "Grade 3 English Language Arts",
    },
    select: { id: true, slug: true },
  });
}

export async function getOrCreateDefaultCatalog(): Promise<{ id: string }> {
  const subject = await getOrCreateDefaultSubject();
  const existing = await prisma.standardsCatalog.findUnique({
    where: {
      subjectId_version: { subjectId: subject.id, version: DEFAULT_CATALOG_VERSION },
    },
    select: { id: true },
  });
  if (existing) return existing;

  return prisma.standardsCatalog.create({
    data: {
      subjectId: subject.id,
      version: DEFAULT_CATALOG_VERSION,
      label: "Default Grade 3 ELA catalog",
      framework: "FL_BEST",
    },
    select: { id: true },
  });
}
