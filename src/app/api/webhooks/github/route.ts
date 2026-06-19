import { NextRequest, NextResponse } from "next/server";
import { verifyGitHubWebhookSignature } from "@/lib/github";
import { githubSyncQueue, issueSyncQueue } from "@/lib/queues";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-hub-signature-256");
  const event = req.headers.get("x-github-event");
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!signature || !event || !secret) {
    return NextResponse.json({ error: "Missing required headers or secret" }, { status: 400 });
  }

  const payloadString = await req.text();
  
  const isValid = await verifyGitHubWebhookSignature(signature, payloadString, secret);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(payloadString);

  try {
    switch (event) {
      case "pull_request":
        await githubSyncQueue.add("process-pr", { action: "pull_request", payload });
        break;
      case "issues":
        await issueSyncQueue.add("process-issue", { action: "issue", payload });
        break;
      case "push":
      case "repository":
        await githubSyncQueue.add("process-repo", { action: "repository", payload });
        break;
      default:
        console.log(`Unhandled GitHub event: ${event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
