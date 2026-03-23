import { redirect } from "next/navigation";
import { getCurrentUser } from "../lib/auth/session";
import { getProfile } from "../lib/services/profile";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.userId);
  if (!profile) redirect("/onboarding");
  redirect("/learn");
}
