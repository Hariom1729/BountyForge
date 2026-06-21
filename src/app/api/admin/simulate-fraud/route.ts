import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { aiFraudDetectorQueue } from "@/workers/queues";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Enqueue the AI Fraud Detector job
    await aiFraudDetectorQueue.add("detect-fraud", { userId });

    return NextResponse.json({ success: true, message: "Fraud check queued." }, { status: 200 });
  } catch (error) {
    console.error("Error queueing fraud check:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
