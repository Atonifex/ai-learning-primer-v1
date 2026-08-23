import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/db/prisma";
import { applyAuthCookie } from "../../../../lib/auth/session";
import { tokenForUser } from "../../../../lib/auth/tokenUser";
import { ensureParentHousehold } from "../../../../lib/services/household";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: { learnerProfile: { select: { id: true } } },
  });
  if (!user || user.role === "CHILD") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const household = await ensureParentHousehold(user.id);
  const token = await tokenForUser({
    id: user.id,
    email: user.email,
    role: "PARENT",
    householdId: household.id,
    learnerProfile: user.learnerProfile,
  });

  const res = NextResponse.json({ ok: true, role: "PARENT" });
  applyAuthCookie(res, token);
  return res;
}
