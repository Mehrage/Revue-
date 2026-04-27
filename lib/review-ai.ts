import { GoogleGenerativeAI } from "@google/generative-ai";

export type ReviewInput = {
  diff: string;
  prTitle: string;
  prBody?: string | null;
};

export type ReviewOutput = {
  summary: string;
};

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is missing. Add it to your .env file.");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

  const response = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 800,
    },
  });

  const text = response.response.text();
  if (!text) throw new Error("The model returned no text");

  return { summary: text.trim() };
}