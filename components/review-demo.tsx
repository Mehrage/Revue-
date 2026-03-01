"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

const REVIEW_TEXT = "Magic number detected. Extract 0.1 to a named constant like TAX_RATE for clarity and reuse."

export function ReviewDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [displayedText, setDisplayedText] = useState("")
  const [isDone, setIsDone] = useState(false)
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    if (!isInView) return

    // Small delay before typing starts
    const startDelay = setTimeout(() => {
      setShowCursor(true)
      let i = 0
      const interval = setInterval(() => {
        setDisplayedText(REVIEW_TEXT.slice(0, i + 1))
        i++
        if (i >= REVIEW_TEXT.length) {
          clearInterval(interval)
          setIsDone(true)
        }
      }, 22)
      return () => clearInterval(interval)
    }, 600)

    return () => clearTimeout(startDelay)
  }, [isInView])

  return (
    <div ref={ref} className="relative group">
      {/* Glow border */}
      <div className="absolute -inset-px bg-gradient-to-b from-neutral-700 to-neutral-900 rounded-xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

      <div className="relative border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/90 backdrop-blur-sm">
        {/* Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/80 bg-neutral-900/30">
          <span className="text-xs text-neutral-500 font-mono">payment.ts</span>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
          </div>
        </div>

        <div className="p-6 font-mono text-sm leading-7">
          {/* Code lines */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-neutral-500"
          >
            <span className="text-neutral-400">function</span>{" "}
            <span className="text-neutral-200">processPayment</span>
            <span className="text-neutral-600">(amount) {"{"}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-neutral-500 pl-6"
          >
            <span className="text-neutral-400">const</span> tax = amount *{" "}
            <span style={{ color: "#c4994a" }}>0.1</span>;
          </motion.div>

          {/* Review comment — animates in, then types */}
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
            animate={isInView ? { opacity: 1, height: "auto", marginTop: "1rem", marginBottom: "1rem" } : {}}
            transition={{ duration: 0.35, delay: 0.35 }}
            className="ml-6 overflow-hidden"
          >
            <div className="py-3 px-4 bg-neutral-900/80 rounded-lg border border-[#c4994a]/18">
              <p className="text-neutral-300 text-xs leading-relaxed min-h-[1.5rem]">
                <span className="font-medium" style={{ color: "#c4994a" }}>revue</span>
                <span className="text-neutral-700 mx-2">·</span>
                {displayedText}
                {showCursor && !isDone && (
                  <span className="inline-block w-[2px] h-[12px] ml-[1px] align-middle animate-pulse" style={{ background: "rgba(196,153,74,0.7)" }} />
                )}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-neutral-500 pl-6"
          >
            <span className="text-neutral-400">return</span> amount + tax;
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="text-neutral-600"
          >
            {"}"}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
