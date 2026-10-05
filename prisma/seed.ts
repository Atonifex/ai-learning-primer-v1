import "dotenv/config";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db/prisma";
import { standardsMathGrade3 } from "../curriculum_resources/standards_math_grade3";
import { standardsElaGrade3 } from "../curriculum_resources/standards_ela_grade3";
import { standardsScienceGrade3 } from "../curriculum_resources/standards_science_grade3";
import { standardsSocialStudiesGrade3 } from "../curriculum_resources/standards_social_studies_grade3";
import { standardsMathGrade4 } from "../curriculum_resources/standards_math_grade4";
import { standardsElaGrade4 } from "../curriculum_resources/standards_ela_grade4";
import { standardsScienceGrade4 } from "../curriculum_resources/standards_science_grade4";
import { standardsSocialStudiesGrade4 } from "../curriculum_resources/standards_social_studies_grade4";
import { skillsGrade3 } from "./seeds/skills_grade3";
import { grade3LearningActivitySeeds } from "./seeds/activities/from_grade3_bank";
import type { SubjectSeed } from "./seeds/types";
import { getProfile } from "../lib/services/profile";
import { syncWreckAndFoodChaptersForLearner } from "../lib/services/storyCurriculum";
import {
  addCaptain,
  ensureParentHousehold,
  listHouseholdCaptains,
} from "../lib/services/household";
import {
  TEST_CAPTAIN_PIN,
  TEST_CAPTAIN_USERNAME,
  TEST_PARENT_EMAIL,
  TEST_PARENT_PASSWORD,
} from "../lib/play/testCaptain";
import bcrypt from "bcryptjs";

