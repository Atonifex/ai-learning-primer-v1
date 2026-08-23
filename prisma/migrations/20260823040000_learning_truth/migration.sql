-- Learning truth: session/activity clocks + reflection text + session link.

ALTER TABLE "Session" ADD COLUMN "durationSeconds" INTEGER;

ALTER TABLE "LearningActivityCompletion" ADD COLUMN "sessionId" TEXT;
ALTER TABLE "LearningActivityCompletion" ADD COLUMN "durationSeconds" INTEGER;
ALTER TABLE "LearningActivityCompletion" ADD COLUMN "responseText" TEXT;

CREATE INDEX "LearningActivityCompletion_sessionId_idx" ON "LearningActivityCompletion"("sessionId");

ALTER TABLE "LearningActivityCompletion" ADD CONSTRAINT "LearningActivityCompletion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
