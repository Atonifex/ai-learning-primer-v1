import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth/session";
import { isNextResponse, requireChildProfile } from "../../../../lib/auth/guards";
import { getIntroDeal, saveIntroDealEvent } from "../../../../lib/services/introDeal";
import type { IntroEvent } from "../../../../lib/play/introDeal";
export async function GET() {
  const profile = await requireChildProfile(await getCurrentUser());
  if (isNextResponse(profile)) return profile;
  return NextResponse.json({ deal: await getIntroDeal(profile.id) });
}
export async function POST(req: NextRequest) {
  const profile = await requireChildProfile(await getCurrentUser());
  if (isNextResponse(profile)) return profile;
  const body = await req.json().catch(() => null);
  if (!["ended", "yes", "no"].includes(body?.event)) return NextResponse.json({ error: "Choose Yes or No after the offer." }, { status: 400 });
  try { return NextResponse.json({ deal: await saveIntroDealEvent(profile.id, body.event as IntroEvent) }); }
  catch { return NextResponse.json({ error: "Your choice could not be saved. Please try again." }, { status: 503 }); }
}
