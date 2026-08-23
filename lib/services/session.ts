import { prisma } from "../db/prisma";
import type { Language, MessageData, SessionData } from "../types";
import { ensureLearnerStoryChain } from "./storyCurriculum";

/**
 * Start a session under a specific subject lens. The subject must already be
 * seeded — fail loudly otherwise so we never silently fall back to the wrong
 * standards catalog.
 *
 * `targetLanguage` is null for G3 core subjects (math/ELA/science/SS); it's
 * set only when a world-language subject is active (Phase 6).
 */
export async function startSession(
  profileId: string,
  subjectSlug: string
): Promise<string> {
  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
    select: { id: true, targetLanguage: true },
  });
  if (!subject) {
    throw new Error(
      `Subject "${subjectSlug}" is not seeded. Run \`npm run db:seed\` before starting a session.`
    );
  }

  const { chapterId } = await ensureLearnerStoryChain(profileId);

  const session = await prisma.session.create({
    data: {
      learnerProfileId: profileId,
      subjectId: subject.id,
      targetLanguage: subject.targetLanguage,
      status: "ACTIVE",
      chapterId,
      sceneIndex: 0,
    },
  });
  return session.id;
}

export async function getActiveSession(profileId: string): Promise<string | null> {
  const session = await prisma.session.findFirst({
    where: { learnerProfileId: profileId, status: "ACTIVE" },
    orderBy: { startedAt: "desc" },
  });
  return session?.id ?? null;
}

function mapSessionToData(
  session: {
    id: string;
    targetLanguage: string | null;
    subject: { slug: string };
    status: string;
    arcName: string | null;
    startedAt: Date;
    sceneIndex: number;
    messages: {
      id: string;
      role: string;
      content: string;
      imageUrl: string | null;
      imagePrompt: string | null;
      imageStoragePath: string | null;
      orderIndex: number;
      createdAt: Date;
    }[];
    chapter: null | {
      id: string;
      title: string;
      focusTags: string[];
      actCurrent: number;
      actTotal: number;
      pathAheadWhisper: string | null;
      storyArc: { id: string; title: string; focusTags: string[] };
    };
  }
): SessionData {
  return {
    id: session.id,
    language: (session.targetLanguage as Language | null) ?? null,
    subjectSlug: session.subject.slug,
    status: session.status as SessionData["status"],
    arcName: session.arcName,
    startedAt: session.startedAt,
    sceneIndex: session.sceneIndex,
    messages: session.messages.map((m) => ({
      id: m.id,
      role: m.role as MessageData["role"],
      content: m.content,
      imageUrl: m.imageUrl,
      imagePrompt: m.imagePrompt,
      imageStoragePath: m.imageStoragePath,
      orderIndex: m.orderIndex,
      createdAt: m.createdAt,
    })),
    chapter: session.chapter
      ? {
          id: session.chapter.id,
          title: session.chapter.title,
          focusTags: session.chapter.focusTags,
          actCurrent: session.chapter.actCurrent,
          actTotal: session.chapter.actTotal,
          pathAheadWhisper: session.chapter.pathAheadWhisper,
          arc: {
            id: session.chapter.storyArc.id,
            title: session.chapter.storyArc.title,
            focusTags: session.chapter.storyArc.focusTags,
          },
        }
      : null,
  };
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
  const { ensureSessionLinkedToChapter } = await import("./storyCurriculum");
  await ensureSessionLinkedToChapter(sessionId);

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      messages: { orderBy: { orderIndex: "asc" } },
      subject: { select: { slug: true } },
      chapter: {
        include: {
          storyArc: { select: { id: true, title: true, focusTags: true } },
        },
      },
    },
  });
  if (!session) return null;
  return mapSessionToData(session);
}

export async function addMessage(
  sessionId: string,
  role: "USER" | "ASSISTANT",
  content: string,
  imageUrl?: string | null,
  imagePrompt?: string | null,
  imageStoragePath?: string | null
): Promise<MessageData> {
  const count = await prisma.message.count({ where: { sessionId } });
  const msg = await prisma.message.create({
    data: {
      sessionId,
      role,
      content,
      imageUrl,
      imagePrompt,
      imageStoragePath,
      orderIndex: count,
    },
  });
  return {
    id: msg.id,
    role: msg.role as MessageData["role"],
    content: msg.content,
    imageUrl: msg.imageUrl,
    imagePrompt: msg.imagePrompt,
    imageStoragePath: msg.imageStoragePath,
    orderIndex: msg.orderIndex,
    createdAt: msg.createdAt,
  };
}

export async function updateMessageImage(
  messageId: string,
  data: { imageUrl?: string | null; imageStoragePath?: string | null }
): Promise<void> {
  await prisma.message.update({
    where: { id: messageId },
    data,
  });
}

export async function completeSession(sessionId: string, summary: string): Promise<void> {
  await prisma.session.update({
    where: { id: sessionId },
    data: { status: "COMPLETED", completedAt: new Date(), arcSummary: summary },
  });
}

export async function abandonSession(sessionId: string): Promise<void> {
  await prisma.session.update({
    where: { id: sessionId },
    data: { status: "ABANDONED" },
  });
}

export async function listSessions(profileId: string): Promise<SessionData[]> {
  const sessions = await prisma.session.findMany({
    where: { learnerProfileId: profileId },
    orderBy: { startedAt: "desc" },
    include: {
      messages: { orderBy: { orderIndex: "asc" } },
      subject: { select: { slug: true } },
      chapter: {
        include: {
          storyArc: { select: { id: true, title: true, focusTags: true } },
        },
      },
    },
    take: 50,
  });
  return sessions.map((s) => mapSessionToData(s));
}
