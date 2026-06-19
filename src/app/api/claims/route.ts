import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET claims for a user or a bounty
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bountyId = searchParams.get("bountyId");

    const whereClause: any = {};
    if (bountyId) {
      // If fetching claims for a bounty, user must be the maintainer (creator of the bounty)
      const bounty = await prisma.bounty.findUnique({ where: { id: bountyId } });
      if (!bounty || bounty.creatorId !== session.user.id) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      whereClause.bountyId = bountyId;
    } else {
      // Otherwise fetch claims for the current user
      whereClause.userId = session.user.id;
    }

    const claims = await prisma.claim.findMany({
      where: whereClause,
      include: {
        bounty: {
          include: { issue: true }
        },
        user: {
          select: { name: true, image: true, githubId: true }
        }
      },
    });

    return NextResponse.json(claims);
  } catch (error) {
    console.error("Error fetching claims:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST to claim a bounty
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "CONTRIBUTOR") {
      return NextResponse.json({ error: "Unauthorized. Must be a contributor." }, { status: 401 });
    }

    const { bountyId } = await req.json();

    if (!bountyId) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const bounty = await prisma.bounty.findUnique({ where: { id: bountyId } });
    if (!bounty || bounty.status !== "OPEN") {
      return NextResponse.json({ error: "Bounty is not open for claiming" }, { status: 400 });
    }

    // Check if user already claimed
    const existingClaim = await prisma.claim.findUnique({
      where: {
        bountyId_userId: {
          bountyId,
          userId: session.user.id
        }
      }
    });

    if (existingClaim) {
      return NextResponse.json({ error: "Already claimed this bounty" }, { status: 400 });
    }

    // Check if there's already an accepted claim
    const acceptedClaim = await prisma.claim.findFirst({
       where: { bountyId, status: "ACCEPTED" }
    });

    if (acceptedClaim) {
       return NextResponse.json({ error: "Bounty already has an accepted claim" }, { status: 400 });
    }

    const claim = await prisma.claim.create({
      data: {
        bountyId,
        userId: session.user.id,
        status: "PENDING"
      },
    });

    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    console.error("Error creating claim:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
