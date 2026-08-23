import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth/session";
import { hasProfile } from "../../lib/services/profile";
import OnboardingWizard from "../../components/onboarding/OnboardingWizard";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (await hasProfile(user.userId)) {
    redirect("/learn");
  }

  return <OnboardingWizard />;
}
