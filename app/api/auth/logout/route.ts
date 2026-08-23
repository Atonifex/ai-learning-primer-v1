import { NextResponse } from "next/server";
import { COOKIE_NAME, clearAuthCookie } from "../../../../lib/auth/session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  clearAuthCookie(res);
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}
