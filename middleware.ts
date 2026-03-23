import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth/jwt";

const PROTECTED = ["/learn", "/sessions", "/onboarding"];
const AUTH_PAGES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("primer_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  const isApiProtected =
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth/");

  const user = token ? await verifyToken(token) : null;

  if ((isProtected || isApiProtected) && !user) {
    if (isApiProtected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/learn";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/learn/:path*",
    "/sessions/:path*",
    "/onboarding/:path*",
    "/login",
    "/register",
    "/api/profile/:path*",
    "/api/session/:path*",
    "/api/sessions/:path*",
  ],
};
