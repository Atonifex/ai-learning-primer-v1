/**
 * Split fused parent+learner Users into household + child captain login.
 *
 * Existing local accounts that still have LearnerProfile on the parent User
 * get a child username from the email local-part and PIN 1234 (printed once).
 *
 *   npx tsx scripts/migrate-household.ts
 */
import "dotenv/config";
import { prisma } from "../lib/db/prisma";
import { claimFusedCaptain, ensureParentHousehold } from "../lib/services/household";

function usernameFromEmail(email: string): string {
  const local = email.split("@")[0]?.replace(/[^a-z0-9_]/gi, "_").toLowerCase() ?? "captain";
  const base = local.slice(0, 16) || "captain";
  return base.length >= 3 ? base : `${base}cap`;
}

async function uniqueUsername(base: string): Promise<string> {
  let candidate = base;
  let n = 1;
  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    n += 1;
    candidate = `${base.slice(0, 16)}_${n}`;
  }
  return candidate;
}

async function main() {
  const fused = await prisma.learnerProfile.findMany({
    include: { user: { select: { id: true, email: true, role: true } } },
  });

  for (const profile of fused) {
    if (profile.user.role === "CHILD") continue;
    await ensureParentHousehold(profile.user.id);
    const email = profile.user.email ?? `captain_${profile.id}`;
    const username = await uniqueUsername(usernameFromEmail(email));
    await claimFusedCaptain({
      parentUserId: profile.user.id,
      username,
      pin: "1234",
    });
    console.log(
      `Split ${email} → captain login "${username}" PIN 1234 (change from /household).`
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
