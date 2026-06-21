import { Worker } from "bullmq";
import { redisConnection } from "./redis";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";

export const aiFraudWorker = new Worker(
  "ai-fraud-detector",
  async (job) => {
    const { userId } = job.data;
    console.log(`[AI Fraud Worker] Analyzing user: ${userId}`);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        claims: { include: { pullRequest: true } }
      }
    });

    if (!user) {
      console.error(`User not found: ${userId}`);
      return;
    }

    try {
      // Feed user's recent activity to the AI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert Cybersecurity and Fraud Detection AI.
Your job is to analyze a developer's open source activity and detect Sybil attacks, spam, or plagiarized code submissions.
Output ONLY a valid JSON object with these exact keys:
- fraudScore: number between 1-100 (100 means definitely fraudulent/spam, 1 means completely legitimate)
- isBanned: boolean (true if fraudScore > 85)
- reason: string (A short explanation of why you gave this score)
`,
          },
          {
            role: "user",
            content: `Developer Data:\nTotal Claims: ${user.claims.length}\nPRs Submitted: ${user.claims.filter(c => c.pullRequest).length}\nIs this behavior suspicious?`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const responseContent = completion.choices[0].message.content;
      if (!responseContent) throw new Error("No response from OpenAI");

      const analysis = JSON.parse(responseContent);

      await prisma.user.update({
        where: { id: userId },
        data: {
          fraudScore: analysis.fraudScore,
        },
      });

      console.log(`[AI Fraud Worker] Successfully analyzed user ${userId}. Score: ${analysis.fraudScore}`);
    } catch (error: any) {
      console.error(`[AI Fraud Worker] Failed to analyze user ${userId}:`, error.message);
      
      // Fallback for Demo
      console.log(`[AI Fraud Worker] Using Mock AI Data...`);
      await prisma.user.update({
        where: { id: userId },
        data: {
          fraudScore: Math.floor(Math.random() * 90) + 10, // Mock random score between 10 and 100
        },
      });
    }
  },
  { connection: redisConnection }
);

aiFraudWorker.on("completed", (job) => {
  console.log(`Fraud check job ${job.id} completed!`);
});

aiFraudWorker.on("failed", (job, err) => {
  console.log(`Fraud check job ${job?.id} failed with error ${err.message}`);
});
