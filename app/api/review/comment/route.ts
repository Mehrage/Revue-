import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { Octokit } from "octokit"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // 1. Grab the user's actual GitHub access token from your Prisma database
    const account = await prisma.account.findFirst({
      where: { 
        userId: session.user.id, 
        provider: "github" 
      },
    })

    if (!account?.access_token) {
      return new NextResponse("GitHub account not linked or token missing", { status: 400 })
    }

    const { repoOwner, repoName, prNumber, commentBody } = await req.json()

    // 2. Initialize Octokit with the USER'S token
    const octokit = new Octokit({ 
      auth: account.access_token 
    })

    // 3. Post the comment
    await octokit.rest.issues.createComment({
      owner: repoOwner,
      repo: repoName,
      issue_number: prNumber,
      body: commentBody,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Revue Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}