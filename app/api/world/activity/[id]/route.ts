import { NextRequest, NextResponse } from "next/server";
import { childProfileResponse, isNextResponse } from "../../../../../lib/auth/apiChild";
import { getWorldActivity } from "../../../../../lib/services/worldMap";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;
  const activity = await getWorldActivity(profile.id, (await params).id);
  return activity ? NextResponse.json(activity, { headers: { "Cache-Control": "no-store" } })
    : NextResponse.json({ error: "Activity not found" }, { status: 404 });
}
