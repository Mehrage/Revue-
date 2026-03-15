export type ReviewInput = {
  diff: string;
  prTitle: string;
  prBody?: string | null;
  changedFiles?: string[];
  repoName?: string;
}

export type ReviewOutput = {
  summary: string;
  mermaid: string;
  impactScore?: number;
}

export async function generateReview(input: ReviewInput): Promise<ReviewOutput> {
  const res = await fetch(`${process.env.REPLIT_SERVICE_URL}/api/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text ?? "Review service failed")
  }

  const data = await res.json()
  return {
    summary: data.summary,
    mermaid: data.mermaid,
    impactScore: data.impactScore,
  }
}