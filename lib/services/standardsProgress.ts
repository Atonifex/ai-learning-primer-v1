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
  } = params;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { learnerProfileId: true, subjectId: true },
  });
  if (!session) throw new Error("Session not found");

  const standard = await prisma.standard.findFirst({
    where: {
      code: standardCode,
      catalog: { subjectId: session.subjectId },
    },
    select: { id: true, code: true },
  });
  if (!standard) {
    throw new Error(`Standard not found for session subject: ${standardCode}`);
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

  await prisma.$transaction(async (tx) => {
    await tx.standardsEvidence.create({
      data: {
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

  await recomputeSkillMasteryForStandard(standard.id, session.learnerProfileId);
  return { standardCode: standard.code, mastery: nextMastery };
}
