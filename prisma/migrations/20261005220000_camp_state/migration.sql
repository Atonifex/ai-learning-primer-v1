-- Persistent camp: resources, crew slots, and visual stage per captain.

CREATE TABLE "CampState" (
    "id" TEXT NOT NULL,
    "learnerProfileId" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'clearing',
    "rations" INTEGER NOT NULL DEFAULT 0,
    "scrap" INTEGER NOT NULL DEFAULT 0,
    "timber" INTEGER NOT NULL DEFAULT 0,
    "canvas" INTEGER NOT NULL DEFAULT 0,
    "appliedGrantIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "crew" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampState_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CampState_learnerProfileId_key" ON "CampState"("learnerProfileId");

ALTER TABLE "CampState" ADD CONSTRAINT "CampState_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
