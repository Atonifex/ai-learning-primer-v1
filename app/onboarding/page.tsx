import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth/session";

/** First-run now lives in PlayShell (video → name → verbs). */
export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "PARENT") redirect("/household");
  redirect("/learn");
}
