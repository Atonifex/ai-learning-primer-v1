import { redirect } from "next/navigation";
import { requireChildPage } from "../../lib/auth/pageGuards";
import { getActiveSession, startSession } from "../../lib/services/session";

export default async function LearnPage() {
  const { profile } = await requireChildPage();

  let sessionId = await getActiveSession(profile.id);
  if (!sessionId) {
    sessionId = await startSession(profile.id, profile.primarySubjectSlug);
  }

  redirect(`/learn/${sessionId}`);
}
