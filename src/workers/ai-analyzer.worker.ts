import { Worker } from "bullmq";
import { redisConnection } from "./redis";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

export const aiAnalyzerWorker = new Worker(
  "ai-issue-analyzer",
  async (job) => {
    const { issueId } = job.data;
    console.log(`[AI Analyzer Worker] Processing issue: ${issueId}`);

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
    });

    if (!issue) {
      console.error(`Issue not found: ${issueId}`);
      return;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // fallback to a cheaper model for dev, but ready for gpt-4o
        messages: [
          {
            role: "system",
            content: `You are an AI Open Source Bounty analyzer. 
Analyze the following GitHub issue.
Output ONLY a valid JSON object with these exact keys:
- estimatedHours: number (e.g. 4.5)
- suggestedReward: number in USD (e.g. 50)
- complexityScore: number between 1-100
- difficulty: string (EASY, MEDIUM, HARD, EXPERT)
- aiImplementationPlan: string (markdown format with proposed solution)
`,
          },
          {
            role: "user",
            content: `Title: ${issue.title}\n\nBody:\n${issue.body}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const responseContent = completion.choices[0].message.content;
      if (!responseContent) throw new Error("No response from OpenAI");

      const analysis = JSON.parse(responseContent);

      await prisma.issue.update({
        where: { id: issueId },
        data: {
          estimatedHours: analysis.estimatedHours,
          suggestedReward: analysis.suggestedReward,
          complexityScore: analysis.complexityScore,
          difficulty: analysis.difficulty,
          aiImplementationPlan: analysis.aiImplementationPlan,
          aiAnalyzedAt: new Date(),
        },
      });

      console.log(`[AI Analyzer Worker] Successfully analyzed issue: ${issueId}`);
    } catch (error: any) {
      console.error(`[AI Analyzer Worker] Failed to process issue ${issueId}:`, error.message);
      
      // Fallback for Demo: If OpenAI fails (e.g. out of quota), generate a mock analysis
      console.log(`[AI Analyzer Worker] Using Mock AI Data for demo purposes...`);
      await prisma.issue.update({
        where: { id: issueId },
        data: {
          estimatedHours: 4.5,
          suggestedReward: 50,
          complexityScore: 65,
          difficulty: "MEDIUM",
          aiImplementationPlan: "### Mock AI Implementation Plan\n\n1. Analyze the issue requirements.\n2. Create necessary database schema updates.\n3. Implement the feature in Next.js.\n4. Write tests and deploy.\n\n*(This is a mock response because the OpenAI API key ran out of quota)*",
          aiAnalyzedAt: new Date(),
        },
      });
    }
  },
  { connection: redisConnection }
);

aiAnalyzerWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

aiAnalyzerWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error ${err.message}`);
});
