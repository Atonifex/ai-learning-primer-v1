import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import {
  coreSubjectSlugsForGrade,
  GRADE_3_CORE_SUBJECT_SLUGS,
  type Grade3SubjectSlug,
  type PlayableCoreSubjectSlug,
} from "../constants/subjects";
import type { EnrolledSubject } from "../types";

/**
 * Enroll a learner in the four core subjects for their catalog grade.
 * Idempotent — existing rows are kept. Throws if those Subject rows are
 * missing (run `npm run db:seed`).
 */
export async function enrollLearnerInCoreSubjects(
  tx: Prisma.TransactionClient,
  learnerProfileId: string,
  gradeBand: string
): Promise<void> {
  const slugs = [...coreSubjectSlugsForGrade(gradeBand)];
  const subjects = await tx.subject.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });

  if (subjects.length !== slugs.length) {
    const found = new Set(subjects.map((s) => s.slug));
    const missing = slugs.filter((s) => !found.has(s));
    throw new Error(
      `Cannot enroll learner — missing core subjects: ${missing.join(
        ", "
      )}. Run \`npm run db:seed\`.`
    );
  }

  await tx.learnerSubject.createMany({
    data: subjects.map((s) => ({
      learnerProfileId,
      subjectId: s.id,
      status: "ACTIVE" as const,
    })),
    skipDuplicates: true,
  });
}

/** @deprecated Prefer enrollLearnerInCoreSubjects(tx, id, gradeBand) */
export async function enrollLearnerInGrade3CoreSubjects(
  tx: Prisma.TransactionClient,
  learnerProfileId: string
): Promise<void> {
  await enrollLearnerInCoreSubjects(tx, learnerProfileId, "3");
}

export async function listEnrolledSubjects(
  learnerProfileId: string
): Promise<EnrolledSubject[]> {
  const rows = await prisma.learnerSubject.findMany({
    where: { learnerProfileId },
    include: {
      subject: { select: { slug: true, displayName: true, domain: true } },
    },
    orderBy: { enrolledAt: "asc" },
  });
  return rows.map((r) => ({
    slug: r.subject.slug,
    displayName: r.subject.displayName,
    domain: r.subject.domain,
    status: r.status,
  }));
}

export function isGrade3CoreSubjectSlug(
  slug: string
): slug is Grade3SubjectSlug {
  return (GRADE_3_CORE_SUBJECT_SLUGS as readonly string[]).includes(slug);
}

export function isEnrolledCoreSubjectSlug(
  slug: string
): slug is PlayableCoreSubjectSlug {
  return (
    slug.endsWith("_g3") || slug.endsWith("_g4")
  );
}
