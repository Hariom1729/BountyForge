import OpenAI from "openai";

// Make sure to add OPENAI_API_KEY to your .env
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
