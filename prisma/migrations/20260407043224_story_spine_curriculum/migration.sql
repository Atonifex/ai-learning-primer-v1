-- CreateEnum
CREATE TYPE "StoryArcStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "ChapterStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'ABANDONED_HANDOFF');

-- CreateEnum
CREATE TYPE "ConceptLedgerEventType" AS ENUM ('INTRODUCED', 'REINFORCED', 'APPLIED');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "chapterId" TEXT,
ADD COLUMN     "sceneIndex" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "StoryWorld" (
    "id" TEXT NOT NULL,
    "learnerProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Your story',
    "bible" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryWorld_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumVersion" (
    "id" TEXT NOT NULL,
    "label" TEXT,
    "sourceNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurriculumVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptNode" (
    "id" TEXT NOT NULL,
    "curriculumVersionId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "parentId" TEXT,
    "metadata" JSONB,

    CONSTRAINT "ConceptNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryArc" (
    "id" TEXT NOT NULL,
    "storyWorldId" TEXT NOT NULL,
    "curriculumVersionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "focusTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "StoryArcStatus" NOT NULL DEFAULT 'ACTIVE',
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryArc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "storyArcId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "focusTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ChapterStatus" NOT NULL DEFAULT 'ACTIVE',
    "pathAheadWhisper" TEXT,
    "handoffSummary" TEXT,
    "plannerJson" JSONB,
    "actCurrent" INTEGER NOT NULL DEFAULT 1,
    "actTotal" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptLedgerEvent" (
    "id" TEXT NOT NULL,
    "learnerProfileId" TEXT NOT NULL,
    "conceptNodeId" TEXT NOT NULL,
    "eventType" "ConceptLedgerEventType" NOT NULL,
    "sessionId" TEXT,
    "messageId" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConceptLedgerEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchPoint" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "promptText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "BranchPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchOption" (
    "id" TEXT NOT NULL,
    "branchPointId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "teaser" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageStoragePath" TEXT,
    "imagePrompt" TEXT,
    "nextChapterId" TEXT,

    CONSTRAINT "BranchOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoryWorld_learnerProfileId_key" ON "StoryWorld"("learnerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "ConceptNode_curriculumVersionId_slug_key" ON "ConceptNode"("curriculumVersionId", "slug");

-- AddForeignKey
ALTER TABLE "StoryWorld" ADD CONSTRAINT "StoryWorld_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptNode" ADD CONSTRAINT "ConceptNode_curriculumVersionId_fkey" FOREIGN KEY ("curriculumVersionId") REFERENCES "CurriculumVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryArc" ADD CONSTRAINT "StoryArc_storyWorldId_fkey" FOREIGN KEY ("storyWorldId") REFERENCES "StoryWorld"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryArc" ADD CONSTRAINT "StoryArc_curriculumVersionId_fkey" FOREIGN KEY ("curriculumVersionId") REFERENCES "CurriculumVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_storyArcId_fkey" FOREIGN KEY ("storyArcId") REFERENCES "StoryArc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptLedgerEvent" ADD CONSTRAINT "ConceptLedgerEvent_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptLedgerEvent" ADD CONSTRAINT "ConceptLedgerEvent_conceptNodeId_fkey" FOREIGN KEY ("conceptNodeId") REFERENCES "ConceptNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptLedgerEvent" ADD CONSTRAINT "ConceptLedgerEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchPoint" ADD CONSTRAINT "BranchPoint_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchOption" ADD CONSTRAINT "BranchOption_branchPointId_fkey" FOREIGN KEY ("branchPointId") REFERENCES "BranchPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchOption" ADD CONSTRAINT "BranchOption_nextChapterId_fkey" FOREIGN KEY ("nextChapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
