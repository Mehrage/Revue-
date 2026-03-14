"use client"

import { useEffect, useRef } from "react"
import mermaid from "mermaid"

// Initialize mermaid outside the component
mermaid.initialize({
  startOnLoad: true,
  theme: "dark", // Matches your dashboard theme
  securityLevel: "loose",
  fontFamily: "var(--font-geist-mono)",
})

export default function MermaidViewer({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && chart) {
      // Clear previous content and re-render
      ref.current.removeAttribute("data-processed")
      mermaid.contentLoaded()
      
      // We use a unique ID for each render to avoid conflicts
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
      
      mermaid.render(id, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      }).catch((err) => {
        console.error("Mermaid Render Error:", err)
      })
    }
  }, [chart])

  return (
    <div 
      ref={ref} 
      className="flex justify-center p-4 bg-black/20 rounded-lg overflow-x-auto" 
    />
  )
}