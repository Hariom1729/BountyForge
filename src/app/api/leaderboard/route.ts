import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const leaderboard = await prisma.reputation.findMany({
      orderBy: { score: "desc" },
      take: 100,
      include: {
        user: { select: { name: true, image: true, githubId: true } },
      },
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
