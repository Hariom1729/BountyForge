import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  // If role is provided and valid, update the user in DB
  if (role === "MAINTAINER" || role === "CONTRIBUTOR") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: role }
    });
    
    // Redirect to respective dashboard
    if (role === "MAINTAINER") {
      return NextResponse.redirect(new URL("/maintainer/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/contributor/dashboard", request.url));
    }
  }

  // Fallback if no role was provided or it was invalid
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (dbUser?.role === "MAINTAINER") {
    return NextResponse.redirect(new URL("/maintainer/dashboard", request.url));
  }
  return NextResponse.redirect(new URL("/contributor/dashboard", request.url));
}
