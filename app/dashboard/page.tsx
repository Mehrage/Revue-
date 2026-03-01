import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SignOutButton } from "./components/sign-out-button"
import { Octokit } from "@octokit/rest"
import { prisma } from "@/lib/prisma"
import {
  GitPullRequest,
  ChevronRight,
  GitBranch,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Search,
  Zap,
} from "lucide-react"

const GOLD = "#c4994a"
const GOLD_DIM = "rgba(196,153,74,0.08)"
const GOLD_BORDER = "rgba(196,153,74,0.22)"

const PLACEHOLDER_PRS = [
  {
    id: 101,
    number: 42,
    title: "Add user authentication flow",
    branch: "feat/auth",
    updatedAt: "2h ago",
    additions: 312,
    deletions: 45,
    labels: ["feature"],
    reviewed: false,
  },
  {
    id: 102,
    number: 41,
    title: "Fix payment processing race condition",
    branch: "fix/payments",
    updatedAt: "5h ago",
    additions: 28,
    deletions: 14,
    labels: ["bug"],
    reviewed: true,
  },
  {
    id: 103,
    number: 40,
    title: "Refactor database queries for performance",
    branch: "refactor/db",
    updatedAt: "1d ago",
    additions: 180,
    deletions: 220,
    labels: ["refactor"],
    reviewed: false,
  },
  {
    id: 104,
    number: 39,
    title: "Update dependencies to latest stable versions",
    branch: "chore/deps",
    updatedAt: "2d ago",
    additions: 5,
    deletions: 5,
    labels: ["chore"],
    reviewed: true,
  },
]

const LABEL_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  feature: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  bug: { bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-400" },
  refactor: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
  chore: { bg: "bg-neutral-500/10", text: "text-neutral-500", dot: "bg-neutral-600" },
}

