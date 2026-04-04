-- AlterTable
ALTER TABLE "Message" ADD COLUMN "imageStoragePath" TEXT;

-- CreateTable
CREATE TABLE "CharacterPortrait" (
    "id" TEXT NOT NULL,
    "learnerProfileId" TEXT NOT NULL,
    "characterKey" TEXT NOT NULL,
    "displayName" TEXT,
    "firstMessageId" TEXT,
    "latestMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterPortrait_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacterPortrait_learnerProfileId_characterKey_key" ON "CharacterPortrait"("learnerProfileId", "characterKey");

-- AddForeignKey
ALTER TABLE "CharacterPortrait" ADD CONSTRAINT "CharacterPortrait_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
