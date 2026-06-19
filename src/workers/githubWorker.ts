import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "../lib/prisma";
import { getOctokit } from "../lib/github";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const githubWorker = new Worker(
  "github-sync",
  async (job: Job) => {
    const { action, payload } = job.data;
    
    console.log(`Processing github-sync job: ${action}`);

    if (action === "sync_repo") {
      const { repositoryId, owner, repo } = payload;
      // Sync repository logic here using octokit
    }

    if (action === "pull_request") {
      const { pull_request, action: prAction, repository } = payload;
      const githubPrId = pull_request.id.toString();
      
      console.log(`PR ${prAction} event for PR ${githubPrId}`);

      // Basic PR tracking logic (assuming the user's github ID is linked)
      const user = await prisma.user.findFirst({
        where: { githubId: pull_request.user.id.toString() }
      });

      if (!user) return;

      if (prAction === "opened" || prAction === "reopened") {
        // Find if this user has any active claim
        const claim = await prisma.claim.findFirst({
          where: { userId: user.id, status: "PENDING" },
          orderBy: { claimedAt: "desc" }
        });

        if (claim) {
          await prisma.pullRequest.upsert({
            where: { githubPrId },
            update: { status: "OPEN" },
            create: {
              githubPrId,
              claimId: claim.id,
              status: "OPEN",
            }
          });
        }
      } else if (prAction === "closed" && pull_request.merged) {
        // PR was merged
        const pr = await prisma.pullRequest.findUnique({
          where: { githubPrId }
        });

        if (pr) {
          await prisma.pullRequest.update({
            where: { id: pr.id },
            data: { status: "MERGED", mergedAt: new Date() }
          });

          await prisma.claim.update({
            where: { id: pr.claimId },
            data: { status: "ACCEPTED" }
          });

          // Escrow Payout Logic
          const bounty = await prisma.bounty.findFirst({
            where: { claims: { some: { id: pr.claimId } } }
          });

          if (bounty) {
            await prisma.bounty.update({
              where: { id: bounty.id },
              data: { status: "COMPLETED" }
            });

            // Find escrow transaction
            const payment = await prisma.payment.findFirst({
              where: { payerId: bounty.creatorId, status: "PENDING" },
              include: { escrowTransaction: true }
            });

            if (payment && payment.escrowTransaction) {
              await prisma.escrowTransaction.update({
                where: { id: payment.escrowTransaction.id },
                data: { status: "RELEASED" }
              });

              await prisma.payment.update({
                where: { id: payment.id },
                data: { status: "COMPLETED", receiverId: user.id }
              });

              console.log(`Escrow funds released to user ${user.id} for bounty ${bounty.id}`);
            }
          }
        }
      }
    }
  },
  { connection }
);

export const issueWorker = new Worker(
  "issue-sync",
  async (job: Job) => {
    const { action, payload } = job.data;
    
    console.log(`Processing issue-sync job: ${action}`);

    if (action === "sync_issues") {
      // Sync issues logic here using octokit
    }
  },
  { connection }
);
