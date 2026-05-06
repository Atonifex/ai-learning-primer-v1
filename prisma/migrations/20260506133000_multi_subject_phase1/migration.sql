-- CreateEnum
CREATE TYPE "SubjectDomain" AS ENUM ('MATH', 'ELA', 'SCIENCE', 'SOCIAL_STUDIES', 'WORLD_LANGUAGE');

-- CreateEnum
CREATE TYPE "LearnerSubjectStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "AggregationStrategy" AS ENUM ('WEIGHTED_MEAN', 'MIN_OF_LINKS', 'BAYESIAN');

-- CreateEnum
CREATE TYPE "EvidenceSourceType" AS ENUM ('CONVERSATIONAL', 'ACTIVITY', 'ASSESSMENT');

-- CreateEnum
CREATE TYPE "EvidenceTier" AS ENUM ('CONVERSATIONAL', 'GUIDED', 'CHECKPOINT');

-- CreateEnum
CREATE TYPE "ActivityKind" AS ENUM ('READING', 'INTERACTIVE_GAME', 'MINI_QUIZ', 'CHALLENGE', 'STORY_SCENE', 'JOURNAL_PROMPT');

-- CreateEnum
CREATE TYPE "ActivityAuthoring" AS ENUM ('AI_GENERATED', 'HAND_AUTHORED', 'TEMPLATE');

-- CreateEnum
CREATE TYPE "AssessmentFormat" AS ENUM ('MULTIPLE_CHOICE', 'SHORT_ANSWER', 'MIXED');

-- DropForeignKey
ALTER TABLE "ConceptLedgerEvent" DROP CONSTRAINT "ConceptLedgerEvent_conceptNodeId_fkey";

-- DropForeignKey
ALTER TABLE "ConceptLedgerEvent" DROP CONSTRAINT "ConceptLedgerEvent_learnerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "ConceptLedgerEvent" DROP CONSTRAINT "ConceptLedgerEvent_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "ConceptNode" DROP CONSTRAINT "ConceptNode_curriculumVersionId_fkey";

-- DropForeignKey
ALTER TABLE "SkillProgress" DROP CONSTRAINT "SkillProgress_learnerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "StoryArc" DROP CONSTRAINT "StoryArc_curriculumVersionId_fkey";

-- DropIndex
DROP INDEX "SkillProgress_learnerProfileId_skillName_language_key";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN "subjectId" TEXT,
ADD COLUMN     "targetLanguage" "Language";

-- AlterTable
ALTER TABLE "SkillProgress" ADD COLUMN "evidenceCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "mastery" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "skillId" TEXT;

-- AlterTable
ALTER TABLE "StoryArc" DROP COLUMN "curriculumVersionId",
ADD COLUMN     "standardsCatalogId" TEXT;

-- DropTable
DROP TABLE "ConceptLedgerEvent";

-- DropTable
DROP TABLE "ConceptNode";

-- DropTable
DROP TABLE "CurriculumVersion";

