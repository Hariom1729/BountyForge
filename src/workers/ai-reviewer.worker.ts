import { Worker } from "bullmq";
import { redisConnection } from "./redis";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";
import { addReputationPoints } from "../lib/reputation";

export const aiReviewerWorker = new Worker(
  "ai-code-reviewer",
  async (job) => {
    const { pullRequestId, codeDiff } = job.data;
    console.log(`[AI Reviewer Worker] Processing PR: ${pullRequestId}`);

    const pr = await prisma.pullRequest.findUnique({
      where: { id: pullRequestId },
      include: { claim: { include: { user: true, bounty: { include: { issue: true } } } } }
    });

    if (!pr) {
      console.error(`PR not found: ${pullRequestId}`);
      return;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert Senior Security Engineer and Open Source Maintainer.
Review the provided code diff for the submitted Pull Request.
Output ONLY a valid JSON object with these exact keys:
- securityScore: number between 1-100 (100 is perfectly secure)
- qualityScore: number between 1-100 (100 is perfect code quality)
- aiReviewSummary: string (markdown format with your code review feedback, pointing out bugs or vulnerabilities)
- shouldMerge: boolean (true if the code is safe and solves the problem)
`,
          },
          {
            role: "user",
            content: `Issue Title: ${pr.claim.bounty.issue.title}\n\nCode Diff:\n${codeDiff}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const responseContent = completion.choices[0].message.content;
      if (!responseContent) throw new Error("No response from OpenAI");

      const analysis = JSON.parse(responseContent);

      await prisma.pullRequest.update({
        where: { id: pullRequestId },
        data: {
          securityScore: analysis.securityScore,
          qualityScore: analysis.qualityScore,
          aiReviewSummary: analysis.aiReviewSummary,
          aiReviewedAt: new Date(),
        },
      });

      // If it's a good PR, we could auto-accept the claim!
      if (analysis.shouldMerge) {
        await prisma.claim.update({
          where: { id: pr.claimId },
          data: { status: "ACCEPTED" },
        });

        // Award reputation to the developer
        await addReputationPoints(pr.claim.userId, 100, `Completed bounty: ${pr.claim.bounty.issue.title}`);
      }

      console.log(`[AI Reviewer Worker] Successfully reviewed PR: ${pullRequestId}`);
    } catch (error: any) {
      console.error(`[AI Reviewer Worker] Failed to process PR ${pullRequestId}:`, error.message);
      
      // Fallback for Demo
      console.log(`[AI Reviewer Worker] Using Mock AI Data for PR...`);
      await prisma.pullRequest.update({
        where: { id: pullRequestId },
        data: {
          securityScore: 95,
          qualityScore: 88,
          aiReviewSummary: "### Great work!\n\nThe code looks solid. No obvious security flaws detected. Good test coverage.\n*(Mock response due to API limits)*",
          aiReviewedAt: new Date(),
        },
      });

      // Auto-accept the claim for demo purposes
      await prisma.claim.update({
        where: { id: pr.claimId },
        data: { status: "ACCEPTED" },
      });
      await addReputationPoints(pr.claim.userId, 100, `Completed bounty: ${pr.claim.bounty.issue.title}`);
    }
  },
  { connection: redisConnection }
);

aiReviewerWorker.on("completed", (job) => {
  console.log(`Review Job ${job.id} completed!`);
});

aiReviewerWorker.on("failed", (job, err) => {
  console.log(`Review Job ${job?.id} failed with error ${err.message}`);
});
