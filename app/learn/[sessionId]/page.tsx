import { redirect } from "next/navigation";
import { requireChildPage } from "../../../lib/auth/pageGuards";
import { getSession } from "../../../lib/services/session";
import PlayShell from "../../../components/play/PlayShell";
import { shouldOpenSubjectFocus } from "../../../lib/play/subjectFocus";

interface PageProps {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ mission?: string; dialogue?: string; board?: string; clip?: string }>;
}

export default async function SessionPlayPage({ params, searchParams }: PageProps) {
  const { sessionId } = await params;
  const { mission, dialogue, board, clip } = await searchParams;
  const { profile } = await requireChildPage();

  const session = await getSession(sessionId);
  if (!session || session.learnerProfileId !== profile.id) redirect("/learn");

  return (
    <PlayShell
      key={sessionId}
      sessionId={sessionId}
      displayName={profile.displayName ?? "Captain"}
      subjectSlug={session.subjectSlug}
      sessionStartedAt={session.startedAt.toISOString()}
      initialMission={typeof mission === "string" ? mission : undefined}
      firstRunStep={profile.firstRunStep}
      autoOpenDialogue={dialogue === "1"}
      autoOpenBoard={board === "1"}
      autoOpenClip={clip === "1"}
      autoOpenFocus={shouldOpenSubjectFocus({
        firstRunStep: profile.firstRunStep,
        dialogueQuery: dialogue === "1",
        boardQuery: board === "1",
        missionQuery: typeof mission === "string" && mission.length > 0,
        clipQuery: clip === "1",
      })}
    />
  );
}