const reviewedCount = PLACEHOLDER_PRS.filter((p) => p.reviewed).length
const pendingCount = PLACEHOLDER_PRS.filter((p) => !p.reviewed).length

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/")

  const account = await prisma.account.findFirst({
    where: {
      userId: session?.user?.id,
      provider: "github",
    },
  })

  const octokit = new Octokit({
    auth: account?.access_token,
  })

  const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
    type: "owner",
    sort: "pushed",
    html_url: true,
  })

  return (
    <div className="h-screen text-[#e6e8f0] flex overflow-hidden" style={{ background: "#07090f" }}>

      {/* Sidebar */}
      <aside
        className="w-64 h-full flex flex-col shrink-0"
        style={{ borderRight: "1px solid rgba(255,255,255,0.045)" }}
      >

        {/* Logo */}
        <div
          className="h-16 flex items-center gap-3 px-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(196,153,74,0.6) 0%, rgba(196,153,74,0.3) 100%)",
              boxShadow: "0 4px 16px rgba(196,153,74,0.15)",
              border: "1px solid rgba(196,153,74,0.3)",
            }}
          >
            <GitPullRequest className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-[#e6e8f0]">revue</span>
          <span
            className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium"
            style={{
              background: GOLD_DIM,
              color: GOLD,
              border: `1px solid ${GOLD_BORDER}`,
            }}
          >
            beta
          </span>
        </div>

        {/* Search */}
        <div className="px-3 pt-4 pb-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-text transition-colors duration-150"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.055)",
              color: "#52556a",
            }}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs">Search repos...</span>
          </div>
        </div>

        {/* Repos */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#3a3d50" }}>
            Repositories
          </p>
          <nav className="space-y-0.5">
            {repos.map((repo, i) => (
              <Link
                key={repo.id}
                href={`/dashboard/${repo.name}`}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 group`}
                style={
                  i === 0
                    ? {
                        background: GOLD_DIM,
                        color: GOLD,
                        border: `1px solid ${GOLD_BORDER}`,
                      }
                    : {
                        color: "#52556a",
                      }
                }
              >
                <GitBranch
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: i === 0 ? GOLD : "#3a3d50" }}
                />
                <span className="truncate">{repo.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User */}
        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.045)" }}>
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer">
            {session.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? ""}
                className="w-7 h-7 rounded-full"
                style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#c0c3d4] truncate">
                {session.user?.name}
              </p>
              <p className="text-[10px] truncate" style={{ color: "#3a3d50" }}>
                {session.user?.email}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 h-full">

        {/* Top bar */}
        <div
          className="h-16 flex items-center justify-between px-8 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.045)" }}
        >
          <div className="flex items-center gap-2 text-sm">
            <span style={{ color: "#52556a" }}>my-app</span>
            <span style={{ color: "#2a2d3a" }}>/</span>
            <span className="font-medium text-[#e6e8f0]">Pull requests</span>
          </div>
          <button
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-150"
            style={{
              background: GOLD_DIM,
              border: `1px solid ${GOLD_BORDER}`,
              color: GOLD,
            }}
          >
            <Zap className="w-3 h-3" />
            Review all
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* Subtle ambient top glow */}
          <div
            className="absolute top-0 left-64 right-0 h-48 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 100% at 50% -20%, rgba(196,153,74,0.045) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-3xl mx-auto px-8 py-8 space-y-8 relative">

            {/* Header */}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#eceef6]">
                Pull Requests
              </h1>
              <p className="text-sm mt-1" style={{ color: "#52556a" }}>
                {pendingCount} pending review · {reviewedCount} reviewed
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {/* Open PRs */}
              <div
                className="relative overflow-hidden rounded-xl p-4"
                style={{
                  border: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(255,255,255,0.018)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 100% 80% at 0% 0%, rgba(196,153,74,0.06) 0%, transparent 70%)",
                  }}
                />
                <p className="text-3xl font-bold text-[#eceef6] relative">{PLACEHOLDER_PRS.length}</p>
                <p className="text-xs mt-1 relative" style={{ color: "#52556a" }}>Open PRs</p>
                <div
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: GOLD_DIM }}
                >
                  <GitPullRequest className="w-4 h-4" style={{ color: GOLD }} />
                </div>
              </div>

              {/* Pending */}
              <div
                className="relative overflow-hidden rounded-xl p-4"
                style={{
                  border: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(255,255,255,0.018)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 100% 80% at 0% 0%, rgba(245,158,11,0.05) 0%, transparent 70%)",
                  }}
                />
                <p className="text-3xl font-bold text-[#eceef6] relative">{pendingCount}</p>
                <p className="text-xs mt-1 relative" style={{ color: "#52556a" }}>Pending review</p>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Circle className="w-4 h-4 text-amber-400" />
                </div>
              </div>

              {/* Reviewed */}
              <div
                className="relative overflow-hidden rounded-xl p-4"
                style={{
                  border: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(255,255,255,0.018)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 100% 80% at 0% 0%, rgba(16,185,129,0.05) 0%, transparent 70%)",
                  }}
                />
                <p className="text-3xl font-bold text-[#eceef6] relative">{reviewedCount}</p>
                <p className="text-xs mt-1 relative" style={{ color: "#52556a" }}>Reviewed</p>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* PR list */}
            <div className="space-y-2">
              {PLACEHOLDER_PRS.map((pr) => {
                const label = pr.labels[0]
                const style = LABEL_STYLES[label] ?? LABEL_STYLES.chore
                return (
                  <div
                    key={pr.id}
                    className="group flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-150 cursor-pointer"
                    style={{
                      border: "1px solid rgba(255,255,255,0.05)",
                      background: "rgba(255,255,255,0.018)",
                    }}
                  >
                    {/* Status */}
                    <div className="shrink-0">
                      {pr.reviewed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4" style={{ color: "#2a2d3a" }} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                        <p className={`text-sm font-medium truncate text-[#c0c3d4] group-hover:text-[#e6e8f0] transition-colors`}>
                          {pr.title}
                        </p>
                        <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.text}`}>
                          {label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs" style={{ color: "#3a3d50" }}>
                        <span className="font-mono">#{pr.number}</span>
                        <span>·</span>
                        <span className="font-mono">{pr.branch}</span>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {pr.updatedAt}
                        </div>
                        <span>·</span>
                        <span className="text-emerald-600">+{pr.additions}</span>
                        <span className="text-rose-700">-{pr.deletions}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0">
                      {pr.reviewed ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "rgba(52,211,153,0.5)" }}>
                          <Sparkles className="w-3 h-3" />
                          Reviewed
                        </div>
                      ) : (
                        <button
                          className="flex items-center gap-1.5 text-xs font-medium rounded-lg transition-all duration-150"
                          style={{
                            padding: "6px 12px",
                            background: GOLD_DIM,
                            border: `1px solid ${GOLD_BORDER}`,
                            color: GOLD,
                          }}
                        >
                          Review
                          <ChevronRight className="w-3 h-3" />
                        </button>
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
