"use client";

import React, { useEffect, useState, useRef } from "react";

export function MermaidChart({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderChart = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          securityLevel: "loose", // Necessary for some interactive diagrams
          themeVariables: {
            primaryColor: "rgba(196,153,74,0.08)", 
            primaryBorderColor: "#c4994a",         
            primaryTextColor: "#eceef6",
            lineColor: "#52556a",
            fontFamily: "inherit",
          },
        });

        // Generate a unique ID every time to prevent "ID already exists" errors
        const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
        
        // In v11, mermaid.render is strictly async and returns an object { svg }
        const { svg: renderedSvg } = await mermaid.render(id, chart);

          // Force the SVG to fit its container
          const sanitized = renderedSvg
            .replace(/width="[^"]*"/, 'width="100%"')
            .replace(/height="[^"]*"/, 'height="100%"')
            .replace(/style="[^"]*max-width:[^"]*"/, '')

          setSvg(sanitized);
        
        setSvg(renderedSvg);
        setError(false);
      } catch (err) {
        console.error("Mermaid Render Error:", err);
        setError(true);
      }
    };

    if (chart) {
      renderChart();
    }
  }, [chart]);

  if (error) {
    return (
      <div className="text-[10px] text-red-400/50 italic px-4 text-center">
        Failed to render diagram. Check Mermaid syntax.
      </div>
    );
  }

  if (!svg) {
    return <div className="animate-pulse text-[#52556a] text-[10px]">Generating graph...</div>;
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center p-4 overflow-hidden"
      // This is where the magic happens - inserting the SVG string
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}