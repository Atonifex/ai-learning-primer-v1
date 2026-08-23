-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MemoryType" ADD VALUE 'STRENGTH';
ALTER TYPE "MemoryType" ADD VALUE 'CONFIDENCE_LEVEL';
ALTER TYPE "MemoryType" ADD VALUE 'INTEREST_SIGNAL';
ALTER TYPE "MemoryType" ADD VALUE 'STORY_BEAT';

-- AlterTable
ALTER TABLE "LearnerProfile" ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "gradeBand" TEXT NOT NULL DEFAULT '3',
ADD COLUMN     "primarySubjectSlug" TEXT NOT NULL DEFAULT 'math_g3',
ALTER COLUMN "activeLanguage" DROP NOT NULL,
ALTER COLUMN "currentLevel" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ReviewItem" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "standardCode" TEXT NOT NULL,
    "conceptSummary" TEXT NOT NULL,
    "nextReviewAt" TIMESTAMP(3) NOT NULL,
    "timesReviewed" INTEGER NOT NULL DEFAULT 0,
    "lastScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReviewItem_learnerId_nextReviewAt_idx" ON "ReviewItem"("learnerId", "nextReviewAt");

-- AddForeignKey
ALTER TABLE "ReviewItem" ADD CONSTRAINT "ReviewItem_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
