import { NextRequest, NextResponse } from "next/server";
import { childProfileResponse, isNextResponse } from "../../../../../lib/auth/apiChild";
import { applyBranchSelection } from "../../../../../lib/services/storyBranches";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;

  const { id: sessionId } = await params;
  const body = await req.json().catch(() => ({}));
  const branchOptionId = typeof body.branchOptionId === "string" ? body.branchOptionId : "";
  if (!branchOptionId) {
    return NextResponse.json({ error: "Missing branchOptionId" }, { status: 400 });
  }

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
