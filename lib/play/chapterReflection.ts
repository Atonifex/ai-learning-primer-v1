import { prisma } from "../db/prisma";
import { stampActivityClock } from "../services/timeTracking";

/** Chapter 1 crew log from the activity bank (A7 / E5). */
export const CHAPTER_REFLECTION_SLUG = "g3-reflect-u1-ch1";

export type ChapterReflectionPublic = {
  completionId: string;
  title: string;
  prompt: string;
  alreadyCompleted: boolean;
  priorText: string | null;
};

const IN_WORLD_PROMPT =
  "The engineer is still missing. Leave her a short note — talk or type a little — so she can follow the crate counts when she arrives. What did we learn about writing numbers so another scout can read them?";

async function loadReflectionActivity() {
  const activity = await prisma.learningActivity.findUnique({
    where: { slug: CHAPTER_REFLECTION_SLUG },
  });
  if (!activity) {
    throw new Error(
      `Chapter reflection "${CHAPTER_REFLECTION_SLUG}" is not seeded. Run \`npm run db:seed\`.`
    );
  }
  return activity;
}

export async function hasCompletedChapterReflection(
  learnerProfileId: string
): Promise<boolean> {
  const activity = await prisma.learningActivity.findUnique({
    where: { slug: CHAPTER_REFLECTION_SLUG },
    select: { id: true },
  });
  if (!activity) return false;
  const done = await prisma.learningActivityCompletion.findFirst({
    where: {
      learnerProfileId,
      learningActivityId: activity.id,
      completedAt: { not: null },
    },
    select: { id: true },
  });
  return Boolean(done);
}

export async function startChapterReflection(params: {
  learnerProfileId: string;
  sessionId: string;
}): Promise<ChapterReflectionPublic> {
  const activity = await loadReflectionActivity();

  const done = await prisma.learningActivityCompletion.findFirst({
    where: {
      learnerProfileId: params.learnerProfileId,
      learningActivityId: activity.id,
      completedAt: { not: null },
    },
    orderBy: { completedAt: "desc" },
  });
  if (done) {
    return {
      completionId: done.id,
      title: activity.displayName,
      prompt: IN_WORLD_PROMPT,
      alreadyCompleted: true,
      priorText: done.responseText,
    };
  }

  let open = await prisma.learningActivityCompletion.findFirst({
    where: {
      learnerProfileId: params.learnerProfileId,
      learningActivityId: activity.id,
      completedAt: null,
    },
    orderBy: { startedAt: "desc" },
  });
  if (!open) {
    open = await prisma.learningActivityCompletion.create({
      data: {
        learnerProfileId: params.learnerProfileId,
        learningActivityId: activity.id,
        sessionId: params.sessionId,
      },
    });
  } else if (!open.sessionId) {
    open = await prisma.learningActivityCompletion.update({
      where: { id: open.id },
      data: { sessionId: params.sessionId },
    });
  }

  return {
    completionId: open.id,
    title: activity.displayName,
    prompt: IN_WORLD_PROMPT,
    alreadyCompleted: false,
    priorText: null,
  };
}

export async function submitChapterReflection(params: {
  sessionId: string;
  learnerProfileId: string;
  completionId: string;
  text: string;
}): Promise<{ text: string }> {
  const activity = await loadReflectionActivity();
  const completion = await prisma.learningActivityCompletion.findUnique({
    where: { id: params.completionId },
  });
  if (!completion || completion.learnerProfileId !== params.learnerProfileId) {
    throw new Error("Crew log not found");
  }
  if (completion.learningActivityId !== activity.id) {
    throw new Error("This is not the chapter crew log");
  }
  if (completion.completedAt) {
    throw new Error("Crew log already saved");
  }

  const text = params.text.trim();
  if (text.length < 2) {
    throw new Error("Say or type a little more so the engineer can follow it.");
  }

  await stampActivityClock({
    completionId: completion.id,
    extra: {
      sessionId: params.sessionId,
      responseText: text,
      evidenceWritten: false,
    },
  });

  await prisma.memoryItem.create({
    data: {
      learnerProfileId: params.learnerProfileId,
      type: "STORY_BEAT",
      content: `Chapter 1 crew log for the missing engineer: ${text}`,
      confidence: 0.9,
      sourceSessionId: params.sessionId,
    },
  });

  const { completeActiveChapterAndActivateNext } = await import(
    "../services/storyCurriculum"
  );
  const advanced = await completeActiveChapterAndActivateNext(params.learnerProfileId);
  if (advanced?.nextTitle) {
    await prisma.memoryItem.create({
      data: {
        learnerProfileId: params.learnerProfileId,
        type: "STORY_BEAT",
        content: `Chapter closed: ${advanced.completedTitle}. Next: ${advanced.nextTitle} (food / divide supplies).`,
        confidence: 0.85,
        sourceSessionId: params.sessionId,
      },
    });
  }

  return { text };
}
