-- Chapter handoff facts: work products the next chapter must reuse.

CREATE TYPE "WorldLedgerKind" AS ENUM ('ARTIFACT', 'DECISION', 'OPEN_THREAD');

CREATE TABLE "WorldLedgerEntry" (
    "id" TEXT NOT NULL,
    "learnerProfileId" TEXT NOT NULL,
    "chapterId" TEXT,
    "kind" "WorldLedgerKind" NOT NULL,
    "label" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "standardCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "activitySlug" TEXT,
    "sourceCompletionId" TEXT,
    "mustReuse" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorldLedgerEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WorldLedgerEntry_sourceCompletionId_key" ON "WorldLedgerEntry"("sourceCompletionId");

CREATE INDEX "WorldLedgerEntry_learnerProfileId_createdAt_idx" ON "WorldLedgerEntry"("learnerProfileId", "createdAt");

ALTER TABLE "WorldLedgerEntry" ADD CONSTRAINT "WorldLedgerEntry_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorldLedgerEntry" ADD CONSTRAINT "WorldLedgerEntry_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
