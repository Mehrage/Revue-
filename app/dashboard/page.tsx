import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignOutButton } from "./components/sign-out-button"
import { GitPullRequest, ChevronRight, GitBranch, Clock, CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"

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
    author: "habisahmad",
    branch: "feat/auth",
    updatedAt: "2h ago",
    reviewed: false,
  },
  {
    id: 102,
    number: 41,
    title: "Fix payment processing bug",
    author: "habisahmad",
    branch: "fix/payments",
    updatedAt: "5h ago",
    reviewed: true,
  },
  {
    id: 103,
    number: 40,
    title: "Refactor database queries for performance",
    author: "habisahmad",
    branch: "refactor/db",
    updatedAt: "1d ago",
    reviewed: false,
  },
]

export default async function DashboardPage() {
  const session = await auth()

  if (!session) redirect("/")

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800/60 flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-neutral-800/60">
          <div className="p-1.5 bg-neutral-800 rounded-md">
            <GitPullRequest className="w-4 h-4 text-neutral-300" />
          </div>
          <span className="font-medium tracking-tight">revue</span>
        </div>

        {/* Repos */}
        <div className="flex-1 overflow-y-auto py-4">
          <p className="px-4 text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
            Repositories
          </p>
          <nav className="space-y-0.5 px-2">
            {PLACEHOLDER_REPOS.map((repo, i) => (
              <button
                key={repo.id}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                  i === 0
                    ? "bg-neutral-800 text-neutral-100"
                    : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <GitBranch className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{repo.name}</span>
                </div>
                {repo.prs > 0 && (
                  <span className="text-[11px] bg-neutral-700 text-neutral-300 px-1.5 py-0.5 rounded-full shrink-0">
                    {repo.prs}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User */}
        <div className="p-4 border-t border-neutral-800/60">
          <div className="flex items-center gap-3">
            {session.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name ?? ""}
                className="w-7 h-7 rounded-full"
              />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-200 truncate">
                {session.user?.name}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 border-b border-neutral-800/60 flex items-center justify-between px-6 shrink-0">
          <div>
            <h1 className="text-sm font-medium text-neutral-100">my-app</h1>
            <p className="text-xs text-neutral-500">3 open pull requests</p>
          </div>
          <SignOutButton />
        </div>

        {/* PR list */}
        <div className="flex-1 p-6">
          <div className="space-y-2">
            {PLACEHOLDER_PRS.map((pr) => (
              <div
                key={pr.id}
                className="group flex items-center gap-4 p-4 rounded-xl border border-neutral-800/60 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-neutral-700/60 transition-all duration-150 cursor-pointer"
              >
                <div className="shrink-0">
                  {pr.reviewed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-100 truncate group-hover:text-white transition-colors">
                    {pr.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-neutral-500">#{pr.number}</span>
                    <span className="text-xs text-neutral-600">·</span>
                    <span className="text-xs text-neutral-500 font-mono">{pr.branch}</span>
                    <span className="text-xs text-neutral-600">·</span>
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <Clock className="w-3 h-3" />
                      {pr.updatedAt}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {pr.reviewed ? (
                    <span className="text-xs text-emerald-500/80 font-medium">Reviewed</span>
                  ) : (
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-100 transition-all duration-150 flex items-center gap-1.5">
                      Review
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
