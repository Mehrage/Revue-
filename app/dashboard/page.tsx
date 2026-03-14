import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SignOutButton } from "./components/sign-out-button"
import { Octokit } from "@octokit/rest"
import { prisma } from "@/lib/prisma"
import { PRActivityChart } from "@/components/pr-activity-chart"
import {
  GitPullRequest, GitBranch, Search, GitMerge, Clock, Circle,
} from "lucide-react"

const GOLD = "#c4994a"
const GOLD_DIM = "rgba(196,153,74,0.08)"
const GOLD_BORDER = "rgba(196,153,74,0.22)"

export default async function DashboardPage() {
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

  // Fetch PRs from all repos
  const allPulls = await Promise.all(
    repos.map((repo) =>
      octokit.rest.pulls.list({
        owner: session.user?.name!,
        repo: repo.name,
        state: "all",
        per_page: 100,
      }).then((res) => res.data).catch(() => [])
    )
  )

  const pulls = allPulls.flat()

  // Build last 7 days activity
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })

  const chartData = days.map((d) => {
    const label = d.toLocaleDateString("en-US", { weekday: "short" })
    const prs = pulls.filter((pr) => {
      const created = new Date(pr.created_at)
      return created.toDateString() === d.toDateString()
    }).length
    return { day: label, prs }
  })

  const totalOpen = pulls.filter((p) => p.state === "open").length
  const totalMerged = pulls.filter((p) => p.merged_at).length
  const totalThisWeek = chartData.reduce((sum, d) => sum + d.prs, 0)

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
            <Link href="/dashboard" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm"
              style={{ background: GOLD_DIM, color: GOLD, border: `1px solid ${GOLD_BORDER}` }}>
              <GitPullRequest className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
              <span className="truncate">Overview</span>
            </Link>
            {repos.map((repo) => (
              <Link key={repo.id} href={`/dashboard/${repo.name}`}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150"
                style={{ color: "#52556a" }}>
                <GitBranch className="w-3.5 h-3.5 shrink-0" style={{ color: "#3a3d50" }} />
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
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <div className="h-16 flex items-center px-8 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}>
          <h1 className="text-sm font-medium text-[#e6e8f0]">Overview</h1>
        </div>

        <div className="w-full px-8 py-8 space-y-8">

          {/* Greeting */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#eceef6]">
              Hey {session.user?.name?.split(" ")[0]} 👋
            </h2>
            <p className="text-sm mt-1" style={{ color: "#52556a" }}>
              Here's your PR activity for the past 7 days
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="relative overflow-hidden rounded-xl p-4" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.018)" }}>
              <p className="text-3xl font-bold text-[#eceef6]">{totalThisWeek}</p>
              <p className="text-xs mt-1" style={{ color: "#52556a" }}>PRs this week</p>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: GOLD_DIM }}>
                <Clock className="w-4 h-4" style={{ color: GOLD }} />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl p-4" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.018)" }}>
              <p className="text-3xl font-bold text-[#eceef6]">{totalOpen}</p>
              <p className="text-xs mt-1" style={{ color: "#52556a" }}>Open PRs</p>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/10">
                <Circle className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl p-4" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.018)" }}>
              <p className="text-3xl font-bold text-[#eceef6]">{totalMerged}</p>
              <p className="text-xs mt-1" style={{ color: "#52556a" }}>Merged PRs</p>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10">
                <GitMerge className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl p-6" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.018)" }}>
            <p className="text-sm font-medium text-[#c0c3d4] mb-6">PRs opened per day</p>
            <PRActivityChart data={chartData} />
          </div>

        </div>
      </main>
    </div>
  )
}