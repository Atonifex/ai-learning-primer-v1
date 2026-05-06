import { prisma } from "../db/prisma";
import { getSignedSceneUrl, isSceneStorageConfigured } from "../storage/sceneImages";
import type { BranchPointUi } from "../types";
import { createChapterInArc } from "./storyCurriculum";
import { completeSession } from "./session";
import { getOrCreateDefaultSubject } from "./subjects";

export async function getPendingBranchForChapter(
  chapterId: string
): Promise<BranchPointUi | null> {
  const bp = await prisma.branchPoint.findFirst({
    where: { chapterId, resolvedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      options: { orderBy: { orderIndex: "asc" } },
    },
  });
  if (!bp?.options.length) return null;

  const options = await Promise.all(
    bp.options.map(async (o) => {
      let imageUrl = o.imageUrl;
      if (o.imageStoragePath && isSceneStorageConfigured()) {
        const signed = await getSignedSceneUrl(o.imageStoragePath, 3600);
        if (signed) imageUrl = signed;
      }
      return {
        id: o.id,
        orderIndex: o.orderIndex,
        title: o.title,
        teaser: o.teaser,
        imageUrl,
      };
    })
  );

  return {
    id: bp.id,
    promptText: bp.promptText,
    options,
  };
}

/**
 * Learner chose a branch: resolve branch, ensure target chapter, open new session, complete old session.
 */
export async function applyBranchSelection(params: {
  learnerProfileId: string;
  sessionId: string;
  branchOptionId: string;
}): Promise<{ nextSessionId: string }> {
  const { learnerProfileId, sessionId, branchOptionId } = params;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { id: true, chapterId: true, learnerProfileId: true },
  });
  if (!session || session.learnerProfileId !== learnerProfileId) {
    throw new Error("Session not found");
  }
  if (!session.chapterId) throw new Error("Session has no chapter");

  const option = await prisma.branchOption.findUnique({
    where: { id: branchOptionId },
    include: {
      branchPoint: {
        include: { chapter: { select: { id: true, storyArcId: true } } },
      },
    },
  });
  if (!option || option.branchPoint.chapterId !== session.chapterId) {
    throw new Error("Invalid branch option");
  }
  if (option.branchPoint.resolvedAt) {
    throw new Error("Branch already resolved");
  }

  let nextChapterId = option.nextChapterId;
  if (!nextChapterId) {
    const created = await createChapterInArc(option.branchPoint.chapter.storyArcId, option.title, {
      status: "ACTIVE",
    });
    nextChapterId = created.id;
    await prisma.branchOption.update({
      where: { id: option.id },
      data: { nextChapterId },
    });
  }

  await prisma.branchPoint.update({
    where: { id: option.branchPointId },
    data: { resolvedAt: new Date() },
  });

  await prisma.chapter.update({
    where: { id: session.chapterId },
    data: { status: "COMPLETED" },
  });

  await completeSession(sessionId, `Branch: ${option.title}`);

  const existing = await prisma.session.findFirst({
    where: {
      learnerProfileId,
      chapterId: nextChapterId,
      status: "ACTIVE",
    },
  });
  if (existing) {
    return { nextSessionId: existing.id };
  }

  const lang = await prisma.learnerProfile.findUnique({
    where: { id: learnerProfileId },
    select: { activeLanguage: true },
  });
  if (!lang) throw new Error("Profile not found");
  const subject = await getOrCreateDefaultSubject();

  const next = await prisma.session.create({
    data: {
      learnerProfileId,
      subjectId: subject.id,
      targetLanguage: lang.activeLanguage,
      status: "ACTIVE",
      chapterId: nextChapterId,
      sceneIndex: 0,
    },
  });

  return { nextSessionId: next.id };
}

/** Dev/demo: attach a pending branch with 3 text options (no images) if chapter has none. */
export async function seedDemoBranchIfRequested(chapterId: string): Promise<void> {
  if (process.env.PRIMER_SEED_BRANCH !== "1") return;

  const existing = await prisma.branchPoint.findFirst({
    where: { chapterId, resolvedAt: null },
  });
  if (existing) return;

  const bp = await prisma.branchPoint.create({
    data: {
      chapterId,
      promptText: "Where should the story go next?",
    },
  });

  const seeds = [
    { title: "Follow the harbor lead", teaser: "Investigate the docks before dawn." },
    { title: "Return to the academy", teaser: "Your mentor may know more." },
    { title: "Take the road inland", teaser: "A quieter path — with new risks." },
  ];

  for (let i = 0; i < seeds.length; i++) {
    await prisma.branchOption.create({
      data: {
        branchPointId: bp.id,
        orderIndex: i,
        title: seeds[i].title,
        teaser: seeds[i].teaser,
      },
    });
  }
}
