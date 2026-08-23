import type { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import {
  GRADE_3_CORE_SUBJECT_SLUGS,
  type Grade3SubjectSlug,
} from "../constants/subjects";
import type { EnrolledSubject } from "../types";

/**
 * Enroll a learner in all G3 core subjects in one transaction. Idempotent —
 * if the learner is already enrolled in a subject, that row is preserved.
 *
 * Throws if any of the core subjects is missing from the DB — that means the
 * seed has not been run (see `npm run db:seed`).
 */
export async function enrollLearnerInGrade3CoreSubjects(
  tx: Prisma.TransactionClient,
  learnerProfileId: string
): Promise<void> {
  const subjects = await tx.subject.findMany({
    where: { slug: { in: [...GRADE_3_CORE_SUBJECT_SLUGS] } },
    select: { id: true, slug: true },
  });

  if (subjects.length !== GRADE_3_CORE_SUBJECT_SLUGS.length) {
    const found = new Set(subjects.map((s) => s.slug));
    const missing = GRADE_3_CORE_SUBJECT_SLUGS.filter((s) => !found.has(s));
    throw new Error(
      `Cannot enroll learner — missing Grade 3 core subjects: ${missing.join(
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
