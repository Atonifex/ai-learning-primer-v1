import { prisma } from "../db/prisma";
import type {
  MemoryItemData,
  SkillUpdate,
  StoryStateData,
  Language,
  RecurringCharacterEntry,
} from "../types";

export async function getRelevantMemory(
  profileId: string,
  limit = 20
): Promise<MemoryItemData[]> {
  const items = await prisma.memoryItem.findMany({
    where: { learnerProfileId: profileId },
    orderBy: [{ confidence: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });
  return items.map((i) => ({
    type: i.type as MemoryItemData["type"],
    content: i.content,
    confidence: i.confidence,
  }));
}

export async function upsertMemoryItems(
  profileId: string,
  sessionId: string,
  items: MemoryItemData[]
): Promise<void> {
  for (const item of items) {
    const existing = await prisma.memoryItem.findFirst({
      where: {
        learnerProfileId: profileId,
        type: item.type,
        content: { contains: item.content.substring(0, 30) },
      },
    });

    if (existing) {
      await prisma.memoryItem.update({
        where: { id: existing.id },
        data: {
          confidence: Math.min(1.0, (existing.confidence + item.confidence) / 2),
          content: item.content,
        },
      });
    } else {
      await prisma.memoryItem.create({
        data: {
          learnerProfileId: profileId,
          type: item.type,
          content: item.content,
          confidence: item.confidence,
          sourceSessionId: sessionId,
        },
      });
    }
  }
}

export async function upsertSkillProgress(
  profileId: string,
  skills: SkillUpdate[]
): Promise<void> {
  for (const skill of skills) {
    await prisma.skillProgress.upsert({
      where: {
        learnerProfileId_skillName_language: {
          learnerProfileId: profileId,
          skillName: skill.skillName,
          language: skill.language,
        },
      },
      update: {
        estimatedLevel: skill.estimatedLevel,
        confidence: skill.confidence,
        lastObservedAt: new Date(),
      },
      create: {
        learnerProfileId: profileId,
        skillName: skill.skillName,
        language: skill.language as Language,
        estimatedLevel: skill.estimatedLevel,
        confidence: skill.confidence,
      },
    });
  }
}

export async function upsertStoryState(
  profileId: string,
  sessionId: string,
  state: StoryStateData
): Promise<void> {
  await prisma.storyState.upsert({
    where: { sessionId },
    update: {
      arcName: state.arcName,
      currentState: state.currentState,
      recurringCharacters: state.recurringCharacters,
      activeThemes: state.activeThemes,
    },
    create: {
      learnerProfileId: profileId,
      sessionId,
      arcName: state.arcName,
      currentState: state.currentState,
      recurringCharacters: state.recurringCharacters,
      activeThemes: state.activeThemes,
    },
  });
}

export async function getRecentSummaries(
  profileId: string,
  limit = 3
): Promise<string[]> {
  const sessions = await prisma.session.findMany({
    where: {
      learnerProfileId: profileId,
      status: "COMPLETED",
      arcSummary: { not: null },
    },
    orderBy: { completedAt: "desc" },
    take: limit,
    select: { arcSummary: true },
  });
  return sessions.map((s) => s.arcSummary!);
}

export async function getLatestStoryState(profileId: string): Promise<StoryStateData | null> {
  const state = await prisma.storyState.findFirst({
    where: { learnerProfile: { id: profileId } },
    orderBy: { lastUpdatedAt: "desc" },
  });
  if (!state) return null;
  const raw = state.recurringCharacters as unknown;
  const recurringCharacters: RecurringCharacterEntry[] = Array.isArray(raw)
    ? raw.map((c: unknown) => {
        if (c && typeof c === "object" && "name" in c) {
          const o = c as { name: string; description?: string; characterKey?: string };
          return {
            name: o.name,
            description: o.description ?? "",
            ...(o.characterKey ? { characterKey: o.characterKey } : {}),
          };
        }
        return { name: String(c), description: "" };
      })
    : [];

  return {
    arcName: state.arcName,
    currentState: state.currentState,
    recurringCharacters,
    activeThemes: state.activeThemes,
  };
}
