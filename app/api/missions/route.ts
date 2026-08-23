import { NextResponse } from "next/server";
import { childProfileResponse, isNextResponse } from "../../../lib/auth/apiChild";
import { getMissionBoard } from "../../../lib/services/missions";

export async function GET() {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;

  const board = await getMissionBoard(profile.id);
  return NextResponse.json(board);
}
