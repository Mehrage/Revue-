import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
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
  feature: { bg: "bg-indigo-500/10", text: "text-indigo-400", dot: "bg-indigo-400" },
  bug: { bg: "bg-rose-500/10", text: "text-rose-400", dot: "bg-rose-400" },
  refactor: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
  chore: { bg: "bg-neutral-500/10", text: "text-neutral-400", dot: "bg-neutral-500" },
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
  })

  return (
    <div className="h-screen bg-[#0a0a0f] text-neutral-100 flex overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 h-full flex flex-col shrink-0 border-r border-white/5">

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <GitPullRequest className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-white">revue</span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">beta</span>
        </div>

        {/* Search */}
        <div className="px-3 pt-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-neutral-500 hover:border-white/10 transition-colors cursor-text">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs">Search repos...</span>
          </div>
        </div>

        {/* Repos */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          <p className="px-3 text-[10px] font-semibold text-neutral-600 uppercase tracking-widest mb-2">
            Repositories
          </p>
          <nav className="space-y-0.5">
            {repos.map((repo, i) => (
              <button
                key={repo.id}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 group ${
                  i === 0
                    ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                    : "text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
                }`}
              >
                <GitBranch className={`w-3.5 h-3.5 shrink-0 ${i === 0 ? "text-indigo-400" : "text-neutral-600 group-hover:text-neutral-400"}`} />
                <span className="truncate">{repo.name}</span>
                {repo.open_issues_count > 0 && (
                  <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                    i === 0 ? "bg-indigo-500/20 text-indigo-300" : "bg-white/5 text-neutral-500"
                  }`}>
                    {repo.open_issues_count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            {session.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? ""}
                className="w-7 h-7 rounded-full ring-1 ring-white/10"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-neutral-300 truncate">
                {session.user?.name}
              </p>
              <p className="text-[10px] text-neutral-600 truncate">
                {session.user?.email}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 h-full">

        {/* Topbar */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-400">my-app</span>
            <span className="text-neutral-700">/</span>
            <span className="text-white font-medium">Pull requests</span>
          </div>
          <button className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition-all duration-150 shadow-lg shadow-indigo-500/20">
            <Zap className="w-3 h-3" />
            Review all
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-8 space-y-8">

            {/* Header */}
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">Pull Requests</h1>
              <p className="text-sm text-neutral-500 mt-1">
                {pendingCount} pending review · {reviewedCount} reviewed
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
                <p className="text-3xl font-bold text-white relative">{PLACEHOLDER_PRS.length}</p>
                <p className="text-xs text-neutral-500 mt-1 relative">Open PRs</p>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <GitPullRequest className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
                <p className="text-3xl font-bold text-white relative">{pendingCount}</p>
                <p className="text-xs text-neutral-500 mt-1 relative">Pending review</p>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Circle className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                <p className="text-3xl font-bold text-white relative">{reviewedCount}</p>
                <p className="text-xs text-neutral-500 mt-1 relative">Reviewed</p>
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
                    className="group flex items-center gap-4 px-5 py-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-150 cursor-pointer"
                  >
                    {/* Status dot */}
                    <div className="shrink-0">
                      {pr.reviewed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-neutral-700 group-hover:text-neutral-500 transition-colors" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                        <p className="text-sm font-medium text-neutral-200 truncate group-hover:text-white transition-colors">
                          {pr.title}
                        </p>
                        <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.text}`}>
                          {label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-neutral-600">
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
                        <span className="text-rose-600">-{pr.deletions}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0">
                      {pr.reviewed ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-500/60 font-medium">
                          <Sparkles className="w-3 h-3" />
                          Reviewed
                        </div>
                      ) : (
                        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-medium border border-indigo-500/20 hover:border-indigo-500/30 transition-all duration-150">
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
