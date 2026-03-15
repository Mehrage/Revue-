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
  const systemPrompt = `You are a strict, senior code reviewer analyzing a GitHub Pull Request.
You MUST output your review as a raw, valid JSON object. Do not wrap it in markdown blockquotes or add any conversational text.

Analyze the provided code diff and generate a JSON object exactly matching this structure:
{
  "summary": "A concise 2-3 sentence summary of what these code changes actually do.",
  "impactScore": "Low", 
  "suggestions": [
    {
      "issue": "A short explanation of the bug or security flaw.",
      "codeSnippet": "The exact, corrected code block to fix the issue. Leave this as an empty string if no code change is needed."
    }
  ]
}`;

  const userPrompt = `PR: ${input.prTitle}\nDiff:\n${input.diff.slice(0, 50000)}`;

  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-120b", 
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 800,
    temperature: 0.1,
  });

  let text = response.choices[0]?.message?.content || "";
  if (!text) throw new Error("The model returned no text");

  return { summary: text.trim() };
}