import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Protect internal routes
  if (pathname.startsWith("/maintainer") || pathname.startsWith("/contributor") || pathname.startsWith("/onboarding")) {
    
    // Not logged in
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    const role = token.role as string;

    // We use a custom flag or check if role exists to determine onboarding.
    // If the role is totally missing, force onboarding. 
    // In our case, the default role is "CONTRIBUTOR" temporarily from GitHub, 
    // but we can assume onboarding is required if we track an 'onboarded' flag.
    // For simplicity right now, we'll just check if they are trying to access the wrong role's dashboard.

    if (pathname.startsWith("/onboarding")) {
      return NextResponse.next();
    }

    // Role Enforcement
    if (role === "GUEST") {
      // Guests can preview everything, no redirects needed based on role prefix
      return NextResponse.next();
    }

    if (pathname.startsWith("/maintainer") && role !== "MAINTAINER" && role !== "ENTERPRISE") {
      return NextResponse.redirect(new URL("/contributor/dashboard", req.url));
    }

    if (pathname.startsWith("/contributor") && role !== "CONTRIBUTOR") {
      return NextResponse.redirect(new URL("/maintainer/dashboard", req.url));
    }
  }

  // Protect /guest routes from non-guests if needed? Actually we don't need to.

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/maintainer/:path*",
    "/contributor/:path*",
    "/onboarding/:path*"
  ],
};
