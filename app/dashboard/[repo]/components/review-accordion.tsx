"use client"

import { useState } from "react"
import { Sparkles, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react"

const GOLD = "#c4994a"
const GOLD_DIM = "rgba(196,153,74,0.08)"
const GOLD_BORDER = "rgba(196,153,74,0.22)"

export default function ReviewAccordion({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false)

  // 1. Fallback data
  let aiData = {
    summary: "Analysis unavailable or formatting error.",
    impactScore: "Unknown",
    failureRisk: 0,
    bugs: ["Could not parse AI response."]
  };

  // 2. Safely parse the AI JSON
  try {
    if (content) {
      // THE SANITIZER: Strip out the markdown backticks
      const cleanedContent = content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
        
      aiData = JSON.parse(cleanedContent);
    }
  } catch (e) {
    console.error("Failed to parse AI JSON:", e);
    aiData.summary = content; 
  }

  // 3. Mocked lines for now
  const metrics = { linesAdded: 124, linesRemoved: 32 }

  return (
    <div className="w-full flex flex-col items-end">
      {/* The Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-emerald-500/10"
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

      {/* The 3-Column Dropdown */}
      {isOpen && (
        <div className="w-full mt-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* COLUMN 1: Short Summary */}
            <div className="rounded-2xl p-6 flex flex-col"
              style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: GOLD }}>
                <Sparkles className="w-3 h-3" /> Summary of Changes
              </h3>
              <div className="text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[250px] custom-scrollbar pr-2"
                style={{ color: "#c0c3d4" }}>
                {aiData.summary}
              </div>
            </div>

            {/* COLUMN 2: Three Rows of Metrics */}
            <div className="flex flex-col gap-4">
              <div className="flex-1 rounded-2xl p-5 flex flex-col justify-center"
                style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#52556a] mb-1">Impact Score</span>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-semibold text-amber-400">{aiData.impactScore}</span>
                  <span className="text-xs text-[#52556a] mb-1">Severity</span>
                </div>
              </div>

              <div className="flex-1 rounded-2xl p-5 flex flex-col justify-center"
                style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#52556a] mb-2">Code Delta</span>
                <div className="text-lg font-mono flex items-center gap-3">
                  <span className="text-emerald-400">+{metrics.linesAdded}</span>
                  <span className="text-[#3a3d50]">/</span>
                  <span className="text-rose-400">-{metrics.linesRemoved}</span>
                </div>
              </div>

              <div className="flex-1 rounded-2xl p-5 flex flex-col justify-center"
                style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#52556a] mb-2">Automated Tests</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-sm font-medium text-[#eceef6]">No tests found</span>
                </div>
              </div>
            </div>

            {/* COLUMN 3: Bugs & Risk */}
            <div className="rounded-2xl p-6 flex flex-col"
              style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-3 h-3" /> Quality & Risk
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#c0c3d4]">Likelihood of Failing</span>
                    <span className="text-xs font-mono text-amber-400">{aiData.failureRisk}%</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-1.5">
                    <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${aiData.failureRisk}%` }}></div>
                  </div>
                </div>

                <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#52556a] mb-3 block">Identified Bugs</span>
                  <ul className="space-y-2.5">
                    {aiData.bugs.map((bug: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-[#c0c3d4]">
                        <span className="text-rose-400 mt-0.5">•</span>
                        {bug}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}