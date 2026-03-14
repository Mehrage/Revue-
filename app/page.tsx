import { GitPullRequest, ArrowRight, Github, Zap, Shield, GitMerge } from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "@/components/aurora-background";
import { ReviewDemo } from "@/components/review-demo";
import { FadeIn } from "@/components/fade-in";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const GOLD = "#c4994a";
const GOLD_DIM = "rgba(196,153,74,0.08)";
const GOLD_BORDER = "rgba(196,153,74,0.26)";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen text-[#e6e8f0] antialiased selection:bg-[#c4994a]/20 selection:text-[#c4994a]">
      <AuroraBackground />

      {/* Nav */}
      <nav
        className="fixed top-0 w-full z-50"
        style={{
          backdropFilter: "blur(24px) saturate(1.4)",
          WebkitBackdropFilter: "blur(24px) saturate(1.4)",
          background: "rgba(7, 9, 15, 0.78)",
          borderBottom: "1px solid rgba(255,255,255,0.042)",
        }}
      >
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex justify-between items-center h-[58px]">
            <div className="flex items-center gap-2.5">
              <div
                className="w-[26px] h-[26px] rounded-[6px] flex items-center justify-center"
                style={{ background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}` }}
              >
                <GitPullRequest className="w-3.5 h-3.5" style={{ color: GOLD }} />
              </div>
              <span className="font-semibold tracking-[-0.025em] text-[#e6e8f0]">
                revue
              </span>
            </div>
            <Link
              href="/api/auth/signin"
              className="text-sm text-[#52556a] hover:text-[#9ca0b4] transition-colors duration-200"
            >
              Sign in →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-48 pb-36 px-8 relative">
        <div className="max-w-5xl mx-auto">
          <FadeIn delay={0}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-12 rounded-full text-[11px] tracking-wide text-[#787b8e]"
              style={{
                background: "rgba(255,255,255,0.022)",
                border: "1px solid rgba(255,255,255,0.055)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: GOLD }}
              />
              Now in public beta — free for early adopters
            </div>
          </FadeIn>

          <FadeIn delay={0.07}>
            <h1 className="mb-8" style={{ lineHeight: "1.04", letterSpacing: "-0.036em" }}>
              <span
                className="block font-display italic"
                style={{ fontSize: "clamp(46px, 7.5vw, 86px)", color: "#c8cad6", fontWeight: 400 }}
              >
                Better pull requests,
              </span>
              <span
                className="block font-bold"
                style={{ fontSize: "clamp(46px, 7.5vw, 86px)", color: "#eceef6" }}
              >
                less review time
                <span style={{ color: GOLD }}>.</span>
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.13}>
            <p
              className="mb-12 leading-relaxed max-w-[460px] text-[#787b8e]"
              style={{ fontSize: "17px" }}
            >
              revue reads your PR diff and posts inline comments instantly—catching
              bugs, security holes, and code smells before your team has to.
            </p>
          </FadeIn>

          <FadeIn delay={0.19}>
            <div className="flex items-center gap-7">
              <Link
                href="/api/auth/signin"
                className="group inline-flex items-center gap-2.5 text-sm font-medium rounded-[10px] transition-all duration-300"
                style={{
                  padding: "10px 20px",
                  background: GOLD_DIM,
                  border: `1px solid ${GOLD_BORDER}`,
                  color: GOLD,
                }}
              >
                <Github className="w-4 h-4" />
                <span>Get started with GitHub</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
              <Link
                href="#how"
                className="text-sm text-[#3a3d50] hover:text-[#787b8e] transition-colors duration-200"
              >
                See a demo
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Demo */}
      <section id="how" className="py-24 px-8">
        <div className="max-w-2xl mx-auto">
          <FadeIn direction="up">
            <div className="mb-12 flex flex-col items-center text-center">
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#3a3d50] mb-3">
                Live demo
              </p>
              <p className="text-sm text-[#65677a]">
                revue catches the issues your eyes skip over
              </p>
            </div>
          </FadeIn>
          <ReviewDemo />
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-8">
        <div className="max-w-5xl mx-auto">
          <div
            className="grid sm:grid-cols-3"
            style={{
              border: "1px solid rgba(255,255,255,0.042)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {[
              {
                icon: Zap,
                title: "Instant feedback",
                desc: "Reviews post within seconds of opening a PR. No waiting, no context-switching.",
              },
              {
                icon: Shield,
                title: "Catches what you miss",
                desc: "Security issues, logic bugs, code smells — surfaced before they reach production.",
              },
              {
                icon: GitMerge,
                title: "GitHub native",
                desc: "Comments land inline on your diff. No new tools, no new workflows to learn.",
              },
            ].map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.07} direction="up">
                <div
                  className="p-8 h-full transition-colors duration-300 hover:bg-white/[0.018]"
                  style={{
                    background: "rgba(7, 9, 15, 0.97)",
                    borderRight: i < 2 ? "1px solid rgba(255,255,255,0.042)" : "none",
                  }}
                >
                  <div
                    className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center mb-6"
                    style={{
                      background: GOLD_DIM,
                      border: "1px solid rgba(196,153,74,0.16)",
                    }}
                  >
                    <f.icon className="w-[15px] h-[15px]" style={{ color: GOLD }} />
                  </div>
                  <h3 className="font-medium mb-2.5 tracking-tight text-[#e6e8f0]">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#787b8e]">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-36 px-8">
        <FadeIn direction="up">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#3a3d50] mb-10">
              Free while in beta
            </p>
            <h2
              className="mb-10"
              style={{ lineHeight: "1.08", letterSpacing: "-0.032em" }}
            >
              <span
                className="block font-display italic"
                style={{ fontSize: "clamp(36px, 5vw, 64px)", color: "#c8cad6", fontWeight: 400 }}
              >
                Ready for smarter
              </span>
              <span
                className="block font-bold"
                style={{ fontSize: "clamp(36px, 5vw, 64px)", color: "#eceef6" }}
              >
                code review<span style={{ color: GOLD }}>?</span>
              </span>
            </h2>
            <Link
              href="/api/auth/signin"
              className="group inline-flex items-center gap-2.5 text-sm font-medium rounded-[10px] transition-all duration-300"
              style={{
                padding: "11px 22px",
                background: GOLD_DIM,
                border: `1px solid ${GOLD_BORDER}`,
                color: GOLD,
              }}
            >
              <Github className="w-4 h-4" />
              <span>Connect your repository</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
            </Link>
          </div>
        </FadeIn>
      </section>

      <footer
        className="py-8 px-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-5xl mx-auto flex justify-between items-center text-xs text-[#3a3d50]">
          <span className="font-medium tracking-tight text-[#52556a]">Revue</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
