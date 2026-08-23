import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import type {
  EnrolledSubject,
  Language,
  LearnerProfileData,
  Level,
} from "../types";
import {
  coreSubjectSlugsForGrade,
  defaultPrimarySubjectSlug,
} from "../constants/subjects";
import {
  DEFAULT_GRADE_BAND,
  parseLearnerGradeBand,
  type LearnerGradeBand,
} from "../constants/grades";
import {
  applyFirstRunEvent,
  parseFirstRunStep,
  type FirstRunEvent,
  type FirstRunStep,
} from "../play/firstRun";
import { enrollLearnerInCoreSubjects } from "./learnerSubjects";
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
    firstRunStep: profile.firstRunStep,
    introSeenAt: profile.introSeenAt,
    householdId: profile.householdId,
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
  firstRunStep?: FirstRunStep;
  goals?: string;
  interests?: string[];
  primarySubjectSlug?: string;
}

/**
 * Transactional onboarding:
 *   1. Create LearnerProfile with gradeBand + readingLevel (defaults to grade),
 *      primarySubjectSlug, optional displayName.
 *      Goals/interests default when omitted (UI is name + grade + dive-in).
 *   2. Enroll learner in the four core subjects for their catalog grade
 *      (G3 if gradeBand is 3; G4 if 4–8 until later catalogs exist).
 *   3. Create the shared StoryWorld + StoryArc + Chapter 1 ("ensureLearnerStoryChain").
 *
 * Throws `ProfileAlreadyExistsError` if the user already has a profile.
 */
export async function createProfile(
  userId: string,
  data: CreateProfileInput
): Promise<LearnerProfileData> {
  const gradeBand: LearnerGradeBand = parseLearnerGradeBand(
    data.gradeBand,
    DEFAULT_GRADE_BAND
  );
  const readingLevel: LearnerGradeBand = parseLearnerGradeBand(
    data.readingLevel,
    gradeBand
  );
  const coreSlugs = coreSubjectSlugsForGrade(gradeBand);
  const primarySubjectSlug =
    data.primarySubjectSlug &&
    (coreSlugs as readonly string[]).includes(data.primarySubjectSlug)
      ? data.primarySubjectSlug
      : defaultPrimarySubjectSlug(gradeBand);

  const profileId = await prisma.$transaction(async (tx) => {
    const existing = await tx.learnerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (existing) throw new ProfileAlreadyExistsError();

    const owner = await tx.user.findUnique({
      where: { id: userId },
      select: { householdId: true, role: true },
    });
    if (!owner?.householdId) {
      throw new Error("Captain must belong to a household before a profile is created");
    }

    const profile = await tx.learnerProfile.create({
      data: {
        userId,
        householdId: owner.householdId,
        displayName: data.displayName?.trim() || null,
        gradeBand,
        readingLevel,
        firstRunStep: data.firstRunStep ?? "video",
        primarySubjectSlug,
        activeLanguage: null,
        currentLevel: null,
        goals: data.goals?.trim() || DEFAULT_ONBOARDING_GOALS,
        interests: data.interests ?? [],
      },
      select: { id: true },
    });

    await enrollLearnerInCoreSubjects(tx, profile.id, gradeBand);
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
  displayName?: string | null;
  firstRunEvent?: FirstRunEvent;
  firstRunStep?: FirstRunStep;
  introSeenAt?: Date | null;
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
    select: { id: true, firstRunStep: true },
  });
  if (!existing) {
    throw new Error("Profile not found");
  }

  const readingLevel =
    data.readingLevel != null
      ? parseLearnerGradeBand(data.readingLevel, DEFAULT_GRADE_BAND)
      : undefined;

  const currentStep = parseFirstRunStep(existing.firstRunStep);
  let firstRunStep = data.firstRunStep;
  if (data.firstRunEvent) {
    firstRunStep = applyFirstRunEvent(currentStep, data.firstRunEvent);
  }
  const introSeenAt =
    data.introSeenAt !== undefined
      ? data.introSeenAt
      : data.firstRunEvent === "video_done"
        ? new Date()
        : undefined;

  const profile = await prisma.learnerProfile.update({
    where: { userId },
    data: {
      ...(readingLevel != null ? { readingLevel } : {}),
      ...(data.displayName !== undefined
        ? { displayName: data.displayName?.trim() || null }
        : {}),
      ...(firstRunStep != null ? { firstRunStep } : {}),
      ...(introSeenAt !== undefined ? { introSeenAt } : {}),
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