-- DropEnum
DROP TYPE "ConceptLedgerEventType";

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" "SubjectDomain" NOT NULL,
    "gradeBand" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "targetLanguage" "Language",
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnerSubject" (
    "id" TEXT NOT NULL,
    "learnerProfileId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "status" "LearnerSubjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearnerSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandardsCatalog" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandardsCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Strand" (
    "id" TEXT NOT NULL,
    "catalogId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Strand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandardGroup" (
    "id" TEXT NOT NULL,
    "strandId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "purpose" TEXT,
    "bigIdeaSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandardGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Standard" (
    "id" TEXT NOT NULL,
    "catalogId" TEXT NOT NULL,
    "standardGroupId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "examples" JSONB,
    "clarifications" JSONB,
    "purposeAndStrategies" TEXT,
    "commonMisconceptions" TEXT,
    "glossaryTerms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "verticalAlignment" JSONB,
    "accessPoints" JSONB,
    "contentComplexity" TEXT,
    "verificationStatus" TEXT,
    "sourceUrl" TEXT,
    "primerNotes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Standard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subjectScope" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "aggregationStrategy" "AggregationStrategy" NOT NULL DEFAULT 'WEIGHTED_MEAN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillStandardLink" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "notes" TEXT,

    CONSTRAINT "SkillStandardLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandardsProgress" (
    "id" TEXT NOT NULL,
    "learnerProfileId" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,
    "mastery" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "evidenceCount" INTEGER NOT NULL DEFAULT 0,
    "lastObservedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastDemonstratedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),

    CONSTRAINT "StandardsProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandardsEvidence" (
    "id" TEXT NOT NULL,
    "learnerProfileId" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,
    "sourceType" "EvidenceSourceType" NOT NULL,
    "sourceId" TEXT,
    "sessionId" TEXT,
    "messageId" TEXT,
    "evidenceTier" "EvidenceTier" NOT NULL,
    "correctness" DOUBLE PRECISION,
    "hintsUsed" INTEGER,
    "difficulty" DOUBLE PRECISION,
    "rubricMatches" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StandardsEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningActivity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "kind" "ActivityKind" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedMinutes" INTEGER,
    "difficulty" INTEGER,
    "content" JSONB,
    "narrativeContext" TEXT,
    "authoring" "ActivityAuthoring" NOT NULL DEFAULT 'AI_GENERATED',
    "generatedFromSessionId" TEXT,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningActivityStandardLink" (
    "id" TEXT NOT NULL,
    "learningActivityId" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,

    CONSTRAINT "LearningActivityStandardLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningActivityCompletion" (
    "id" TEXT NOT NULL,
    "learnerProfileId" TEXT NOT NULL,
    "learningActivityId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "score" DOUBLE PRECISION,
    "perStandardCorrectness" JSONB,
    "evidenceWritten" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LearningActivityCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "format" "AssessmentFormat" NOT NULL,
    "items" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentStandardLink" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,

    CONSTRAINT "AssessmentStandardLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentResult" (
    "id" TEXT NOT NULL,
    "learnerProfileId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "total" DOUBLE PRECISION,
    "perStandardScores" JSONB,
    "itemResults" JSONB,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subject_slug_key" ON "Subject"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LearnerSubject_learnerProfileId_subjectId_key" ON "LearnerSubject"("learnerProfileId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "StandardsCatalog_subjectId_version_key" ON "StandardsCatalog"("subjectId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Strand_catalogId_code_key" ON "Strand"("catalogId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "StandardGroup_strandId_code_key" ON "StandardGroup"("strandId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Standard_catalogId_code_key" ON "Standard"("catalogId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SkillStandardLink_skillId_standardId_key" ON "SkillStandardLink"("skillId", "standardId");

-- CreateIndex
CREATE UNIQUE INDEX "StandardsProgress_learnerProfileId_standardId_key" ON "StandardsProgress"("learnerProfileId", "standardId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningActivity_slug_key" ON "LearningActivity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LearningActivityStandardLink_learningActivityId_standardId_key" ON "LearningActivityStandardLink"("learningActivityId", "standardId");

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_slug_key" ON "Assessment"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentStandardLink_assessmentId_standardId_key" ON "AssessmentStandardLink"("assessmentId", "standardId");

-- Backfill default subject and catalog for existing rows before adding NOT NULL constraints
INSERT INTO "Subject" ("id", "slug", "domain", "gradeBand", "framework", "displayName", "createdAt", "updatedAt")
VALUES (
  'subj_default_ela_g3',
  'ela_g3',
  'ELA',
  '3',
  'FL_BEST',
  'Grade 3 English Language Arts',
  NOW(),
  NOW()
)
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "StandardsCatalog" ("id", "subjectId", "version", "label", "framework", "createdAt", "updatedAt")
VALUES (
  'catalog_default_ela_g3_v1',
  'subj_default_ela_g3',
  'v1',
  'Default Grade 3 ELA catalog',
  'FL_BEST',
  NOW(),
  NOW()
)
ON CONFLICT ("subjectId", "version") DO NOTHING;

UPDATE "Session"
SET "targetLanguage" = "language"
WHERE "targetLanguage" IS NULL;

UPDATE "Session"
SET "subjectId" = COALESCE(
  "subjectId",
  (SELECT "id" FROM "Subject" WHERE "slug" = 'ela_g3' LIMIT 1)
);

UPDATE "StoryArc"
SET "standardsCatalogId" = COALESCE(
  "standardsCatalogId",
  (SELECT sc."id"
   FROM "StandardsCatalog" sc
   JOIN "Subject" s ON s."id" = sc."subjectId"
   WHERE s."slug" = 'ela_g3' AND sc."version" = 'v1'
   LIMIT 1)
);

INSERT INTO "Skill" ("id", "slug", "displayName", "description", "subjectScope", "aggregationStrategy", "createdAt", "updatedAt")
SELECT
  'legacy_skill_' || md5("skillName"),
  regexp_replace(lower("skillName"), '[^a-z0-9]+', '_', 'g'),
  "skillName",
  'Migrated from legacy SkillProgress.skillName',
  ARRAY[]::TEXT[],
  'WEIGHTED_MEAN'::"AggregationStrategy",
  NOW(),
  NOW()
FROM "SkillProgress"
WHERE "skillName" IS NOT NULL AND length(trim("skillName")) > 0
ON CONFLICT ("slug") DO NOTHING;

UPDATE "SkillProgress" sp
SET
  "skillId" = s."id",
  "mastery" = LEAST(100, GREATEST(0, COALESCE(sp."estimatedLevel", 0) * 100)),
  "evidenceCount" = CASE WHEN sp."estimatedLevel" IS NULL THEN 0 ELSE 1 END
FROM "Skill" s
WHERE s."slug" = regexp_replace(lower(sp."skillName"), '[^a-z0-9]+', '_', 'g')
  AND sp."skillId" IS NULL;

ALTER TABLE "Session" ALTER COLUMN "subjectId" SET NOT NULL;
ALTER TABLE "StoryArc" ALTER COLUMN "standardsCatalogId" SET NOT NULL;
ALTER TABLE "SkillProgress" ALTER COLUMN "skillId" SET NOT NULL;

ALTER TABLE "Session" DROP COLUMN "language";
ALTER TABLE "SkillProgress" DROP COLUMN "estimatedLevel";
ALTER TABLE "SkillProgress" DROP COLUMN "language";
ALTER TABLE "SkillProgress" DROP COLUMN "skillName";

-- CreateIndex
CREATE UNIQUE INDEX "SkillProgress_learnerProfileId_skillId_key" ON "SkillProgress"("learnerProfileId", "skillId");

-- AddForeignKey
ALTER TABLE "LearnerSubject" ADD CONSTRAINT "LearnerSubject_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnerSubject" ADD CONSTRAINT "LearnerSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardsCatalog" ADD CONSTRAINT "StandardsCatalog_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Strand" ADD CONSTRAINT "Strand_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "StandardsCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardGroup" ADD CONSTRAINT "StandardGroup_strandId_fkey" FOREIGN KEY ("strandId") REFERENCES "Strand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Standard" ADD CONSTRAINT "Standard_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "StandardsCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Standard" ADD CONSTRAINT "Standard_standardGroupId_fkey" FOREIGN KEY ("standardGroupId") REFERENCES "StandardGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryArc" ADD CONSTRAINT "StoryArc_standardsCatalogId_fkey" FOREIGN KEY ("standardsCatalogId") REFERENCES "StandardsCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillStandardLink" ADD CONSTRAINT "SkillStandardLink_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillStandardLink" ADD CONSTRAINT "SkillStandardLink_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillProgress" ADD CONSTRAINT "SkillProgress_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillProgress" ADD CONSTRAINT "SkillProgress_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardsProgress" ADD CONSTRAINT "StandardsProgress_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardsProgress" ADD CONSTRAINT "StandardsProgress_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardsEvidence" ADD CONSTRAINT "StandardsEvidence_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardsEvidence" ADD CONSTRAINT "StandardsEvidence_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardsEvidence" ADD CONSTRAINT "StandardsEvidence_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningActivity" ADD CONSTRAINT "LearningActivity_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningActivityStandardLink" ADD CONSTRAINT "LearningActivityStandardLink_learningActivityId_fkey" FOREIGN KEY ("learningActivityId") REFERENCES "LearningActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningActivityStandardLink" ADD CONSTRAINT "LearningActivityStandardLink_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningActivityCompletion" ADD CONSTRAINT "LearningActivityCompletion_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningActivityCompletion" ADD CONSTRAINT "LearningActivityCompletion_learningActivityId_fkey" FOREIGN KEY ("learningActivityId") REFERENCES "LearningActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentStandardLink" ADD CONSTRAINT "AssessmentStandardLink_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentStandardLink" ADD CONSTRAINT "AssessmentStandardLink_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
