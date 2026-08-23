import { prisma } from "../db/prisma";
import { getLearnerTimeSummary } from "./timeTracking";

export async function getSkillProgressOverview(profileId: string) {
  const rows = await prisma.skillProgress.findMany({
    where: { learnerProfileId: profileId },
    include: { skill: true },
    orderBy: { mastery: "desc" },
  });
  return rows.map((row) => ({
    id: row.id,
    slug: row.skill.slug,
    name: row.skill.displayName,
    mastery: Math.round(row.mastery),
    confidence: Math.round(row.confidence * 100),
    evidenceCount: row.evidenceCount,
    subjectScope: row.skill.subjectScope.length ? row.skill.subjectScope.join(", ") : null,
    lastObservedAt: row.lastObservedAt,
  }));
}

export async function getSubjectProgressOverview(profileId: string) {
  const subjects = await prisma.subject.findMany({
    include: {
      standardsCatalogs: {
        include: {
          standards: {
            include: {
              standardsProgress: {
                where: { learnerProfileId: profileId },
              },
            },
          },
        },
      },
    },
    orderBy: { displayName: "asc" },
  });

  return subjects.map((subject) => {
    const standards = subject.standardsCatalogs.flatMap((c) => c.standards);
    const progresses = standards.flatMap((s) => s.standardsProgress);
    const mastery =
      progresses.length > 0
        ? Math.round(progresses.reduce((sum, p) => sum + p.mastery, 0) / progresses.length)
        : 0;
    return {
      slug: subject.slug,
      name: subject.displayName,
      domain: subject.domain,
      standardsCount: standards.length,
      progressedCount: progresses.length,
      mastery,
    };
  });
}

export async function getSubjectStandardsProgress(profileId: string, subjectSlug: string) {
  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
    include: {
      standardsCatalogs: {
        include: {
          strands: {
            include: {
              standardGroups: {
                include: {
                  standards: {
                    include: {
                      standardsProgress: {
                        where: { learnerProfileId: profileId },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!subject) return null;

  const strandRows = subject.standardsCatalogs.flatMap((catalog) => catalog.strands);
  return {
    subject: {
      slug: subject.slug,
      name: subject.displayName,
      domain: subject.domain,
      framework: subject.framework,
    },
    strands: strandRows.map((strand) => ({
      code: strand.code,
      name: strand.displayName,
      groups: strand.standardGroups.map((group) => ({
        code: group.code,
        name: group.displayName,
        standards: group.standards.map((standard) => {
          const p = standard.standardsProgress[0];
          return {
            code: standard.code,
            description: standard.description,
            mastery: Math.round(p?.mastery ?? 0),
            confidence: Math.round((p?.confidence ?? 0.5) * 100),
            evidenceCount: p?.evidenceCount ?? 0,
            lastObservedAt: p?.lastObservedAt ?? null,
            nextReviewAt: p?.nextReviewAt ?? null,
          };
        }),
      })),
    })),
  };
}

export async function getRecentObservations(profileId: string, limit = 8) {
  const rows = await prisma.standardsEvidence.findMany({
    where: { learnerProfileId: profileId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      standard: { select: { code: true, description: true } },
    },
  });
  return rows.map((row) => ({
    id: row.id,
    standardCode: row.standard.code,
    description: row.standard.description,
    evidenceTier: row.evidenceTier,
    sourceType: row.sourceType,
    correctness: row.correctness,
    notes: row.notes,
    createdAt: row.createdAt,
  }));
}

export async function getLatestChapterReflection(profileId: string) {
  const row = await prisma.learningActivityCompletion.findFirst({
    where: {
      learnerProfileId: profileId,
      completedAt: { not: null },
      responseText: { not: null },
      learningActivity: { kind: "JOURNAL_PROMPT" },
    },
    orderBy: { completedAt: "desc" },
    include: {
      learningActivity: { select: { displayName: true, slug: true } },
    },
  });
  if (!row?.responseText) return null;
  return {
    title: row.learningActivity.displayName,
    text: row.responseText,
    completedAt: row.completedAt,
  };
}

export { getLearnerTimeSummary };
