import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const githubSyncQueue = new Queue("github-sync", { connection });
export const issueSyncQueue = new Queue("issue-sync", { connection });
