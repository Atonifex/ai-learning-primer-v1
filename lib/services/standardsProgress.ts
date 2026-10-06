import { prisma } from "../db/prisma";
import type { EvidenceTier } from "./standardsMasteryMath";
import { clamp, nextConfidenceAfterObservation, nextStandardsMastery } from "./standardsMasteryMath";

function nextReviewFromOutcome(success: boolean): Date {
  const now = Date.now();
  const ms = success ? 1000 * 60 * 60 * 24 * 3 : 1000 * 60 * 60 * 24;
  return new Date(now + ms);
}

async function recomputeSkillMasteryForStandard(standardId: string, profileId: string): Promise<void> {
  const links = await prisma.skillStandardLink.findMany({
    where: { standardId },
    select: { skillId: true },
  });
  const skillIds = [...new Set(links.map((l) => l.skillId))];
  if (!skillIds.length) return;

  for (const skillId of skillIds) {
    const skillLinks = await prisma.skillStandardLink.findMany({
      where: { skillId },
      select: {
        weight: true,
        standardId: true,
      },
    });
    if (!skillLinks.length) continue;

    const standardProgressRows = await prisma.standardsProgress.findMany({
      where: {
        learnerProfileId: profileId,
        standardId: { in: skillLinks.map((l) => l.standardId) },
      },
      select: {
        standardId: true,
        mastery: true,
        confidence: true,
      },
    });
    const byStandard = new Map(standardProgressRows.map((r) => [r.standardId, r]));

    let weightedSum = 0;
    let totalWeight = 0;
    let confidenceSum = 0;
    let confidenceCount = 0;
    for (const link of skillLinks) {
      const w = link.weight ?? 1;
      const row = byStandard.get(link.standardId);
      const mastery = row?.mastery ?? 0;
      weightedSum += mastery * w;
      totalWeight += w;
      if (row) {
        confidenceSum += row.confidence;
        confidenceCount += 1;
      }
    }

    const mastery = totalWeight > 0 ? weightedSum / totalWeight : 0;
    const confidence = confidenceCount > 0 ? confidenceSum / confidenceCount : 0.5;
    const standardIdsForSkill = skillLinks.map((l) => l.standardId);
    const evidenceTotal = await prisma.standardsEvidence.count({
      where: {
        learnerProfileId: profileId,
        standardId: { in: standardIdsForSkill },
      },
    });

    await prisma.skillProgress.upsert({
      where: { learnerProfileId_skillId: { learnerProfileId: profileId, skillId } },
      update: {
        mastery,
        confidence,
        evidenceCount: evidenceTotal,
        lastObservedAt: new Date(),
      },
      create: {
        learnerProfileId: profileId,
        skillId,
        mastery,
        confidence,
        evidenceCount: evidenceTotal,
      },
    });
  }
}

