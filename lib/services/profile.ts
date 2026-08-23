import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import type {
  EnrolledSubject,
  Language,
  LearnerProfileData,
  Level,
} from "../types";
import {
  DEFAULT_PRIMARY_SUBJECT_SLUG,
  GRADE_3_CORE_SUBJECT_SLUGS,
} from "../constants/subjects";
import {
  DEFAULT_GRADE_BAND,
  parseLearnerGradeBand,
  type LearnerGradeBand,
} from "../constants/grades";
import { enrollLearnerInGrade3CoreSubjects } from "./learnerSubjects";
import { ensureLearnerStoryChain } from "./storyCurriculum";

export class ProfileAlreadyExistsError extends Error {
  constructor() {
    super("Profile already exists for this user");
    this.name = "ProfileAlreadyExistsError";
  }
}

type ProfileWithSubjects = Prisma.LearnerProfileGetPayload<{
  include: {
    learnerSubjects: {
      include: {
        subject: { select: { slug: true; displayName: true; domain: true } };
      };
    };
  };
}>;

function toLearnerProfileData(profile: ProfileWithSubjects): LearnerProfileData {
  const enrolledSubjects: EnrolledSubject[] = profile.learnerSubjects.map(
    (ls) => ({
      slug: ls.subject.slug,
      displayName: ls.subject.displayName,
      domain: ls.subject.domain,
      status: ls.status,
    })
  );
  return {
    id: profile.id,
    displayName: profile.displayName,
    gradeBand: profile.gradeBand,
    readingLevel: profile.readingLevel,
    primarySubjectSlug: profile.primarySubjectSlug,
    goals: profile.goals,
    interests: profile.interests,
    activeLanguage: profile.activeLanguage as Language | null,
    currentLevel: profile.currentLevel as Level | null,
    enrolledSubjects,
  };
}

export async function getProfile(
  userId: string
): Promise<LearnerProfileData | null> {
  const profile = await prisma.learnerProfile.findUnique({
    where: { userId },
    include: {
      learnerSubjects: {
        include: {
          subject: {
            select: { slug: true, displayName: true, domain: true },
          },
        },
        orderBy: { enrolledAt: "asc" },
      },
    },
  });
  if (!profile) return null;
  return toLearnerProfileData(profile);
}

export async function hasProfile(userId: string): Promise<boolean> {
  const profile = await prisma.learnerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  return profile != null;
}

/** Story-default when onboarding skips goals (name + grade + dive-in). */
export const DEFAULT_ONBOARDING_GOALS =
  "Survey the wreck, find the crew, survive the island.";

export interface CreateProfileInput {
  displayName?: string | null;
  /** Enrolled grade 3–8. readingLevel defaults to this unless overridden. */
  gradeBand?: string | null;
  /** Optional override; defaults to gradeBand. */
  readingLevel?: string | null;
  goals?: string;
  interests?: string[];
  primarySubjectSlug?: string;
}

/**
 * Transactional onboarding:
 *   1. Create LearnerProfile with gradeBand + readingLevel (defaults to grade),
 *      primarySubjectSlug, optional displayName.
 *      Goals/interests default when omitted (UI is name + grade + dive-in).
 *   2. Enroll learner in all 4 Grade 3 core subjects (MVP curriculum still G3).
 *   3. Create the shared StoryWorld + StoryArc + Chapter 1 ("ensureLearnerStoryChain").
 *
 * Throws `ProfileAlreadyExistsError` if the user already has a profile.
 */
export async function createProfile(
  userId: string,
  data: CreateProfileInput
): Promise<LearnerProfileData> {
  const primarySubjectSlug =
    data.primarySubjectSlug &&
    (GRADE_3_CORE_SUBJECT_SLUGS as readonly string[]).includes(
      data.primarySubjectSlug
    )
      ? data.primarySubjectSlug
      : DEFAULT_PRIMARY_SUBJECT_SLUG;

  const gradeBand: LearnerGradeBand = parseLearnerGradeBand(
    data.gradeBand,
    DEFAULT_GRADE_BAND
  );
  const readingLevel: LearnerGradeBand = parseLearnerGradeBand(
    data.readingLevel,
    gradeBand
  );

  const profileId = await prisma.$transaction(async (tx) => {
    const existing = await tx.learnerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (existing) throw new ProfileAlreadyExistsError();

    const profile = await tx.learnerProfile.create({
      data: {
        userId,
        displayName: data.displayName?.trim() || null,
        gradeBand,
        readingLevel,
        primarySubjectSlug,
        activeLanguage: null,
        currentLevel: null,
        goals: data.goals?.trim() || DEFAULT_ONBOARDING_GOALS,
        interests: data.interests ?? [],
      },
      select: { id: true },
    });

    await enrollLearnerInGrade3CoreSubjects(tx, profile.id);
    return profile.id;
  });

  // Story chain creation reuses `prisma` directly (it opens its own writes
  // against StoryWorld / StoryArc / Chapter outside the enrollment tx so the
  // transaction stays short).
  await ensureLearnerStoryChain(profileId);

  const profile = await prisma.learnerProfile.findUniqueOrThrow({
    where: { id: profileId },
    include: {
      learnerSubjects: {
        include: {
          subject: {
            select: { slug: true, displayName: true, domain: true },
          },
        },
        orderBy: { enrolledAt: "asc" },
      },
    },
  });
  return toLearnerProfileData(profile);
}

export interface UpdateProfileInput {
  readingLevel?: string | null;
}

/**
 * Update mutable learner profile fields after onboarding.
 * Reading level takes effect on the next dialogue turn (system prompt rebuild).
 */
export async function updateProfile(
  userId: string,
  data: UpdateProfileInput
): Promise<LearnerProfileData> {
  const existing = await prisma.learnerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!existing) {
    throw new Error("Profile not found");
  }

  const readingLevel =
    data.readingLevel != null
      ? parseLearnerGradeBand(data.readingLevel, DEFAULT_GRADE_BAND)
      : undefined;

  const profile = await prisma.learnerProfile.update({
    where: { userId },
    data: {
      ...(readingLevel != null ? { readingLevel } : {}),
    },
    include: {
      learnerSubjects: {
        include: {
          subject: {
            select: { slug: true, displayName: true, domain: true },
          },
        },
        orderBy: { enrolledAt: "asc" },
      },
    },
  });
  return toLearnerProfileData(profile);
}
