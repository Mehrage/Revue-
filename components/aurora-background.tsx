"use client"

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* SVG noise filter */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="ambient-noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="4"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
            <feBlend in="SourceGraphic" in2="gray" mode="overlay" />
          </filter>
        </defs>
      </svg>

      {/* Deep base */}
      <div className="absolute inset-0 bg-[#07090f]" />

      {/* Warm center atmosphere — like candlelight through fog */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 60% at 50% -5%, rgba(190, 148, 58, 0.10) 0%, transparent 65%)",
        }}
      />

      {/* Orb 1: warm amber/gold — upper left, slow drift */}
      <div
        className="absolute animate-aurora-1"
        style={{
          top: "-20%",
          left: "-8%",
          width: "900px",
          height: "650px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(192, 148, 56, 0.16) 0%, rgba(192, 148, 56, 0.05) 45%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Orb 2: deep blue — lower right, opposite drift */}
      <div
        className="absolute animate-aurora-2"
        style={{
          bottom: "-25%",
          right: "-12%",
          width: "750px",
          height: "750px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(55, 95, 210, 0.13) 0%, rgba(55, 95, 210, 0.04) 50%, transparent 70%)",
          filter: "blur(55px)",
        }}
      />

      {/* Orb 3: violet — mid left, gentle pulse */}
      <div
        className="absolute animate-aurora-3"
        style={{
          top: "35%",
          left: "-18%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(110, 72, 190, 0.09) 0%, transparent 65%)",
          filter: "blur(65px)",
        }}
      />

      {/* SVG noise texture — tactile grain */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.038,
          pointerEvents: "none",
        }}
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Radial vignette — pulls depth inward */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 130% 110% at 50% 50%, transparent 25%, rgba(5, 7, 14, 0.88) 100%)",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-72"
        style={{
          background: "linear-gradient(to top, #07090f 0%, transparent 100%)",
        }}
      />
    </div>
  )
}
