import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReview } from "@/lib/review-ai";
import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { owner: string; repo: string; prNumber: number; regenerate?: boolean };
  
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { owner, repo, prNumber, regenerate } = body;
  if (!owner || !repo || !prNumber) {
    return NextResponse.json(
      { error: "Missing owner, repo, or prNumber" },
      { status: 400 }
    );
  }

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: "github" },
  });
  if (!account?.access_token) {
    return NextResponse.json(
      { error: "No GitHub account linked" },
      { status: 403 }
    );
  }

  const octokit = new Octokit({ auth: account.access_token });

  try {
    const { data: pr } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });

    const diffResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}",
      {
        owner,
        repo,
        pull_number: prNumber,
        headers: { accept: "application/vnd.github.v3.diff" },
      }
    );
    const diff =
      typeof diffResponse.data === "string"
        ? diffResponse.data
        : String(diffResponse.data);

          
    const existing = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        repoOwner: owner,
        repoName: repo,
        prNumber,
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing && !regenerate) {
      return NextResponse.json({
        ok: true,
        reviewId: existing.id,
        content: existing.content,
      });
    }

    const result = await generateReview({
      diff,
      prTitle: pr.title,
      prBody: pr.body,
    });

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        repoOwner: owner,
        repoName: repo,
        prNumber,
        prTitle: pr.title,
        prUrl: pr.html_url ?? "",
        content: result.summary,
        diff: diff, 
      },
    });
    
    return NextResponse.json({
      ok: true,
      reviewId: review.id,
      content: review.content,
    });
    
  } catch (err) {
    console.error("Review API error:", err);
    const message = err instanceof Error ? err.message : "Review failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
