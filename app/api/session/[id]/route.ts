import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth/session";
import { enrichSessionDataWithSignedUrls } from "../../../../lib/services/characterPortraits";
import { getSession } from "../../../../lib/services/session";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const session = await getSession(id);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  const enriched = await enrichSessionDataWithSignedUrls(session);
  return NextResponse.json({ session: enriched });
}
