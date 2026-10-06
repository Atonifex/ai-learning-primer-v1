-- Camp resource plan state (budget, then one upgrade).
ALTER TABLE "CampState" ADD COLUMN "campPlan" JSONB;
