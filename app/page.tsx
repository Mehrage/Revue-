import {
  GitPullRequest,
  ArrowRight,
  Github,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-neutral-800">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 -z-10" />
      
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-neutral-800 rounded-md">
                <GitPullRequest className="w-4 h-4 text-neutral-300" />
              </div>
              <span className="font-medium tracking-tight">revue</span>
            </div>
            <Link
              href="/api/auth/signin"
              className="text-sm text-neutral-500 hover:text-neutral-100 transition-colors duration-200"
            >
              Sign in →
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-36 pb-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full text-xs text-neutral-400 mb-8">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Now in public beta
          </div>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight leading-[1.15] mb-6">
            Better pull requests,
            <br />
            <span className="text-neutral-500">less review time.</span>
          </h1>
          <p className="text-lg text-neutral-400 leading-relaxed mb-12 max-w-md">
            Revue reviews your PRs instantly—catching bugs, suggesting improvements, 
            and helping your team ship faster.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/api/auth/signin"
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium bg-neutral-100 text-neutral-900 rounded-lg hover:bg-white transition-all duration-200 shadow-sm shadow-neutral-900"
            >
              <Github className="w-4 h-4" />
              Get started
              <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
            </Link>
            <Link
              href="#how"
              className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors duration-200"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <section id="how" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-px bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-xl blur-sm opacity-50" />
            <div className="relative border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/80 bg-neutral-900/30">
                <span className="text-xs text-neutral-500 font-mono">payment.ts</span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                </div>
              </div>
              <div className="p-6 font-mono text-sm leading-7">
                <div className="text-neutral-500">
                  <span className="text-neutral-400">function</span>{" "}
                  <span className="text-neutral-200">processPayment</span>
                  <span className="text-neutral-600">(amount) {"{"}</span>
                </div>
                <div className="text-neutral-500 pl-6">
                  <span className="text-neutral-400">const</span> tax = amount * <span className="text-amber-400/80">0.1</span>;
                </div>
                <div className="my-4 ml-6 py-3 px-4 bg-neutral-900/80 rounded-lg border border-neutral-800/80">
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    <span className="text-emerald-400/90 font-medium">revue</span>
                    <span className="text-neutral-600 mx-2">·</span>
                    Magic number detected. Extract <code className="text-amber-400/80 bg-neutral-800/50 px-1.5 py-0.5 rounded">0.1</code> to a named constant.
                  </p>
                </div>
                <div className="text-neutral-500 pl-6">
                  <span className="text-neutral-400">return</span> amount + tax;
                </div>
                <div className="text-neutral-600">{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                title: "Instant feedback",
                desc: "Reviews appear within seconds of opening a PR.",
              },
              {
                title: "Catches what you miss",
                desc: "Security issues, bugs, and code smells—surfaced automatically.",
              },
              {
                title: "GitHub native",
                desc: "Works in your existing workflow. No new tools.",
              },
            ].map((f) => (
              <div key={f.title}>
                <h3 className="text-neutral-100 font-medium mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-neutral-600 mb-5">Free while in beta</p>
          <Link
            href="/api/auth/signin"
            className="group inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium bg-neutral-100 text-neutral-900 rounded-lg hover:bg-white transition-all duration-200 shadow-sm shadow-neutral-900"
          >
            <Github className="w-4 h-4" />
            Connect your repository
            <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
          </Link>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto flex justify-between items-center text-xs text-neutral-600">
          <span className="font-medium text-neutral-500">revue</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
