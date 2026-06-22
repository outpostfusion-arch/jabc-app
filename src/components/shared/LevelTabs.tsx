"use client"

import { useRouter, useSearchParams } from "next/navigation"

const TABS = [
  { label: "🟢 Junior", value: "JUNIOR" },
  { label: "🔵 Senior", value: "SENIOR" },
]

const TAB_WIDTH = 120

export default function LevelTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get("level") ?? ""
  const activeIndex = Math.max(0, TABS.findIndex((t) => t.value === active))

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("level", value)
    else params.delete("level")
    router.push(`?${params.toString()}`)
  }

  return (
    <div
      className="inline-flex rounded-2xl p-1 mb-6 relative"
      style={{ background: "#F1F5F9" }}
    >
      {/* Sliding pill */}
      <div
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 4 + activeIndex * TAB_WIDTH,
          width: TAB_WIDTH,
          background: "#6366F1",
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
          transition: "left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {TABS.map((tab) => {
        const isActive = active === tab.value
        return (
          <button
            key={tab.value}
            onClick={() => select(tab.value)}
            style={{
              width: TAB_WIDTH,
              padding: "8px 0",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              position: "relative",
              zIndex: 1,
              color: isActive ? "white" : "#64748B",
              transition: "color 0.35s ease",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
