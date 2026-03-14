import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { GitPullRequest, ArrowLeft } from "lucide-react"

const GOLD = "#c4994a"
const GOLD_DIM = "rgba(196,153,74,0.08)"
const GOLD_BORDER = "rgba(196,153,74,0.22)"

export default async function ReviewPage({ params }: { params: Promise<{ repo: string; pr: string }> }) {
  const { repo, pr } = await params
  const session = await auth()
  if (!session) redirect("/")

  const review = await prisma.review.findFirst({
    where: {
      userId: session.user?.id,
      repoName: repo,
      prNumber: parseInt(pr),
    },
    orderBy: { createdAt: "desc" },
  })

  if (!review) redirect(`/dashboard/${repo}`)

  return (
    <div className="min-h-screen text-[#e6e8f0]" style={{ background: "#07090f" }}>
      <div className="max-w-3xl mx-auto px-8 py-8 space-y-8">

        {/* Back button */}
        <Link href={`/dashboard/${repo}`} className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: "#52556a" }}>
          <ArrowLeft className="w-4 h-4" />
          Back to {repo}
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}` }}>
            <GitPullRequest className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#eceef6]">{review.prTitle}</h1>
            <p className="text-sm mt-1" style={{ color: "#52556a" }}>
              #{review.prNumber} · {repo}
            </p>
          </div>
        </div>

        {/* Review content */}
        <div className="rounded-xl p-6 space-y-4"
          style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.018)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: GOLD }}>
            AI Review
          </p>
          <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: "#c0c3d4" }}>
            {review.content}
          </div>
        </div>

      </div>
    </div>
  )
}