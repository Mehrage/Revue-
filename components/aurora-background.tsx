"use client"

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base background */}
      <div className="absolute inset-0 bg-neutral-950" />

      {/* Aurora orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/30 blur-[100px] animate-aurora-1" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/30 blur-[100px] animate-aurora-2" />
      <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] rounded-full bg-violet-500/30 blur-[120px] animate-aurora-3" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(circle, #404040 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Fade out grid at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-neutral-950 to-transparent" />
    </div>
  )
}
