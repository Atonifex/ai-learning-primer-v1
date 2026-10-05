import { redirect } from "next/navigation";
import { requireChildPage } from "../../../lib/auth/pageGuards";
import { prisma } from "../../../lib/db/prisma";
import { getSession } from "../../../lib/services/session";
import { updateProfile } from "../../../lib/services/profile";
import PlayShell from "../../../components/play/PlayShell";
import { shouldOpenSubjectFocus } from "../../../lib/play/subjectFocus";
import { parseFirstRunStep, reconcileFirstRunStep } from "../../../lib/play/firstRun";

interface PageProps {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ mission?: string; dialogue?: string; board?: string; clip?: string }>;
}

export default async function SessionPlayPage({ params, searchParams }: PageProps) {
  const { sessionId } = await params;
  const { mission, dialogue, board, clip } = await searchParams;
  const { user, profile } = await requireChildPage();

  const session = await getSession(sessionId);
  if (!session || session.learnerProfileId !== profile.id) redirect("/learn");

  const chapterOrder = session.chapter
    ? (
        await prisma.chapter.findUnique({
          where: { id: session.chapter.id },
          select: { orderIndex: true },
        })
      )?.orderIndex ?? null
    : null;
  const healedStep = reconcileFirstRunStep(parseFirstRunStep(profile.firstRunStep), chapterOrder);
  const firstRunStep =
    healedStep === profile.firstRunStep
      ? profile.firstRunStep
      : (await updateProfile(user.userId, { firstRunStep: healedStep })).firstRunStep;

  return (
    <PlayShell
      key={sessionId}
      sessionId={sessionId}
      displayName={profile.displayName ?? "Captain"}
      subjectSlug={session.subjectSlug}
      sessionStartedAt={session.startedAt.toISOString()}
      initialMission={typeof mission === "string" ? mission : undefined}
      firstRunStep={firstRunStep}
      autoOpenDialogue={dialogue === "1"}
      autoOpenBoard={board === "1"}
      autoOpenClip={clip === "1"}
      autoOpenFocus={shouldOpenSubjectFocus({
        firstRunStep,
        dialogueQuery: dialogue === "1",
        boardQuery: board === "1",
        missionQuery: typeof mission === "string" && mission.length > 0,
        clipQuery: clip === "1",
      })}
    />
  );
}
