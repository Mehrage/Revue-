import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Octokit } from "@octokit/rest"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { SignOutButton } from "../components/sign-out-button"
import {
  GitPullRequest, GitBranch,
  Clock, CheckCircle2, Circle, Sparkles, Search, Zap,
} from "lucide-react"
import { ReviewPrButton } from "./components/review-pr-button"
import ReviewAccordion from "./components/review-accordion"
import { DeleteReviewButton } from "./components/delete-button"

const GOLD = "#c4994a"
const GOLD_DIM = "rgba(196,153,74,0.08)"
const GOLD_BORDER = "rgba(196,153,74,0.22)"

const LABEL_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  feature: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  bug: { bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-400" },
  refactor: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
  chore: { bg: "bg-neutral-500/10", text: "text-neutral-500", dot: "bg-neutral-600" },
}

export default async function RepoDashboardPage({ params }: { params: Promise<{ repo: string }> }) {
  const { repo: repoName } = await params
  const session = await auth()
  if (!session) redirect("/")

  const account = await prisma.account.findFirst({
    where: { userId: session?.user?.id, provider: "github" },
  })

  const octokit = new Octokit({ auth: account?.access_token })

  const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
    type: "owner",
    sort: "pushed",
  })

  const currentRepo = repos.find((r) => r.name === repoName)
  const owner = currentRepo?.owner?.login ?? session.user?.name ?? ""

  const { data: pulls } = await octokit.rest.pulls.list({
    owner,
    repo: repoName,
    state: "open",
  })

  
    const dbReviews = await prisma.review.findMany({
      where: { repoName: repoName, userId: session.user.id }
      });

      
      const prs = pulls.map((pr) => {
        // Find the full review object from the database
        const dbReview = dbReviews.find(rev => rev.prNumber === pr.number);
      
        return {
          id: pr.id,
          number: pr.number,
          title: pr.title,
          branch: pr.head.ref,
          updatedAt: new Date(pr.updated_at).toLocaleDateString(),
          labels: pr.labels.map((l) => l.name ?? "chore"),
          
          reviewed: !!dbReview,
          reviewContent: dbReview?.content || "",
        }
      })

  const pendingCount = prs.filter((p) => !p.reviewed).length
  const reviewedCount = prs.filter((p) => p.reviewed).length

  return (
    <div className="h-screen text-[#e6e8f0] flex overflow-hidden" style={{ background: "#07090f" }}>

      {/* Sidebar */}
      <aside className="w-64 h-full flex flex-col shrink-0" style={{ borderRight: "1px solid rgba(255,255,255,0.045)" }}>
        <div className="h-16 flex items-center gap-3 px-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(196,153,74,0.6) 0%, rgba(196,153,74,0.3) 100%)", border: "1px solid rgba(196,153,74,0.3)" }}>
            <GitPullRequest className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-[#e6e8f0]">revue</span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium"
            style={{ background: GOLD_DIM, color: GOLD, border: `1px solid ${GOLD_BORDER}` }}>beta</span>
        </div>

        <div className="px-3 pt-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.055)", color: "#52556a" }}>
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs">Search repos...</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#3a3d50" }}>Repositories</p>
          <nav className="space-y-0.5">
            <Link href="/dashboard" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm" style={{ color: "#52556a" }}>
              <GitPullRequest className="w-3.5 h-3.5 shrink-0" style={{ color: "#3a3d50" }} />
              <span className="truncate">All Repositories</span>
            </Link>
            {repos.map((repo) => (
              <Link key={repo.id} href={`/dashboard/${repo.name}`}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150"
                style={repo.name === repoName ? { background: GOLD_DIM, color: GOLD, border: `1px solid ${GOLD_BORDER}` } : { color: "#52556a" }}>
                <GitBranch className="w-3.5 h-3.5 shrink-0" style={{ color: repo.name === repoName ? GOLD : "#3a3d50" }} />
                <span className="truncate">{repo.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.045)" }}>
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer">
            {session.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt={session.user.name ?? ""} className="w-7 h-7 rounded-full" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#c0c3d4] truncate">{session.user?.name}</p>
              <p className="text-[10px] truncate" style={{ color: "#3a3d50" }}>{session.user?.email}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        <div className="h-16 flex items-center justify-between px-8 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}>
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: "#52556a" }}>{repoName}</span>
            <span style={{ color: "#2a2d3a" }}>/</span>
            <span className="font-medium text-[#e6e8f0]">Pull requests</span>
          </div>
          <button className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, color: GOLD }}>
            <Zap className="w-3 h-3" />
            Review all
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] w-full mx-auto px-8 py-8 space-y-8 relative">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#eceef6]">{repoName}</h1>
              <p className="text-sm mt-1" style={{ color: "#52556a" }}>{pendingCount} pending review · {reviewedCount} reviewed</p>
            </div>

            <div className="space-y-2 w-full overflow-hidden">
              {prs.length === 0 ? (
                <p className="text-sm" style={{ color: "#52556a" }}>No open pull requests for this repo.</p>
              ) : (
                prs.map((pr) => (
                <div 
                  key={pr.id} 
                  className="flex flex-col w-full p-5 rounded-xl border border-white/5 bg-white/[0.018] overflow-hidden"
                  >
            
                  {/* --- CARD HEADER --- */}
                  <div className="flex items-start justify-between w-full border-b border-white/5 pb-4 mb-4">
                    {/* Left: PR Info */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {pr.reviewed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#2a2d3a]" />
                        )}
                        <h3 className="text-sm font-medium text-[#e6e8f0]">{pr.title}</h3>
                      </div>
                      <p className="text-xs text-[#52556a] pl-6">
                        #{pr.number} · {pr.branch} · {pr.updatedAt}
                      </p>
                    </div>
              
                    {/* Right: Action Button */}
                    <div className="shrink-0">
                      {pr.reviewed ? (
                        <DeleteReviewButton prNumber={pr.number} repoName={repoName} />
                      ) : (
                        <ReviewPrButton owner={owner} repo={repoName} prNumber={pr.number} />
                      )}
                    </div>
                  </div>
              
                 {/* --- CARD CONTENT (AI Review) --- */}
                 {pr.reviewed && (
                    <div className="w-full">
                      <ReviewAccordion 
                        content={pr.reviewContent} 
                      />
                    </div>
                  )} 
                </div>
              ))
            )} 
            
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}