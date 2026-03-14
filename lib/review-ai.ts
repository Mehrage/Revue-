import { WatsonXAI } from "@ibm-cloud/watsonx-ai";
import { IamAuthenticator } from "ibm-cloud-sdk-core";

const REVIEW_SYSTEM_PROMPT = `You are an expert code reviewer. Review the following pull request diff and provide a concise, actionable code review.`;

export type ReviewInput = {
  diff: string;
  prTitle: string;
  prBody?: string | null;
};
export type ReviewOutput = {
  summary: string;
  mermaid: string;
}

export async function generateReview(input: ReviewInput): Promise<ReviewOutput> {
  const apiKey = process.env.WATSONX_API_KEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const url = process.env.WATSONX_URL;

  if (!apiKey || !projectId || !url) {
    throw new Error("Missing WATSONX_API_KEY, WATSONX_PROJECT_ID, or WATSONX_URL");
  }

  const watsonx = new WatsonXAI({
    version: "2024-05-31",
    serviceUrl: url,
    authenticator: new IamAuthenticator({ apikey: apiKey }),
  });

  const response = await watsonx.generateText({
    input: `You are an expert code reviewer. Review this pull request and be concise and direct.

PR: ${input.prTitle}
${input.prBody ? `Description: ${input.prBody}` : ""}

Diff:
\`\`\`diff
${input.diff.slice(0, 90000)}
\`\`\`

Provide feedback in these exact sections:
- Bugs and logic errors
- Security issues
- Code style and maintainability
- Performance concerns
- Missing tests or error handling
- Suggestions for improvement

If a section has nothing to report, write "None."

CRITICAL: At the very end of your response, you MUST include a Mermaid.js flowchart illustrating the architecture, logic, or flow of the changes. Wrap the flowchart strictly inside \`\`\`mermaid and \`\`\` tags. DO NOT output JSON. Write plain text only.`,
    modelId: "meta-llama/llama-3-3-70b-instruct",
    projectId,
    parameters: {
      max_new_tokens: 800, // Bumped this slightly so it has room to draw the graph
      temperature: 0.3,
      // Removed the "```diff" stop sequence so it doesn't accidentally cut off our mermaid block
      stop_sequences: ["\nNote", "\nHowever", "\nThe final", "\nGiven", "\nStep"],
    }
  });

  let text = response.result?.results?.[0]?.generated_text;
  if (!text) throw new Error("Watsonx returned no text");

  // Safely extract the Mermaid block and the Summary text
  const mermaidMatch = text.match(/```mermaid\n([\s\S]*?)\n```/);
  const mermaidCode = mermaidMatch ? mermaidMatch[1].trim() : "flowchart LR\n  A[No diagram available]";
  const summaryText = mermaidMatch ? text.replace(mermaidMatch[0], "").trim() : text.trim();

  return {
    summary: summaryText,
    mermaid: mermaidCode,
  };
}