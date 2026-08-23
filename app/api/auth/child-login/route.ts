import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/db/prisma";
import { applyAuthCookie } from "../../../../lib/auth/session";
import { tokenForUser } from "../../../../lib/auth/tokenUser";
import { normalizeUsername, parsePin } from "../../../../lib/auth/credentials";
import {
  clearPinFailures,
  pinLockRemainingMs,
  recordPinFailure,
} from "../../../../lib/auth/pinLock";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username = normalizeUsername(body?.username);
  const pin = parsePin(body?.pin);
  if (!username || !pin) {
    return NextResponse.json({ error: "Enter your captain login and 4-digit PIN." }, { status: 400 });
  }

  const locked = pinLockRemainingMs(username);
  if (locked > 0) {
    return NextResponse.json(
      { error: "Too many tries. Wait a minute and try again." },
      { status: 429 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { username },
    include: { learnerProfile: { select: { id: true } } },
  });
  if (!user || user.role !== "CHILD" || !user.learnerProfile) {
    recordPinFailure(username);
    return NextResponse.json({ error: "Invalid captain login" }, { status: 401 });
  }

  const valid = await bcrypt.compare(pin, user.passwordHash);
  if (!valid) {
    recordPinFailure(username);
    return NextResponse.json({ error: "Invalid captain login" }, { status: 401 });
  }

  clearPinFailures(username);
  const token = await tokenForUser({
    id: user.id,
    email: user.email,
    role: "CHILD",
    householdId: user.householdId,
    learnerProfile: user.learnerProfile,
  });

  const res = NextResponse.json({ ok: true, role: "CHILD" });
  applyAuthCookie(res, token);
  return res;
}
