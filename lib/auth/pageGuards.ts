import { redirect } from "next/navigation";
import { getCurrentUser } from "./session";
import { getProfile } from "../services/profile";
import type { LearnerProfileData } from "../types";
import type { JWTPayload } from "./jwt";

export async function requireChildPage(): Promise<{
  user: JWTPayload;
  profile: LearnerProfileData;
}> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "CHILD") redirect("/household");
  const profile = await getProfile(user.userId);
  if (!profile) redirect("/household");
  return { user, profile };
}

export async function requireParentPage(): Promise<JWTPayload> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "PARENT") redirect("/learn");
  return user;
}
