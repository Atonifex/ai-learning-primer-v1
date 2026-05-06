/**
 * Story spine + curriculum scaffolding.
 *
 * Curriculum graph generation will later consume standards/syllabus inputs; store references in
 * `CurriculumVersion.sourceNotes` and keep arcs pinned to a frozen version. See docs/roadmap-post-v1.md.
 */

//4/7/2026: ****SUPER IMPORTANT*** IVAN MUST COME BACK HERE AND ITERATE ON THIS!

import { prisma } from "../db/prisma";
import { generateArcFocusTags, refineChapterFocusTags } from "../story/focusTags";
import type { Language } from "../types";
import { getOrCreateDefaultCatalog } from "./subjects";

export async function ensureLearnerStoryChain(profileId: string): Promise<{ chapterId: string }> {
  const profile = await prisma.learnerProfile.findUniqueOrThrow({
    where: { id: profileId },
  });

  let world = await prisma.storyWorld.findUnique({
    where: { learnerProfileId: profileId },
  });
  if (!world) {
    world = await prisma.storyWorld.create({
      data: {
        learnerProfileId: profileId,
        title: "Your learning journey",
        bible: "",
      },
    });
  }

  let arc = await prisma.storyArc.findFirst({
    where: { storyWorldId: world.id, status: "ACTIVE" },
    orderBy: { orderIndex: "desc" },
  });

  if (!arc) {
    const catalog = await getOrCreateDefaultCatalog();
    const arcTags = generateArcFocusTags({
      language: profile.activeLanguage as Language,
      goals: profile.goals,
      interests: profile.interests,
    });
    arc = await prisma.storyArc.create({
      data: {
        storyWorldId: world.id,
        standardsCatalogId: catalog.id,
        title: "Opening arc",
        summary: null,
        focusTags: arcTags,
        status: "ACTIVE",
        orderIndex: 0,
      },
    });
    const chapterTags = refineChapterFocusTags(arcTags, 0, "Chapter 1");
    await prisma.chapter.create({
      data: {
        storyArcId: arc.id,
        title: "Chapter 1",
        orderIndex: 0,
        focusTags: chapterTags,
        status: "ACTIVE",
      },
    });
  }

  const activeChapter = await prisma.chapter.findFirst({
    where: { storyArcId: arc.id, status: "ACTIVE" },
    orderBy: { orderIndex: "asc" },
  });

  if (!activeChapter) {
    const count = await prisma.chapter.count({ where: { storyArcId: arc.id } });
    const title = `Chapter ${count + 1}`;
    const chapterTags = refineChapterFocusTags(arc.focusTags, count, title);
    const created = await prisma.chapter.create({
      data: {
        storyArcId: arc.id,
        title,
        orderIndex: count,
        focusTags: chapterTags,
        status: "ACTIVE",
      },
    });
    return { chapterId: created.id };
  }

  return { chapterId: activeChapter.id };
}

/**
 * Create a new chapter under an arc; `focusTags` are refined from the arc’s tags (call when “chapter is generated”).
 */
export async function createChapterInArc(
  storyArcId: string,
  title: string,
  opts?: { status?: "PLANNED" | "ACTIVE" }
): Promise<{ id: string }> {
  const arc = await prisma.storyArc.findUniqueOrThrow({
    where: { id: storyArcId },
  });
  const count = await prisma.chapter.count({ where: { storyArcId } });
  const focusTags = refineChapterFocusTags(arc.focusTags, count, title);
  const chapter = await prisma.chapter.create({
    data: {
      storyArcId,
      title,
      orderIndex: count,
      focusTags,
      status: opts?.status ?? "ACTIVE",
    },
  });
  return { id: chapter.id };
}

/** Backfill legacy sessions that have no `chapterId`. */
export async function ensureSessionLinkedToChapter(sessionId: string): Promise<void> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { id: true, chapterId: true, learnerProfileId: true },
  });
  if (!session || session.chapterId) return;

  const { chapterId } = await ensureLearnerStoryChain(session.learnerProfileId);
  await prisma.session.update({
    where: { id: sessionId },
    data: { chapterId },
  });
}
