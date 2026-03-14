import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { prNumber, repoName } = await request.json()

    // This removes the specific review for this user and PR
    await prisma.review.deleteMany({
      where: {
        userId: session.user.id,
        prNumber: prNumber,
        repoName: repoName,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}