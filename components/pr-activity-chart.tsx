"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

export function PRActivityChart({ data }: { data: { day: string; prs: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="day" stroke="#3a3d50" tick={{ fill: "#52556a", fontSize: 12 }} />
        <YAxis stroke="#3a3d50" tick={{ fill: "#52556a", fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: "#0e1018", border: "1px solid rgba(196,153,74,0.2)", borderRadius: "8px", color: "#e6e8f0" }}
          labelStyle={{ color: "#c4994a" }}
        />
        <Line type="monotone" dataKey="prs" stroke="#c4994a" strokeWidth={2} dot={{ fill: "#c4994a", r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}