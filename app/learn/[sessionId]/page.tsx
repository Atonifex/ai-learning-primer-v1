import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/auth/session";
import { getProfile } from "../../../lib/services/profile";
import { getSession } from "../../../lib/services/session";
import PlayShell from "../../../components/play/PlayShell";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionPlayPage({ params }: PageProps) {
  const { sessionId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getProfile(user.userId);
  if (!profile) redirect("/onboarding");

  const session = await getSession(sessionId);
  if (!session) redirect("/learn");

  return (
    <PlayShell
      sessionId={sessionId}
      displayName={profile.displayName ?? "Captain"}
      subjectSlug={session.subjectSlug}
    />
  );
}
