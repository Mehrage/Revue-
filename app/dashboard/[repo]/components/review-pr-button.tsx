"use client";
import { useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; 

const GOLD = "#c4994a";
const GOLD_DIM = "rgba(196,153,74,0.08)";
const GOLD_BORDER = "rgba(196,153,74,0.22)";

type Props = {
  owner: string;
  repo: string;
  prNumber: number;
};

export function ReviewPrButton({ owner, repo, prNumber }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      
      // Refresh the page so the ReviewAccordion can show the fresh data
      router.refresh(); 
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Review failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shrink-0 ml-auto flex items-center gap-4">
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
    </div>
  );
}