export async function recordStandardObservation(params: {
  sessionId: string;
  standardCode: string;
  evidenceTier: EvidenceTier;
  sourceType?: "CONVERSATIONAL" | "ACTIVITY" | "ASSESSMENT";
  sourceId?: string;
  messageId?: string;
  correctness?: number;
  hintsUsed?: number;
  difficulty?: number;
  rubricMatches?: string[];
  notes?: string;
  /** Look up the code in this catalog instead of the sitting's subject. */
  catalogSubjectSlug?: string;
  /** Stable, server-authored key for a retryable assessment answer. */
  idempotencyKey?: string;
}): Promise<{ standardCode: string; mastery: number }> {
  const {
    sessionId,
    standardCode,
    evidenceTier,
    sourceType = "CONVERSATIONAL",
    sourceId,
    messageId,
    correctness,
    hintsUsed,
    difficulty,
    rubricMatches,
    notes,
    catalogSubjectSlug,
  } = params;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { learnerProfileId: true, subjectId: true },
  });
  if (!session) throw new Error("Session not found");
  if (params.idempotencyKey) {
    const prior = await prisma.standardsEvidence.findUnique({ where: { id: params.idempotencyKey }, include: { standard: { select: { code: true } } } });
    if (prior) {
      if (prior.learnerProfileId !== session.learnerProfileId || prior.standard.code !== standardCode) throw new Error("Evidence key does not match this learner and skill.");
      const current = await prisma.standardsProgress.findUnique({ where: { learnerProfileId_standardId: { learnerProfileId: session.learnerProfileId, standardId: prior.standardId } } });
      return { standardCode, mastery: current?.mastery ?? 0 };
    }
  }

  let subjectId = session.subjectId;
  if (catalogSubjectSlug) {
    const subject = await prisma.subject.findUnique({
      where: { slug: catalogSubjectSlug },
      select: { id: true },
    });
    if (!subject) throw new Error(`Unknown subject: ${catalogSubjectSlug}`);
    subjectId = subject.id;
  }

  const standard = await prisma.standard.findFirst({
    where: {
      code: standardCode,
      catalog: { subjectId },
    },
    select: { id: true, code: true },
  });
  if (!standard) {
    // Reject invented / wrong-subject codes — never write evidence against a ghost.
    const existsAnywhere = await prisma.standard.findFirst({
      where: { code: standardCode },
      select: { id: true },
    });
    if (!existsAnywhere) {
      throw new Error(`Unknown standard code: ${standardCode}`);
    }
    throw new Error(
      `Standard code not in session subject catalog: ${standardCode}`,
    );
  }

  const baseCorrectness = clamp(correctness ?? 0.7, 0, 1);

  const progress = await prisma.standardsProgress.upsert({
    where: {
      learnerProfileId_standardId: {
        learnerProfileId: session.learnerProfileId,
        standardId: standard.id,
      },
    },
    update: {},
    create: {
      learnerProfileId: session.learnerProfileId,
      standardId: standard.id,
    },
  });

  const nextMastery = nextStandardsMastery({
    currentMastery: progress.mastery,
    evidenceTier,
    correctnessNormalized: baseCorrectness,
  });
  const nextConfidence = nextConfidenceAfterObservation(progress.confidence, baseCorrectness);
  const success = baseCorrectness >= 0.7;

  try {
  await prisma.$transaction(async (tx) => {
    await tx.standardsEvidence.create({
      data: {
        ...(params.idempotencyKey ? { id: params.idempotencyKey } : {}),
        learnerProfileId: session.learnerProfileId,
        standardId: standard.id,
        sourceType,
        sourceId,
        sessionId,
        messageId,
        evidenceTier,
        correctness: baseCorrectness,
        hintsUsed,
        difficulty,
        rubricMatches: rubricMatches ?? [],
        notes,
      },
    });

    await tx.standardsProgress.update({
      where: {
        learnerProfileId_standardId: {
          learnerProfileId: session.learnerProfileId,
          standardId: standard.id,
        },
      },
      data: {
        mastery: nextMastery,
        confidence: nextConfidence,
        evidenceCount: { increment: 1 },
        lastObservedAt: new Date(),
        lastDemonstratedAt: success ? new Date() : progress.lastDemonstratedAt,
        nextReviewAt: nextReviewFromOutcome(success),
      },
    });
  });
  } catch (error) {
    if (params.idempotencyKey && typeof error === "object" && error && "code" in error && error.code === "P2002") {
      // A concurrent retry wrote this exact answer. The failed transaction made no progress change.
      const prior = await prisma.standardsEvidence.findUnique({ where: { id: params.idempotencyKey } });
      if (prior?.learnerProfileId === session.learnerProfileId && prior.standardId === standard.id) {
        const current = await prisma.standardsProgress.findUnique({ where: { learnerProfileId_standardId: { learnerProfileId: session.learnerProfileId, standardId: standard.id } } });
        return { standardCode, mastery: current?.mastery ?? 0 };
      }
    }
    throw error;
  }

  await recomputeSkillMasteryForStandard(standard.id, session.learnerProfileId);
  return { standardCode: standard.code, mastery: nextMastery };
}
