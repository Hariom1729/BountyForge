import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all active bounties
export async function GET(req: NextRequest) {
  try {
    const bounties = await prisma.bounty.findMany({
      where: { status: { in: ["OPEN", "CLAIMED"] } },
      include: {
        issue: {
          include: {
            repository: true,
          },
        },
        creator: {
          select: { name: true, image: true },
        },
        _count: {
          select: { claims: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bounties);
  } catch (error) {
    console.error("Error fetching bounties:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST to create a new bounty
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "MAINTAINER") {
      return NextResponse.json({ error: "Unauthorized. Must be a maintainer." }, { status: 401 });
    }

    const { issueId, amount } = await req.json();

    if (!issueId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Verify issue exists
    const issue = await prisma.issue.findUnique({ where: { id: issueId } });
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Check if bounty already exists for issue
    const existingBounty = await prisma.bounty.findUnique({ where: { issueId } });
    if (existingBounty) {
      return NextResponse.json({ error: "Bounty already exists for this issue" }, { status: 400 });
    }

    const bounty = await prisma.bounty.create({
      data: {
        amount: parseFloat(amount),
        status: "OPEN",
        issueId,
        creatorId: session.user.id,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: "BOUNTY_CREATED",
        userId: session.user.id,
        metadata: { bountyId: bounty.id, amount },
      },
    });

    return NextResponse.json(bounty, { status: 201 });
  } catch (error) {
    console.error("Error creating bounty:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
