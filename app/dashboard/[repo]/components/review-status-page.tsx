"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Circle } from "lucide-react"

type Status = "reviewing" | "good" | "concerning"

export function ReviewStatusBadge({ prNumber, repoName }: { prNumber?: number, repoName?: string }) {
  // Defaults to Yellow as requested
  const [status, setStatus] = useState<Status>("reviewing")
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Closes the dropdown if you click anywhere else on the page
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // The 3 states and their Revue-themed colors
  const statuses = {
    good: { label: "Good to go", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    reviewing: { label: "Needs reviewing", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
    concerning: { label: "Concerning, need more eyes", color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" },
  }

  const current = statuses[status]

  const handleSelect = (newStatus: Status) => {
    setStatus(newStatus)
    setIsOpen(false)
    
    // TODO: We can add a fetch() call here later to save this choice to your Prisma database!
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-[11px] font-medium transition-all ${current.bg} ${current.border} ${current.color} hover:brightness-110`}
      >
        <Circle className="w-2.5 h-2.5 fill-current" />
        {current.label}
        <ChevronDown className={`w-3 h-3 ml-1 transition-transform opacity-70 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mt-1.5 left-0 w-56 rounded-lg border border-white/10 bg-[#11141d] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-1">
            {(Object.entries(statuses) as [Status, typeof current][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`flex items-center gap-3 px-3 py-2.5 text-[11px] font-medium rounded-md hover:bg-white/5 transition-colors ${status === key ? 'bg-white/[0.04]' : ''}`}
              >
                <Circle className={`w-2.5 h-2.5 fill-current ${val.color}`} />
                <span className="text-[#e6e8f0]">{val.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}