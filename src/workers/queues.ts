import { Queue } from "bullmq";
import { redisConnection } from "./redis";

export const aiIssueAnalyzerQueue = new Queue("ai-issue-analyzer", {
  connection: redisConnection,
});
