import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { repoName, prNumber } = await req.json()

    // MAGIC FIX: Use deleteMany to wipe every single draft for this PR
    await prisma.review.deleteMany({
      where: {
        userId: session.user.id,
        repoName: repoName,
        prNumber: prNumber,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete reviews:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}