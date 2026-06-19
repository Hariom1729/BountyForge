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
      // Handle PR webhooks
      const { pr, action: prAction } = payload;
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
