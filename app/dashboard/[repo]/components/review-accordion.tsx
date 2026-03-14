"use client"

import { useState } from "react"
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import { MermaidChart } from "./mermaid-chart"

const GOLD = "#c4994a"
const GOLD_DIM = "rgba(196,153,74,0.08)"
const GOLD_BORDER = "rgba(196,153,74,0.22)"

export default function ReviewAccordion({ content, mermaid }: { content: string; mermaid: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full flex flex-col items-end">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-emerald-500/10"
        style={{
          color: "rgba(52,211,153,0.7)",
          border: "1px solid rgba(52,211,153,0.15)",
          background: isOpen ? "rgba(52,211,153,0.05)" : "transparent"
        }}
      >
        <Sparkles className="w-3 h-3" />
        {isOpen ? "Hide Review" : "View Review"}
        {isOpen ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
      </button>

      {isOpen && (
        <div className="w-full mt-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex w-full min-h-[350px] gap-5 p-5 rounded-xl"
            style={{ background: "rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.03)" }}>

            {/* Left — Summary */}
            <div className="flex-1 flex flex-col rounded-xl p-5 overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.018)" }}>
              <h3 style={{ color: GOLD }} className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-3">AI Summary</h3>
              <div className="flex-1 overflow-y-auto text-[#c0c3d4] text-xs leading-relaxed whitespace-pre-wrap break-words pr-2">
                {content}
              </div>
            </div>

            {/* Middle — Steps */}
            <div className="w-28 shrink-0 flex flex-col justify-center gap-2.5">
              {["Bugs", "Security", "Style", "Performance", "Complete"].map((step, i) => (
                <div key={step}
                  className="h-9 w-full rounded-lg flex items-center justify-center text-[11px] font-medium"
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
                {mermaid
                  ? <MermaidChart chart={mermaid} />
                  : "No visual architecture changes detected."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}