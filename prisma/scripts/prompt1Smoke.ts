/**
 * Prompt 1 smoke: activity↔standard links + unknown-code rejection.
 * Run after `npx prisma db seed`.
 */
import "dotenv/config";
import { prisma } from "../../lib/db/prisma";
import { recordStandardObservation } from "../../lib/services/standardsProgress";
import { startSession } from "../../lib/services/session";

const TEST_EMAIL = "test_captain@primer.local";

async function main() {
  const activity = await prisma.learningActivity.findFirst({
    where: {
      standardLinks: { some: { standard: { code: "MA.3.NSO.1.1" } } },
    },
    include: {
      standardLinks: { include: { standard: { select: { id: true, code: true } } } },
    },
  });
  if (!activity) throw new Error("No activity linked to MA.3.NSO.1.1");
  const link = activity.standardLinks.find((l) => l.standard.code === "MA.3.NSO.1.1");
  if (!link?.standardId) throw new Error("Link missing standardId");
  console.log("OK activity link:", activity.slug, "→", link.standard.code, link.standardId);

  const user = await prisma.user.findUnique({
    where: { email: TEST_EMAIL },
    include: { learnerProfile: true },
  });
  if (!user?.learnerProfile) throw new Error(`Missing test learner ${TEST_EMAIL}`);

  const sessionId = await startSession(user.learnerProfile.id, "math_g3");
  try {
    await recordStandardObservation({
      sessionId,
      standardCode: "FAKE.NOT.A.CODE",
      evidenceTier: "CONVERSATIONAL",
      correctness: 0.5,
    });
    throw new Error("Expected unknown code to be rejected");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes("Unknown standard code")) {
      throw new Error(`Unexpected rejection message: ${msg}`);
    }
    console.log("OK unknown code rejected:", msg);
  }

  console.log("Prompt 1 smoke passed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
