-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PARENT', 'CHILD');

-- CreateTable
CREATE TABLE "Household" (
    "id" TEXT NOT NULL,
    "parentUserId" TEXT NOT NULL,
    "coppaConsentAt" TIMESTAMP(3),
    "coppaConsentVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Household_pkey" PRIMARY KEY ("id")
);

-- AlterTable User
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "User" ADD COLUMN "username" TEXT;
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'PARENT';
ALTER TABLE "User" ADD COLUMN "householdId" TEXT;

-- AlterTable LearnerProfile (nullable first for backfill)
ALTER TABLE "LearnerProfile" ADD COLUMN "householdId" TEXT;
ALTER TABLE "LearnerProfile" ADD COLUMN "firstRunStep" TEXT NOT NULL DEFAULT 'video';
ALTER TABLE "LearnerProfile" ADD COLUMN "introSeenAt" TIMESTAMP(3);

-- Backfill: one household per existing user; existing players skip first-run
INSERT INTO "Household" ("id", "parentUserId", "createdAt", "updatedAt")
SELECT 'hh_' || "id", "id", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "User";

UPDATE "User" AS u
SET "householdId" = h."id"
FROM "Household" AS h
WHERE h."parentUserId" = u."id";

UPDATE "LearnerProfile" AS p
SET "householdId" = u."householdId",
    "firstRunStep" = 'complete'
FROM "User" AS u
WHERE p."userId" = u."id";

-- Enforce household on profiles
ALTER TABLE "LearnerProfile" ALTER COLUMN "householdId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Household_parentUserId_key" ON "Household"("parentUserId");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Household" ADD CONSTRAINT "Household_parentUserId_fkey" FOREIGN KEY ("parentUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "LearnerProfile" ADD CONSTRAINT "LearnerProfile_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
