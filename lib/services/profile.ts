import { prisma } from "../db/prisma";
import type { Language, Level, LearnerProfileData } from "../types";

export async function getProfile(userId: string): Promise<LearnerProfileData | null> {
  const profile = await prisma.learnerProfile.findUnique({
    where: { userId },
  });
  if (!profile) return null;
  return {
    id: profile.id,
    activeLanguage: profile.activeLanguage as Language,
    currentLevel: profile.currentLevel as Level,
    goals: profile.goals,
    interests: profile.interests,
  };
}

export async function createProfile(
  userId: string,
  data: { activeLanguage: Language; currentLevel: Level; goals: string; interests: string[] }
): Promise<LearnerProfileData> {
  const profile = await prisma.learnerProfile.create({
    data: {
      userId,
      activeLanguage: data.activeLanguage,
      currentLevel: data.currentLevel,
      goals: data.goals,
      interests: data.interests,
    },
  });
  return {
    id: profile.id,
    activeLanguage: profile.activeLanguage as Language,
    currentLevel: profile.currentLevel as Level,
    goals: profile.goals,
    interests: profile.interests,
  };
}
