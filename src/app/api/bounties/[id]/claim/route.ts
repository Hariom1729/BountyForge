import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const bountyId = resolvedParams.id;

    // Check if bounty exists and is claimable
    const bounty = await prisma.bounty.findUnique({
      where: { id: bountyId },
    });

    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    if (bounty.status !== "OPEN") {
      return NextResponse.json({ error: "Bounty is not open for claims" }, { status: 400 });
    }

    // Check if user already claimed this bounty
    const existingClaim = await prisma.claim.findUnique({
      where: {
        bountyId_userId: {
          bountyId,
          userId: session.user.id,
        },
      },
    });

    if (existingClaim) {
      return NextResponse.json({ error: "You have already claimed this bounty" }, { status: 400 });
    }

    // Create the claim
    const claim = await prisma.claim.create({
      data: {
        bountyId,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: "BOUNTY_CLAIMED",
        userId: session.user.id,
        metadata: { bountyId, claimId: claim.id },
      },
    });

    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    console.error("Error claiming bounty:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
