import OpenAI from "openai";

export type ReviewInput = {
  diff: string;
  prTitle: string;
  prBody?: string | null;
};

export type ReviewOutput = {
  summary: string;
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "test", 
  baseURL: "https://vjioo4r1vyvcozuj.us-east-2.aws.endpoints.huggingface.cloud/v1",
});

export async function generateReview(input: ReviewInput): Promise<ReviewOutput> {
  const systemPrompt = `You are a cold, robotic code analysis tool. 
- NO greetings or conversational text. 
- BE EXTREMELY CONCISE. You are limited to ONE short bullet point per category.
- If a category has no issues, write "None."

Template:
- Bugs: [Max 1 short sentence]
- Security: [Max 1 short sentence]
- Style: [Max 1 short sentence]
- Performance: [Max 1 short sentence]
- Tests: [Max 1 short sentence]
- Suggestions: [Max 2 short bullet points]`;

  const userPrompt = `PR: ${input.prTitle}\nDiff:\n${input.diff.slice(0, 50000)}`;

  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-120b", 
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 800,
    temperature: 0.1,
    // ✅ FIX 1: Tell the API to stop if it tries to start a polite sentence
    stop: ["Let me know", "I hope this", "###", "Note:"], 
  });

  let text = response.choices[0]?.message?.content || "";
  if (!text) throw new Error("The model returned no text");

  // If the model ignores the stop sequence and still writes "Let me know..."
  const noisePhrases = ["Let me know", "I hope this", "Please feel free", "Overall,"];
  noisePhrases.forEach(phrase => {
    if (text.includes(phrase)) {
      text = text.split(phrase)[0].trim();
    }
  });

  return {
    summary: text.trim(),
  };
}