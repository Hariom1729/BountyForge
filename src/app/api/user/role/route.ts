import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await req.json();

    if (role !== "MAINTAINER" && role !== "CONTRIBUTOR") {
      return NextResponse.json({ error: "Invalid role selected." }, { status: 400 });
    }

    // Update user role in the database
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { role },
    });

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error("Error setting role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
