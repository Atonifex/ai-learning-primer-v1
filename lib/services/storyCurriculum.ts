/**
 * Story spine + curriculum scaffolding.
 *
 * MVP rule: ONE StoryWorld + ONE StoryArc ("The Mapmaker's Expedition") + SIX shared
 * chapters per learner. All four G3 core subjects (math/ELA/science/SS) are
 * instructional lenses on the SAME arc — the chapter progression is global.
 *
 * Subject-specific standards/activities live in `Chapter.plannerJson.subjectPlans[subjectSlug]`
 * — populated by the CurriculumService in Phase 2.
 */

import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import {
  generateArcFocusTags,
  refineChapterFocusTags,
} from "../story/focusTags";
import {
  MAPMAKERS_ARC_TITLE,
  MAPMAKERS_CHAPTERS,
  MAPMAKERS_WORLD_BIBLE,
  MAPMAKERS_WORLD_TITLE,
} from "../ai/promptTemplates/_shared_castaway_world";
import {
  getWreckAndFoodChapterTemplates,
  wreckFoodPlannerJson,
  WRECK_FOOD_CURRICULUM_IDS,
} from "./castawayChapters";

const DEFAULT_CATALOG_VERSION_BY_SLUG: Record<string, string> = {
  math_g3: "v1",
  ela_g3: "v2",
  science_g3: "v1",
  social_studies_g3: "v1",
};

/** Six-chapter spine: curriculum wreck+food planners for Ch1–Ch2, shared templates for Ch3–Ch6. */
function mapmakersChapterSpine() {
  const [wreck, food] = getWreckAndFoodChapterTemplates();
  return [wreck, food, ...MAPMAKERS_CHAPTERS.slice(2)];
}

async function resolveCatalogIdForSubject(
  subjectSlug: string
): Promise<string> {
  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
    select: { id: true },
  });
  if (!subject) {
    throw new Error(
      `Subject not seeded: ${subjectSlug}. Run \`npm run db:seed\`.`
    );
  }
  const version = DEFAULT_CATALOG_VERSION_BY_SLUG[subjectSlug];
  const catalog = await prisma.standardsCatalog.findFirst({
    where: version
      ? { subjectId: subject.id, version }
      : { subjectId: subject.id },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (!catalog) {
    throw new Error(
      `StandardsCatalog not seeded for ${subjectSlug}. Run \`npm run db:seed\`.`
    );
  }
  return catalog.id;
}

export async function ensureLearnerStoryChain(
  profileId: string
): Promise<{ chapterId: string }> {
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
        title: MAPMAKERS_WORLD_TITLE,
        bible: MAPMAKERS_WORLD_BIBLE,
      },
    });
  }

  let arc = await prisma.storyArc.findFirst({
    where: { storyWorldId: world.id, status: "ACTIVE" },
    orderBy: { orderIndex: "desc" },
  });

  if (!arc) {
    const catalogId = await resolveCatalogIdForSubject(
      profile.primarySubjectSlug
    );
    const arcTags = generateArcFocusTags({
      gradeBand: profile.gradeBand,
      primarySubjectSlug: profile.primarySubjectSlug,
      interests: profile.interests,
    });
    arc = await prisma.storyArc.create({
      data: {
        storyWorldId: world.id,
        standardsCatalogId: catalogId,
        title: MAPMAKERS_ARC_TITLE,
        summary:
          "Recover the crew, build a camp, rebuild the ship, and report back to the Cartographers' Guild.",
        focusTags: arcTags,
        status: "ACTIVE",
        orderIndex: 0,
      },
    });

    // Seed shared chapters as PLANNED; activate the first. Ch1–Ch2 planners
    // come from grade3_castaway_curriculum (wreck + food).
    const spine = mapmakersChapterSpine();
    for (let i = 0; i < spine.length; i++) {
      const tpl = spine[i];
      const chapterTags = refineChapterFocusTags(arcTags, i, tpl.title);
      const curriculumId =
        i < WRECK_FOOD_CURRICULUM_IDS.length ? WRECK_FOOD_CURRICULUM_IDS[i] : undefined;
      await prisma.chapter.create({
        data: {
          storyArcId: arc.id,
          title: tpl.title,
          orderIndex: i,
          focusTags: chapterTags,
          status: i === 0 ? "ACTIVE" : "PLANNED",
          pathAheadWhisper: tpl.pathAheadWhisper ?? null,
          plannerJson: (curriculumId
            ? wreckFoodPlannerJson(tpl, curriculumId)
            : {
                sharedBeat: tpl.sharedBeat,
                anchorQuestion: tpl.anchorQuestion,
                chapterQuestion: tpl.chapterQuestion,
                investigationQuestions: tpl.investigationQuestions,
                subjectPlans: tpl.subjectPlans,
              }) as unknown as Prisma.InputJsonValue,
        },
      });
    }
  }

  const activeChapter = await prisma.chapter.findFirst({
    where: { storyArcId: arc.id, status: "ACTIVE" },
    orderBy: { orderIndex: "asc" },
  });

  if (activeChapter) return { chapterId: activeChapter.id };

  // No active chapter — promote the next PLANNED one (chapter advancement
  // path; in MVP this happens via `advance_chapter` AI tool in Phase 2).
  const next = await prisma.chapter.findFirst({
    where: { storyArcId: arc.id, status: "PLANNED" },
    orderBy: { orderIndex: "asc" },
  });
  if (next) {
    await prisma.chapter.update({
      where: { id: next.id },
      data: { status: "ACTIVE" },
    });
    return { chapterId: next.id };
  }

  // Fallback: arc fully complete — create an overflow chapter so the session
  // can still start. This shouldn't happen in normal MVP flow.
  const count = await prisma.chapter.count({ where: { storyArcId: arc.id } });
  const overflow = await prisma.chapter.create({
    data: {
      storyArcId: arc.id,
      title: `Chapter ${count + 1}`,
      orderIndex: count,
      focusTags: refineChapterFocusTags(arc.focusTags, count, "Overflow"),
      status: "ACTIVE",
    },
  });
  return { chapterId: overflow.id };
}

