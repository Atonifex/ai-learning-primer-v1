import "dotenv/config";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db/prisma";
import { standardsMathGrade3 } from "./seeds/standards_math_grade3";
import { standardsElaGrade3 } from "./seeds/standards_ela_grade3";
import { standardsScienceGrade3 } from "./seeds/standards_science_grade3";
import { standardsSocialStudiesGrade3 } from "./seeds/standards_social_studies_grade3";
import { skillsGrade3 } from "./seeds/skills_grade3";
import type { SubjectSeed } from "./seeds/types";

const asJson = (value: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined =>
  value == null ? undefined : (value as Prisma.InputJsonValue);

const subjectSeeds: SubjectSeed[] = [
  standardsMathGrade3,
  standardsElaGrade3,
  standardsScienceGrade3,
  standardsSocialStudiesGrade3,
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

async function main(): Promise<void> {
  const standardCodeToId = new Map<string, string>();
  for (const subjectSeed of subjectSeeds) {
    const localMap = await upsertSubjectCatalog(subjectSeed);
    for (const [code, id] of localMap) standardCodeToId.set(code, id);
  }
  await upsertSkills(standardCodeToId);
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
