import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth/jwt";

const PROTECTED = ["/learn", "/sessions", "/onboarding", "/progress", "/household", "/settings", "/saga"];
const AUTH_PAGES = ["/login", "/register"];
const PARENT_ONLY = ["/household"];
const CHILD_PLAY = ["/learn", "/onboarding", "/sessions", "/saga"];

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
    url.pathname = user.role === "CHILD" ? "/learn" : "/household";
    return NextResponse.redirect(url);
  }

  if (user?.role === "PARENT" && CHILD_PLAY.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/household";
    return NextResponse.redirect(url);
  }

  if (user?.role === "CHILD" && PARENT_ONLY.some((p) => pathname.startsWith(p))) {
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
    "/progress/:path*",
    "/household/:path*",
    "/settings/:path*",
    "/saga/:path*",
    "/login",
    "/register",
    "/api/profile/:path*",
    "/api/session/:path*",
    "/api/sessions/:path*",
    "/api/household/:path*",
    "/api/missions/:path*",
  ],
};
