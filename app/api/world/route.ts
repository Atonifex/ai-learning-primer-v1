import { NextRequest, NextResponse } from "next/server";
import { childProfileResponse, isNextResponse } from "../../../lib/auth/apiChild";
import { getWorldSnapshot, saveMapNote } from "../../../lib/services/worldMap";
import { mapNoteInput } from "../../../lib/play/worldMap";

export async function GET() {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;
  return NextResponse.json(await getWorldSnapshot(profile.id), { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(req: NextRequest) {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;
  const input = mapNoteInput.safeParse(await req.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Choose a place and write a note of 1–240 characters." }, { status: 400 });
  try { return NextResponse.json(await saveMapNote(profile.id, input.data)); }
  catch { return NextResponse.json({ error: "That note could not be saved. Choose an available place and try again." }, { status: 400 }); }
}
