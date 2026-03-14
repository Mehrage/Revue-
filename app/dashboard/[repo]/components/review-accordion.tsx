"use client"

import { useState } from "react"
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import { MermaidChart } from "./mermaid-chart" 

export default function ReviewAccordion({ content, mermaid }: { content: string; mermaid: string; }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full flex flex-col items-end">
      {/* The Toggle Button (Now with relative z-10 to prevent overlapping) */}
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

      {/* The Content Dropdown */}
      {isOpen && (
        <div className="w-full mt-3 p-5 rounded-xl border border-white/5 bg-white/[0.01] animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#c4994a" }}>
                AI Analysis
              </h3>
              <div className="text-sm leading-relaxed text-[#c0c3d4] whitespace-pre-wrap">
                {content}
              </div>
            </div>

            {mermaid && (
              <div className="pt-4 border-t border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#c4994a" }}>
                  Architecture Flow
                </h3>
                <div className="bg-black/40 rounded-lg overflow-hidden border border-white/5 min-h-[300px]">
                  <MermaidChart chart={mermaid} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}