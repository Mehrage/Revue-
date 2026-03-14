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
        where: { 
          repoName: repoName,
          userId: session.user?.id 
        }
      })

      
      const prs = pulls.map((pr) => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        branch: pr.head.ref,
        updatedAt: new Date(pr.updated_at).toLocaleDateString(),
        labels: pr.labels.map((l) => l.name ?? "chore"),
        
        reviewed: dbReviews.some(rev => rev.prNumber === pr.number),
      }))

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
        <div className="w-full px-8 py-8 space-y-8 relative overflow-hidden">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#eceef6]">{repoName}</h1>
              <p className="text-sm mt-1" style={{ color: "#52556a" }}>{pendingCount} pending review · {reviewedCount} reviewed</p>
            </div>

            <div className="space-y-2 w-full overflow-hidden">
              {prs.length === 0 ? (
                <p className="text-sm" style={{ color: "#52556a" }}>No open pull requests for this repo.</p>
              ) : prs.map((pr) => {
                const label = pr.labels[0]
                const style = LABEL_STYLES[label] ?? LABEL_STYLES.chore
                return (
                  <div key={pr.id} className="flex flex-col px-5 py-4 rounded-xl transition-all duration-150 w-full min-w-0 overflow-hidden"
                    style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.018)" }}>

                    {/* PR info row */}
                    <div className="flex flex-wrap items-center gap-4 min-w-0">
                      <div className="shrink-0">
                        {pr.reviewed
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          : <Circle className="w-4 h-4" style={{ color: "#2a2d3a" }} />}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                          <p className="text-sm font-medium truncate text-[#c0c3d4] group-hover:text-[#e6e8f0] transition-colors">{pr.title}</p>
                          <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.text}`}>{label}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs" style={{ color: "#3a3d50" }}>
                          <span className="font-mono">#{pr.number}</span>
                          <span>·</span>
                          <span className="font-mono">{pr.branch}</span>
                          <span>·</span>
                          <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{pr.updatedAt}</div>
                        </div>
                      </div>
                      
                      {pr.reviewed ? (
                        <div className="shrink-0 ml-auto flex items-center gap-1.5 text-xs font-medium" style={{ color: "rgba(52,211,153,0.5)" }}>
                          <Sparkles className="w-3 h-3" />Reviewed
                        </div>
                      ) : (
                        <ReviewPrButton owner={owner} repo={repoName} prNumber={pr.number} />
                      )}
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}