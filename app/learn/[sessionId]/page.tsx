import { redirect } from "next/navigation";
import { requireChildPage } from "../../../lib/auth/pageGuards";
import { getSession } from "../../../lib/services/session";
import PlayShell from "../../../components/play/PlayShell";

interface PageProps {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ mission?: string }>;
}

export default async function SessionPlayPage({ params, searchParams }: PageProps) {
  const { sessionId } = await params;
  const { mission } = await searchParams;
  const { profile } = await requireChildPage();

  const session = await getSession(sessionId);
  if (!session || session.learnerProfileId !== profile.id) redirect("/learn");

  return (
    <PlayShell
      sessionId={sessionId}
      displayName={profile.displayName ?? "Captain"}
      subjectSlug={session.subjectSlug}
      sessionStartedAt={session.startedAt.toISOString()}
      initialMission={typeof mission === "string" ? mission : undefined}
      firstRunStep={profile.firstRunStep}
    />
  );
}
