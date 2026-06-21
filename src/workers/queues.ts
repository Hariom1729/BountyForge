import { Queue } from "bullmq";
import { redisConnection } from "./redis";

export const aiIssueAnalyzerQueue = new Queue("ai-issue-analyzer", {
  connection: redisConnection,
});

export const aiCodeReviewerQueue = new Queue("ai-code-reviewer", {
  connection: redisConnection,
});

export const aiFraudDetectorQueue = new Queue("ai-fraud-detector", {
  connection: redisConnection,
});
