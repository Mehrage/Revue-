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
  GitMerge,
  Sparkles,
  Search,
} from "lucide-react"

const PLACEHOLDER_REPOS = [
  { id: 1, name: "my-app", owner: "habisahmad", prs: 3 },
  { id: 2, name: "api-server", owner: "habisahmad", prs: 1 },
  { id: 3, name: "design-system", owner: "habisahmad", prs: 5 },
]

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

const LABEL_STYLES: Record<string, string> = {
  feature: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  bug: "bg-red-500/10 text-red-400 border-red-500/20",
  refactor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  chore: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
}

const reviewedCount = PLACEHOLDER_PRS.filter((p) => p.reviewed).length
const pendingCount = PLACEHOLDER_PRS.filter((p) => !p.reviewed).length

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/")


  const account = await prisma.account.findFirst({
    where: { 
      userId: session?.user?.id, 
      provider: "github"
    },
  })

  const octokit = new Octokit({
    auth: account?.access_token,
  })

  const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
    type: "owner",
  })
  console.log("Fetched repos:", repos.length)
  for (const repo of repos) {
    console.log(`Repo: ${repo.full_name} (ID: ${repo.id})`)
    
    const { data: prs } = await octokit.rest.pulls.list({
      owner: repo.owner.login,
      repo: repo.name,
      state: "open",
    })
    console.log(`  Open PRs: ${prs.length}`)
  }


  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex">

      {/* Sidebar */}
      <aside className="w-60 border-r border-neutral-800/60 flex flex-col shrink-0 bg-neutral-900/30">

        {/* Logo */}
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-neutral-800/60">
          <div className="p-1.5 bg-neutral-800 rounded-md">
            <GitPullRequest className="w-4 h-4 text-neutral-300" />
          </div>
          <span className="font-medium tracking-tight">revue</span>
        </div>

        {/* Search */}
        <div className="px-3 pt-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800/50 border border-neutral-700/40 text-neutral-500">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs">Search repos...</span>
          </div>
        </div>

        {/* Repos */}
        <div className="flex-1 overflow-y-auto py-2">
          <p className="px-4 text-[10px] font-semibold text-neutral-600 uppercase tracking-widest mb-1.5">
            Repositories
          </p>
          <nav className="space-y-0.5 px-2">
            {repos.map((repo, i) => (
              <button
                key={repo.id}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                  i === 0
                    ? "bg-neutral-800 text-neutral-100"
                    : "text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <GitBranch className="w-3.5 h-3.5 shrink-0 text-neutral-500" />
                  <span className="truncate text-sm">{repo.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* User */}
        <div className="p-3 border-t border-neutral-800/60">
          <div className="flex items-center gap-2.5 px-1">
            {session.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? ""}
                className="w-7 h-7 rounded-full ring-1 ring-neutral-700"
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
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <div className="h-14 border-b border-neutral-800/60 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-100">my-app</span>
            <span className="text-neutral-700">/</span>
            <span className="text-sm text-neutral-500">Pull requests</span>
          </div>
          <SignOutButton />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Open PRs", value: PLACEHOLDER_PRS.length, icon: GitMerge, color: "text-neutral-300" },
                { label: "Pending review", value: pendingCount, icon: Circle, color: "text-amber-400" },
                { label: "Reviewed", value: reviewedCount, icon: CheckCircle2, color: "text-emerald-400" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-neutral-800/60 bg-neutral-900/30"
                >
                  <stat.icon className={`w-4 h-4 ${stat.color} shrink-0`} />
                  <div>
                    <p className="text-lg font-semibold text-neutral-100 leading-none">{stat.value}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* PR list */}
            <div className="space-y-2">
              {PLACEHOLDER_PRS.map((pr) => (
                <div
                  key={pr.id}
                  className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-neutral-800/60 bg-neutral-900/20 hover:bg-neutral-900/50 hover:border-neutral-700/60 transition-all duration-150 cursor-pointer"
                >
                  {/* Status */}
                  <div className="shrink-0">
                    {pr.reviewed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-neutral-600" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-neutral-100 truncate group-hover:text-white transition-colors">
                        {pr.title}
                      </p>
                      {pr.labels.map((label) => (
                        <span
                          key={label}
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${LABEL_STYLES[label] ?? LABEL_STYLES.chore}`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-600">#{pr.number}</span>
                      <span className="text-xs text-neutral-700">·</span>
                      <span className="text-xs text-neutral-600 font-mono">{pr.branch}</span>
                      <span className="text-xs text-neutral-700">·</span>
                      <div className="flex items-center gap-1 text-xs text-neutral-600">
                        <Clock className="w-3 h-3" />
                        {pr.updatedAt}
                      </div>
                      <span className="text-xs text-neutral-700">·</span>
                      <span className="text-xs text-emerald-600/80">+{pr.additions}</span>
                      <span className="text-xs text-red-600/80">-{pr.deletions}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {pr.reviewed ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-500/70 font-medium">
                        <Sparkles className="w-3 h-3" />
                        Reviewed
                      </div>
                    ) : (
                      <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-white text-neutral-900 font-medium transition-all duration-150">
                        Review
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
