import { prisma } from "../db/prisma";
import type { MessageData, SessionData, Language } from "../types";

export async function startSession(profileId: string, language: Language): Promise<string> {
  const session = await prisma.session.create({
    data: {
      learnerProfileId: profileId,
      language,
      status: "ACTIVE",
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

export async function getSession(sessionId: string): Promise<SessionData | null> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      messages: { orderBy: { orderIndex: "asc" } },
    },
  });
  if (!session) return null;
  return {
    id: session.id,
    language: session.language as Language,
    status: session.status as SessionData["status"],
    arcName: session.arcName,
    startedAt: session.startedAt,
    messages: session.messages.map((m) => ({
      id: m.id,
      role: m.role as MessageData["role"],
      content: m.content,
      imageUrl: m.imageUrl,
      imagePrompt: m.imagePrompt,
      orderIndex: m.orderIndex,
      createdAt: m.createdAt,
    })),
  };
}

export async function addMessage(
  sessionId: string,
  role: "USER" | "ASSISTANT",
  content: string,
  imageUrl?: string | null,
  imagePrompt?: string | null
): Promise<MessageData> {
  const count = await prisma.message.count({ where: { sessionId } });
  const msg = await prisma.message.create({
    data: { sessionId, role, content, imageUrl, imagePrompt, orderIndex: count },
  });
  return {
    id: msg.id,
    role: msg.role as MessageData["role"],
    content: msg.content,
    imageUrl: msg.imageUrl,
    imagePrompt: msg.imagePrompt,
    orderIndex: msg.orderIndex,
    createdAt: msg.createdAt,
  };
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
    include: { messages: { orderBy: { orderIndex: "asc" } } },
    take: 50,
  });
  return sessions.map((s) => ({
    id: s.id,
    language: s.language as Language,
    status: s.status as SessionData["status"],
    arcName: s.arcName,
    startedAt: s.startedAt,
    messages: s.messages.map((m) => ({
      id: m.id,
      role: m.role as MessageData["role"],
      content: m.content,
      imageUrl: m.imageUrl,
      imagePrompt: m.imagePrompt,
      orderIndex: m.orderIndex,
      createdAt: m.createdAt,
    })),
  }));
}
