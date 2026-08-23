import "dotenv/config";
import { prisma } from "../../lib/db/prisma";
import { addCaptain, createParentWithHousehold } from "../../lib/services/household";
import { startSession, getSession } from "../../lib/services/session";
import { buildSystemPrompt } from "../../lib/ai/contextBuilder";
import {
  formatStandardsBlock,
  getStandardCodesForSubject,
} from "../../lib/services/standardsCatalog";
import bcrypt from "bcryptjs";

async function main() {
  const email = `smoke_${Date.now()}@primer.local`;
  const { parent } = await createParentWithHousehold({
    email,
    passwordHash: await bcrypt.hash("smoke-parent-pass", 12),
    coppaConsent: true,
  });

  const { profile, child } = await addCaptain({
    parentUserId: parent.id,
    username: `smoke_${Date.now().toString().slice(-8)}`,
    pin: "2468",
    displayName: "Smokey",
  });
  console.log("PROFILE:", {
    id: profile.id,
    displayName: profile.displayName,
    gradeBand: profile.gradeBand,
    primarySubjectSlug: profile.primarySubjectSlug,
    enrolledCount: profile.enrolledSubjects.length,
    enrolled: profile.enrolledSubjects.map((s) => s.slug),
  });
  if (profile.enrolledSubjects.length !== 4) {
    throw new Error(
      `Expected 4 enrolled subjects, got ${profile.enrolledSubjects.length}`
    );
  }

  // 3. Story chain should already exist (created inside createProfile).
  const world = await prisma.storyWorld.findUnique({
    where: { learnerProfileId: profile.id },
  });
  const arcs = await prisma.storyArc.findMany({
    where: { storyWorldId: world!.id },
    include: { chapters: { orderBy: { orderIndex: "asc" } } },
  });
  console.log("STORY:", {
    world: world?.title,
    arcCount: arcs.length,
    arcTitle: arcs[0]?.title,
    chapterCount: arcs[0]?.chapters.length,
    activeChapter: arcs[0]?.chapters.find((c) => c.status === "ACTIVE")?.title,
  });
  if (arcs.length !== 1) throw new Error(`Expected 1 arc, got ${arcs.length}`);
  if (arcs[0].chapters.length !== 6)
    throw new Error(`Expected 6 chapters, got ${arcs[0].chapters.length}`);

  // 4. Start a session under primary subject (math_g3).
  const sessionId = await startSession(profile.id, profile.primarySubjectSlug);
  const session = await getSession(sessionId);
  console.log("SESSION:", {
    id: session?.id,
    subjectSlug: session?.subjectSlug,
    language: session?.language,
    chapter: session?.chapter?.title,
  });
  if (session?.subjectSlug !== "math_g3")
    throw new Error(`Expected math_g3, got ${session?.subjectSlug}`);

  // 5. Standards block loads real codes for the subject.
  const standards = await getStandardCodesForSubject("math_g3", 50);
  const standardsBlock = formatStandardsBlock(standards);
  console.log("STANDARDS:", {
    count: standards.length,
    sampleCodes: standards.slice(0, 5).map((s) => s.code),
  });
  if (standards.length === 0) throw new Error("No standards loaded for math_g3");
  if (!standardsBlock.includes("MA.3."))
    throw new Error("Standards block missing MA.3.* codes");

  // 6. Build a system prompt for the math lens.
  const systemPrompt = buildSystemPrompt(
    profile,
    [],
    null,
    [],
    {
      subjectSlug: "math_g3",
      standardsBlock,
      coherenceMap: {
        sharedBeat: "Ship down on the shore.",
        anchorQuestion: "How do we assess the wreck?",
        subjectPlan: { targetStandardCodes: ["MA.3.NSO.1.1"] },
      },
    }
  );
  console.log("PROMPT:", {
    chars: systemPrompt.length,
    hasWorldBible: systemPrompt.includes("Mapmaker's Expedition"),
    hasMathLens: systemPrompt.includes("Grade 3 Mathematics"),
    hasMACodes: systemPrompt.includes("MA.3."),
    hasCaptainName: systemPrompt.includes("Smokey"),
    forbidsExoplanetReveal:
      systemPrompt.includes("hidden truths") ||
      systemPrompt.includes("Hidden truths"),
  });
  if (!systemPrompt.includes("Mapmaker's Expedition"))
    throw new Error("World bible missing from prompt");

  // 7. Clean up — delete in FK dependency order.
  await prisma.message.deleteMany({ where: { session: { learnerProfileId: profile.id } } });
  await prisma.standardsEvidence.deleteMany({ where: { learnerProfileId: profile.id } });
  await prisma.session.deleteMany({ where: { learnerProfileId: profile.id } });
  await prisma.memoryItem.deleteMany({ where: { learnerProfileId: profile.id } });
  await prisma.learnerProfile.delete({ where: { id: profile.id } });
  await prisma.user.delete({ where: { id: child.id } });
  await prisma.household.delete({ where: { parentUserId: parent.id } });
  await prisma.user.delete({ where: { id: parent.id } });
  console.log("CLEANUP: ok");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("\n✓ Phase 1 smoke test passed.");
  })
  .catch(async (err) => {
    console.error("\n✗ Phase 1 smoke test FAILED:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
