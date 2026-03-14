"use client";
import { useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { MermaidChart } from "./mermaid-chart";

const GOLD = "#c4994a";
const GOLD_DIM = "rgba(196,153,74,0.08)";
const GOLD_BORDER = "rgba(196,153,74,0.22)";

type Props = {
  owner: string;
  repo: string;
  prNumber: number;
};

export function ReviewPrButton({ owner, repo, prNumber }: Props) {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<{ text: string; graph: string | null } | null>(null);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo, prNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Review failed");
      setReview({ text: data.content, graph: data.mermaid ?? null });
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Review failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={review ? "w-full basis-full mt-4" : "shrink-0 ml-auto flex items-center gap-4"}>
      {!review && (
        <button
          onClick={handleClick}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-medium rounded-lg transition-opacity disabled:opacity-60"
          style={{ padding: "6px 12px", background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, color: GOLD }}
        >
          {loading ? (
            <><Loader2 className="w-3 h-3 animate-spin" /> Reviewing…</>
          ) : (
            <>Review <ChevronRight className="w-3 h-3" /></>
          )}
        </button>
      )}

      {review && (
        <div className="flex flex-col w-full animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex w-full min-h-[250px] gap-3 p-3 rounded-xl"
            style={{ background: "rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.03)" }}>

            {/* Left — Summary */}
            <div className="flex-1 flex flex-col rounded-xl p-5 overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.018)" }}>
              <h3 style={{ color: GOLD }} className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-3">AI Summary</h3>
              <div className="flex-1 overflow-y-auto text-[#c0c3d4] text-xs leading-relaxed whitespace-pre-wrap break-words pr-2">
                {review.text}
              </div>
            </div>

            {/* Middle — Steps */}
            <div className="w-20 shrink-0 flex flex-col justify-center gap-1.5">
              {["Bugs", "Security", "Style", "Performance", "Complete"].map((step, i) => (
                <div key={step}
                  className="h-7 w-full rounded-lg flex items-center justify-center text-[10px] font-medium"
                  style={{
                    background: i === 4 ? GOLD_DIM : "rgba(255,255,255,0.02)",
                    border: `1px solid ${i === 4 ? GOLD_BORDER : "rgba(255,255,255,0.04)"}`,
                    color: i === 4 ? GOLD : "#52556a",
                  }}>
                  {step}
                </div>
              ))}
            </div>

            {/* Right — Mermaid */}
            <div className="flex-1 flex flex-col rounded-xl p-5 overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.018)" }}>
              <h3 style={{ color: GOLD }} className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-3">Code Flow</h3>
              <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/20 text-xs text-[#52556a] overflow-auto">
                {review.graph
                  ? <MermaidChart chart={review.graph} />
                  : "No visual architecture changes detected."}
              </div>
            </div>
          </div>

          <button onClick={() => setReview(null)}
            className="self-end mt-3 px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors"
            style={{ fontSize: "11px", color: "#52556a" }}>
            Dismiss Review
          </button>
        </div>
      )}
    </div>
  );
}