/**
 * Overlay curriculum wreck + food planners onto the learner's first two chapters
 * (idempotent). Used by seed for the stable test captain and by migrations of thin planners.
 */
export async function syncWreckAndFoodChaptersForLearner(
  profileId: string,
): Promise<{ updated: number }> {
  await ensureLearnerStoryChain(profileId);
  const world = await prisma.storyWorld.findUniqueOrThrow({
    where: { learnerProfileId: profileId },
  });
  const arc = await prisma.storyArc.findFirstOrThrow({
    where: { storyWorldId: world.id, status: "ACTIVE" },
    orderBy: { orderIndex: "desc" },
  });
  const chapters = await prisma.chapter.findMany({
    where: { storyArcId: arc.id },
    orderBy: { orderIndex: "asc" },
    take: 2,
  });
  const templates = getWreckAndFoodChapterTemplates();
  let updated = 0;
  for (let i = 0; i < Math.min(chapters.length, templates.length); i++) {
    const tpl = templates[i];
    await prisma.chapter.update({
      where: { id: chapters[i].id },
      data: {
        title: tpl.title,
        pathAheadWhisper: tpl.pathAheadWhisper ?? null,
        plannerJson: wreckFoodPlannerJson(
          tpl,
          WRECK_FOOD_CURRICULUM_IDS[i],
        ) as unknown as Prisma.InputJsonValue,
      },
    });
    updated += 1;
  }
  return { updated };
}

/**
 * Create a new chapter under an arc; `focusTags` are refined from the arc's tags
 * (call when a chapter is generated mid-arc by the CurriculumService).
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

/**
 * After Ch1 reflection (or equivalent mission-set close), mark the active
 * chapter COMPLETED and promote the next PLANNED chapter (Ch2 food planners).
 */
export async function completeActiveChapterAndActivateNext(
  profileId: string
): Promise<{ completedTitle: string; nextTitle: string | null } | null> {
  const { chapterId } = await ensureLearnerStoryChain(profileId);
  const current = await prisma.chapter.findUnique({
    where: { id: chapterId },
    select: { id: true, title: true, status: true, storyArcId: true, orderIndex: true },
  });
  if (!current || current.status !== "ACTIVE") return null;
  // Reflection closes Tutorial Ch1 only — do not consume later chapters.
  if (current.orderIndex !== 0) return null;

  await prisma.chapter.update({
    where: { id: current.id },
    data: { status: "COMPLETED" },
  });

  const next = await prisma.chapter.findFirst({
    where: { storyArcId: current.storyArcId, status: "PLANNED" },
    orderBy: { orderIndex: "asc" },
  });
  if (!next) {
    return { completedTitle: current.title, nextTitle: null };
  }

  await prisma.chapter.update({
    where: { id: next.id },
    data: { status: "ACTIVE" },
  });
  await prisma.session.updateMany({
    where: { learnerProfileId: profileId, status: "ACTIVE" },
    data: { chapterId: next.id },
  });
  return { completedTitle: current.title, nextTitle: next.title };
}

/** Backfill legacy sessions that have no `chapterId`. */
export async function ensureSessionLinkedToChapter(
  sessionId: string
): Promise<void> {
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
