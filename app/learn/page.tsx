import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth/session";
import { getProfile } from "../../lib/services/profile";
import { getActiveSession, startSession } from "../../lib/services/session";

export default async function LearnPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getProfile(user.userId);
  if (!profile) redirect("/onboarding");

  // Return to existing active session or start a new one in the profile's primary subject lens.
  let sessionId = await getActiveSession(profile.id);
  if (!sessionId) {
    sessionId = await startSession(profile.id, profile.primarySubjectSlug);
  }

  redirect(`/learn/${sessionId}`);
}
