import { GitPullRequest, ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "@/components/aurora-background";
import { ReviewDemo } from "@/components/review-demo";
import { FadeIn } from "@/components/fade-in";

export default function Home() {
  return (
    <div className="min-h-screen text-neutral-100 antialiased selection:bg-neutral-800">
      <AuroraBackground />

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

      {/* Hero */}
      <section className="pt-36 pb-28 px-6 relative">
        <div className="max-w-3xl mx-auto">
          <FadeIn delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-full text-xs text-neutral-400 mb-8">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Now in public beta
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl font-medium tracking-tight leading-[1.15] mb-6">
              Better pull requests,
              <br />
              <span className="text-neutral-500">less review time.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-neutral-400 leading-relaxed mb-12 max-w-md">
              Revue reviews your PRs instantly—catching bugs, suggesting
              improvements, and helping your team ship faster.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex items-center gap-5">
              {/* Shimmer CTA */}
              <Link
                href="/api/auth/signin"
                className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium bg-neutral-100 text-neutral-900 rounded-lg hover:bg-white hover:shadow-lg hover:shadow-neutral-100/10 transition-all duration-300 shadow-sm shadow-neutral-900 overflow-hidden"
              >
                <span className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Github className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Get started</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 relative z-10" />
              </Link>
              <Link
                href="#how"
                className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors duration-200"
              >
                See how it works
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Live review demo */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <ReviewDemo />
        </div>
      </section>

      {/* Features */}
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
            ].map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.1} direction="up">
                <div className="group hover:translate-y-[-2px] transition-transform duration-300">
                  <h3 className="text-neutral-100 font-medium mb-2 group-hover:text-white transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed group-hover:text-neutral-400 transition-colors">
                    {f.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-28 px-6">
        <FadeIn direction="up">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-neutral-600 mb-5">Free while in beta</p>
            <Link
              href="/api/auth/signin"
              className="group relative inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium bg-neutral-100 text-neutral-900 rounded-lg hover:bg-white hover:shadow-lg hover:shadow-neutral-100/10 transition-all duration-300 shadow-sm shadow-neutral-900 overflow-hidden"
            >
              <span className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Github className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Connect your repository</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 relative z-10" />
            </Link>
          </div>
        </FadeIn>
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
