import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 1. If authenticated and accessing sign-in, bypass to dashboard
  if (pathname.startsWith("/signin")) {
    if (token) {
      const role = token.role as string;
      if (role === "MAINTAINER" || role === "ENTERPRISE") {
        return NextResponse.redirect(new URL("/maintainer/dashboard", req.url));
      } else if (role === "GUEST") {
        return NextResponse.redirect(new URL("/guest/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/contributor/dashboard", req.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Protect internal routes
  if (pathname.startsWith("/maintainer") || pathname.startsWith("/contributor") || pathname.startsWith("/onboarding") || pathname.startsWith("/guest")) {
    
    // Not logged in
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    const role = token.role as string;

    if (pathname.startsWith("/onboarding")) {
      return NextResponse.next();
    }

    // Guests can preview guest dashboard and optionally maintainer/contributor pages
    if (role === "GUEST") {
      return NextResponse.next();
    }

    // Role boundaries enforcement
    if (pathname.startsWith("/maintainer") && role !== "MAINTAINER" && role !== "ENTERPRISE") {
      return NextResponse.redirect(new URL("/contributor/dashboard", req.url));
    }

    if (pathname.startsWith("/contributor") && role !== "CONTRIBUTOR") {
      return NextResponse.redirect(new URL("/maintainer/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/signin",
    "/maintainer/:path*",
    "/contributor/:path*",
    "/onboarding/:path*",
    "/guest/:path*"
  ],
};
