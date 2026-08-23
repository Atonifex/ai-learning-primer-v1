import "dotenv/config";
import { prisma } from "../../lib/db/prisma";

async function main() {
  const [subjects, profiles, sessions, learnerSubjects, standards, subjectRows] = await Promise.all([
    prisma.subject.count(),
    prisma.learnerProfile.count(),
    prisma.session.count(),
    prisma.learnerSubject.count(),
    prisma.standard.count(),
    prisma.subject.findMany({ select: { slug: true, gradeBand: true, domain: true } }),
  ]);
  console.log(
    JSON.stringify({ subjects, profiles, sessions, learnerSubjects, standards, subjectRows }, null, 2)
  );
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
