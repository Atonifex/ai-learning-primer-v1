import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, applyAuthCookie } from "../../../../lib/auth/session";
import { isNextResponse, requireParent } from "../../../../lib/auth/guards";
import { tokenForUser, loadTokenUser } from "../../../../lib/auth/tokenUser";
import { prisma } from "../../../../lib/db/prisma";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const parent = requireParent(user);
  if (isNextResponse(parent)) return parent;

  const body = await req.json().catch(() => null);
  const childUserId = typeof body?.childUserId === "string" ? body.childUserId : "";
  if (!childUserId) {
    return NextResponse.json({ error: "childUserId is required" }, { status: 400 });
  }

  const household = await prisma.household.findUnique({
    where: { parentUserId: parent.userId },
  });
  if (!household) {
    return NextResponse.json({ error: "Household not found" }, { status: 404 });
  }

  const child = await prisma.user.findFirst({
    where: {
      id: childUserId,
      role: "CHILD",
      householdId: household.id,
    },
    include: { learnerProfile: { select: { id: true } } },
  });
  if (!child?.learnerProfile) {
    return NextResponse.json({ error: "Captain not found" }, { status: 404 });
  }

  const tokenUser = await loadTokenUser(child.id);
  if (!tokenUser) {
    return NextResponse.json({ error: "Captain not found" }, { status: 404 });
  }
  const token = await tokenForUser(tokenUser);
  const res = NextResponse.json({ ok: true, role: "CHILD" });
  applyAuthCookie(res, token);
  return res;
}
