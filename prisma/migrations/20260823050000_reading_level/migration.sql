-- AlterTable
ALTER TABLE "LearnerProfile" ADD COLUMN "readingLevel" TEXT NOT NULL DEFAULT '3';

-- Backfill: match existing gradeBand so dialogue reading target tracks enrolled grade
UPDATE "LearnerProfile" SET "readingLevel" = "gradeBand";