const asJson = (value: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined =>
  value == null ? undefined : (value as Prisma.InputJsonValue);

/** §4.6 tonight teaching slice — activity links must never silently skip these. */
const SECTION_46_CODES = new Set([
  "MA.3.NSO.1.1",
  "MA.3.NSO.1.2",
  "MA.3.NSO.1.3",
  "MA.3.NSO.2.1",
  "MA.3.NSO.2.2",
  "MA.3.NSO.2.3",
  "MA.3.AR.3.1",
  "MA.3.GR.2.1",
  "MA.3.DP.1.1",
  "MA.3.M.1.1",
  "ELA.3.R.2.1",
  "ELA.3.R.2.2",
  "ELA.3.R.2.3",
  "ELA.3.R.3.2",
  "ELA.3.C.1.2",
  "ELA.3.C.1.3",
  "ELA.3.C.1.4",
  "ELA.3.C.2.1",
  "ELA.3.V.1.3",
  "ELA.3.F.1.4",
  "SC.3.N.1.1",
  "SC.3.N.1.3",
  "SC.3.N.1.6",
  "SC.3.N.1.7",
  "SC.3.E.6.1",
  "SC.3.P.8.1",
  "SC.3.P.8.3",
  "SC.3.L.14.1",
  "SC.3.L.15.1",
  "SC.3.L.17.2",
  "SS.3.A.1.1",
  "SS.3.A.1.2",
  "SS.3.A.1.3",
  "SS.3.G.1.1",
  "SS.3.G.1.2",
  "SS.3.G.1.4",
  "SS.3.G.1.6",
  "SS.3.E.1.1",
  "SS.3.E.1.3",
  "SS.3.CG.2.1",
]);

const subjectSeeds: SubjectSeed[] = [
  standardsMathGrade3,
  standardsElaGrade3,
  standardsScienceGrade3,
  standardsSocialStudiesGrade3,
  standardsMathGrade4,
  standardsElaGrade4,
  standardsScienceGrade4,
  standardsSocialStudiesGrade4,
];

async function upsertSubjectCatalog(seed: SubjectSeed): Promise<Map<string, string>> {
  const subject = await prisma.subject.upsert({
    where: { slug: seed.slug },
    update: {
      domain: seed.domain,
      gradeBand: seed.gradeBand,
      framework: seed.framework,
      displayName: seed.displayName,
      targetLanguage: seed.targetLanguage,
    },
    create: {
      slug: seed.slug,
      domain: seed.domain,
      gradeBand: seed.gradeBand,
      framework: seed.framework,
      displayName: seed.displayName,
      targetLanguage: seed.targetLanguage,
    },
  });

  const catalog = await prisma.standardsCatalog.upsert({
    where: { subjectId_version: { subjectId: subject.id, version: seed.catalog.version } },
    update: { label: seed.catalog.label, framework: seed.catalog.framework },
    create: {
      subjectId: subject.id,
      version: seed.catalog.version,
      label: seed.catalog.label,
      framework: seed.catalog.framework,
    },
  });

  const standardCodeToId = new Map<string, string>();

  for (const strandSeed of seed.catalog.strands) {
    const strand = await prisma.strand.upsert({
      where: { catalogId_code: { catalogId: catalog.id, code: strandSeed.code } },
      update: {
        displayName: strandSeed.displayName,
        description: strandSeed.description,
      },
      create: {
        catalogId: catalog.id,
        code: strandSeed.code,
        displayName: strandSeed.displayName,
        description: strandSeed.description,
      },
    });

    for (const groupSeed of strandSeed.groups) {
      const group = await prisma.standardGroup.upsert({
        where: { strandId_code: { strandId: strand.id, code: groupSeed.code } },
        update: {
          displayName: groupSeed.displayName,
          purpose: groupSeed.purpose,
          bigIdeaSummary: groupSeed.bigIdeaSummary,
        },
        create: {
          strandId: strand.id,
          code: groupSeed.code,
          displayName: groupSeed.displayName,
          purpose: groupSeed.purpose,
          bigIdeaSummary: groupSeed.bigIdeaSummary,
        },
      });

      for (const standardSeed of groupSeed.standards) {
        const standard = await prisma.standard.upsert({
          where: { catalogId_code: { catalogId: catalog.id, code: standardSeed.code } },
          update: {
            standardGroupId: group.id,
            description: standardSeed.description,
            examples: asJson(standardSeed.examples),
            clarifications: asJson(standardSeed.clarifications),
            purposeAndStrategies: standardSeed.purposeAndStrategies,
            commonMisconceptions: standardSeed.commonMisconceptions,
            glossaryTerms: standardSeed.glossaryTerms ?? [],
            verticalAlignment: asJson(standardSeed.verticalAlignment),
            accessPoints: asJson(standardSeed.accessPoints),
            contentComplexity: standardSeed.contentComplexity,
            verificationStatus: standardSeed.verificationStatus,
            sourceUrl: standardSeed.sourceUrl,
            primerNotes: asJson(standardSeed.primerNotes),
          },
          create: {
            catalogId: catalog.id,
            standardGroupId: group.id,
            code: standardSeed.code,
            description: standardSeed.description,
            examples: asJson(standardSeed.examples),
            clarifications: asJson(standardSeed.clarifications),
            purposeAndStrategies: standardSeed.purposeAndStrategies,
            commonMisconceptions: standardSeed.commonMisconceptions,
            glossaryTerms: standardSeed.glossaryTerms ?? [],
            verticalAlignment: asJson(standardSeed.verticalAlignment),
            accessPoints: asJson(standardSeed.accessPoints),
            contentComplexity: standardSeed.contentComplexity,
            verificationStatus: standardSeed.verificationStatus,
            sourceUrl: standardSeed.sourceUrl,
            primerNotes: asJson(standardSeed.primerNotes),
          },
        });

        standardCodeToId.set(standard.code, standard.id);
      }
    }
  }

  return standardCodeToId;
}

async function upsertSkills(standardCodeToId: Map<string, string>): Promise<void> {
  for (const skillSeed of skillsGrade3) {
    const skill = await prisma.skill.upsert({
      where: { slug: skillSeed.slug },
      update: {
        displayName: skillSeed.displayName,
        description: skillSeed.description,
        subjectScope: skillSeed.subjectScope,
      },
      create: {
        slug: skillSeed.slug,
        displayName: skillSeed.displayName,
        description: skillSeed.description,
        subjectScope: skillSeed.subjectScope,
      },
    });

    for (const link of skillSeed.links) {
      const standardId = standardCodeToId.get(link.standardCode);
      if (!standardId) {
        throw new Error(`Missing standard for skill link: ${skillSeed.slug} -> ${link.standardCode}`);
      }

      await prisma.skillStandardLink.upsert({
        where: { skillId_standardId: { skillId: skill.id, standardId } },
        update: { weight: link.weight ?? 1, notes: link.notes },
        create: {
          skillId: skill.id,
          standardId,
          weight: link.weight ?? 1,
          notes: link.notes,
        },
      });
    }
  }
}

async function upsertLearningActivities(
  standardCodeToId: Map<string, string>,
): Promise<void> {
  const subjects = await prisma.subject.findMany({
    where: { slug: { in: ["math_g3", "ela_g3", "science_g3", "social_studies_g3"] } },
    select: { id: true, slug: true },
  });
  const subjectIdBySlug = new Map(subjects.map((s) => [s.slug, s.id]));

  let linked = 0;
  for (const seed of grade3LearningActivitySeeds) {
    const subjectId = subjectIdBySlug.get(seed.subjectSlug);
    if (!subjectId) {
      throw new Error(`Missing subject for activity ${seed.slug}: ${seed.subjectSlug}`);
    }

    const activity = await prisma.learningActivity.upsert({
      where: { slug: seed.slug },
      update: {
        displayName: seed.displayName,
        kind: seed.kind,
        subjectId,
        description: seed.description,
        estimatedMinutes: seed.estimatedMinutes ?? null,
        narrativeContext: seed.narrativeContext,
        authoring: seed.authoring,
        content: asJson(seed.content),
      },
      create: {
        slug: seed.slug,
        displayName: seed.displayName,
        kind: seed.kind,
        subjectId,
        description: seed.description,
        estimatedMinutes: seed.estimatedMinutes ?? null,
        narrativeContext: seed.narrativeContext,
        authoring: seed.authoring,
        content: asJson(seed.content),
      },
    });

    for (const code of seed.targetStandardCodes) {
      const standardId = standardCodeToId.get(code);
      if (!standardId) {
        throw new Error(
          `Missing Standard row for activity link ${seed.slug} -> ${code}` +
            (SECTION_46_CODES.has(code) ? " (§4.6 code — must not skip)" : ""),
        );
      }
      await prisma.learningActivityStandardLink.upsert({
        where: {
          learningActivityId_standardId: {
            learningActivityId: activity.id,
            standardId,
          },
        },
        update: {},
        create: {
          learningActivityId: activity.id,
          standardId,
        },
      });
      linked += 1;
    }
  }

  console.log(
    `Seeded ${grade3LearningActivitySeeds.length} LearningActivity rows with ${linked} standard links.`,
  );
}

async function ensureTestCaptainWithWreckFood(): Promise<void> {
  let parent = await prisma.user.findUnique({ where: { email: TEST_PARENT_EMAIL } });
  if (!parent) {
    const passwordHash = await bcrypt.hash(TEST_PARENT_PASSWORD, 12);
    parent = await prisma.user.create({
      data: {
        email: TEST_PARENT_EMAIL,
        passwordHash,
        role: "PARENT",
      },
    });
  }
  await ensureParentHousehold(parent.id);

  const captains = await listHouseholdCaptains(parent.id);
  let childUserId = captains.find((c) => c.username === TEST_CAPTAIN_USERNAME)?.userId;
  if (!childUserId) {
    const existingChild = await prisma.user.findUnique({
      where: { username: TEST_CAPTAIN_USERNAME },
    });
    if (existingChild) {
      childUserId = existingChild.id;
    } else {
      const { child } = await addCaptain({
        parentUserId: parent.id,
        username: TEST_CAPTAIN_USERNAME,
        pin: TEST_CAPTAIN_PIN,
        gradeBand: "3",
        displayName: "Test Captain",
      });
      childUserId = child.id;
    }
  }

  await prisma.learnerProfile.updateMany({
    where: { userId: childUserId },
    data: { firstRunStep: "complete", displayName: "Test Captain" },
  });

  const profile = await getProfile(childUserId);
  if (!profile) {
    throw new Error("Seed: test captain profile missing");
  }

  const { updated } = await syncWreckAndFoodChaptersForLearner(profile.id);
  console.log(
    `Test household ${TEST_PARENT_EMAIL} / captain ${TEST_CAPTAIN_USERNAME} (${profile.id}): synced ${updated} wreck+food chapters. PIN ${TEST_CAPTAIN_PIN}. Parent password ${TEST_PARENT_PASSWORD}.`,
  );
}

async function smokeCheckActivityLinks(standardCodeToId: Map<string, string>): Promise<void> {
  const mathCode = "MA.3.NSO.1.1";
  const standardId = standardCodeToId.get(mathCode);
  if (!standardId) throw new Error(`Smoke: missing ${mathCode} in seed map`);

  const linked = await prisma.learningActivityStandardLink.findFirst({
    where: { standardId },
    include: { learningActivity: { select: { slug: true } }, standard: { select: { code: true } } },
  });
  if (!linked) {
    throw new Error(`Smoke: no LearningActivity linked to §4.6 math code ${mathCode}`);
  }
  console.log(`Smoke: activity ${linked.learningActivity.slug} ↔ ${linked.standard.code}`);

  const testUser = await prisma.user.findUnique({
    where: { username: TEST_CAPTAIN_USERNAME },
    include: {
      learnerProfile: {
        include: {
          storyWorld: {
            include: {
              storyArcs: {
                where: { status: "ACTIVE" },
                take: 1,
                include: {
                  chapters: { orderBy: { orderIndex: "asc" }, take: 2 },
                },
              },
            },
          },
        },
      },
    },
  });
  const chapters = testUser?.learnerProfile?.storyWorld?.storyArcs[0]?.chapters ?? [];
  if (chapters.length < 2) {
    throw new Error("Smoke: test learner missing wreck+food chapters");
  }
  for (const ch of chapters) {
    const planner = ch.plannerJson as { subjectPlans?: Record<string, { targetStandardCodes?: string[] }> } | null;
    const mathTargets = planner?.subjectPlans?.math_g3?.targetStandardCodes ?? [];
    if (mathTargets.length === 0) {
      throw new Error(`Smoke: chapter "${ch.title}" missing math_g3 targetStandardCodes`);
    }
  }
  console.log(
    `Smoke: chapters OK — "${chapters[0].title}", "${chapters[1].title}"`,
  );
}

async function main(): Promise<void> {
  const standardCodeToId = new Map<string, string>();
  for (const subjectSeed of subjectSeeds) {
    const localMap = await upsertSubjectCatalog(subjectSeed);
    for (const [code, id] of localMap) standardCodeToId.set(code, id);
  }
  console.log(
    `Seeded ${standardCodeToId.size} standards across ${subjectSeeds.length} subjects (G3 + G4 catalogs).`,
  );
  await upsertSkills(standardCodeToId);
  await upsertLearningActivities(standardCodeToId);
  await ensureTestCaptainWithWreckFood();
  await smokeCheckActivityLinks(standardCodeToId);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
