import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const classifyIssueDifficulty = async (title: string, body: string) => {
  try {
    const prompt = `
    Analyze the following GitHub issue and classify its difficulty into one of four categories: EASY, MEDIUM, HARD, EXPERT.
    
    Issue Title: ${title}
    Issue Body: ${body}
    
    Respond with ONLY the classification word.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 10,
    });

    const result = response.choices[0].message?.content?.trim().toUpperCase();

    if (["EASY", "MEDIUM", "HARD", "EXPERT"].includes(result || "")) {
      return result as "EASY" | "MEDIUM" | "HARD" | "EXPERT";
    }

    return "MEDIUM"; // fallback
  } catch (error) {
    console.error("OpenAI Error:", error);
    return "MEDIUM"; // fallback
  }
};
