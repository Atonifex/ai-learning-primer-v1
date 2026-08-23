import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db/prisma";
import { applyAuthCookie } from "../../../../lib/auth/session";
import { tokenForUser } from "../../../../lib/auth/tokenUser";
import { createParentWithHousehold } from "../../../../lib/services/household";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const coppaConsent = body?.coppaConsent === true;

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Invalid email or password (min 8 chars)" },
      { status: 400 }
    );
  }
  if (!coppaConsent) {
    return NextResponse.json(
      { error: "A parent or guardian must agree before creating an account." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const { parent } = await createParentWithHousehold({
    email,
    passwordHash,
    coppaConsent: true,
  });

  const token = await tokenForUser({
    id: parent.id,
    email: parent.email,
    role: parent.role,
    householdId: parent.householdId,
    learnerProfile: parent.learnerProfile,
  });

  const res = NextResponse.json({ ok: true, role: "PARENT" });
  applyAuthCookie(res, token);
  return res;
}
