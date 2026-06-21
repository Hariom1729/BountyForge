import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiCodeReviewerQueue } from "@/workers/queues";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bountyId, codeDiff } = await req.json();

    if (!bountyId || !codeDiff) {
      return NextResponse.json({ error: "Missing bountyId or codeDiff" }, { status: 400 });
    }

    // 1. Ensure the user has an active claim
    let claim = await prisma.claim.findUnique({
      where: {
        bountyId_userId: { bountyId, userId: session.user.id },
      },
    });

    if (!claim) {
      // For demo purposes, auto-create the claim if it doesn't exist
      claim = await prisma.claim.create({
        data: {
          bountyId,
          userId: session.user.id,
          status: "PENDING",
        },
      });
    }

    // 2. Create the PullRequest record
    // Mock a githubPrId for the demo
    const mockPrId = `pr_${Math.random().toString(36).substring(7)}`;
    
    // Check if PR already exists for this claim
    let pr = await prisma.pullRequest.findUnique({
      where: { claimId: claim.id },
    });

    if (!pr) {
      pr = await prisma.pullRequest.create({
        data: {
          githubPrId: mockPrId,
          claimId: claim.id,
          status: "OPEN",
        },
      });
    }

    // 3. Enqueue the AI Code Review job
    await aiCodeReviewerQueue.add("review-code", {
      pullRequestId: pr.id,
      codeDiff,
    });

    return NextResponse.json({ success: true, message: "PR simulated and AI Review queued." }, { status: 200 });
  } catch (error) {
    console.error("Error simulating PR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
