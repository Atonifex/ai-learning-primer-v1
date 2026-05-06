import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../lib/auth/session";
import { getProfile } from "../../../../../lib/services/profile";
import { applyBranchSelection } from "../../../../../lib/services/storyBranches";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: sessionId } = await params;
  const body = await req.json().catch(() => ({}));
  const branchOptionId = typeof body.branchOptionId === "string" ? body.branchOptionId : "";
  if (!branchOptionId) {
    return NextResponse.json({ error: "Missing branchOptionId" }, { status: 400 });
  }

  const profile = await getProfile(user.userId);
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  try {
    const { nextSessionId } = await applyBranchSelection({
      learnerProfileId: profile.id,
      sessionId,
      branchOptionId,
    });
    return NextResponse.json({ nextSessionId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Branch failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
