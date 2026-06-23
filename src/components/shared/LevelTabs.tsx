"use client"

import { useRouter, useSearchParams } from "next/navigation"

const TABS = [
  { label: "Primary", value: "PRIMARY", color: "#F59E0B", activeColor: "white", shadow: "rgba(245,158,11,0.4)" },
  { label: "Junior", value: "JUNIOR", color: "#22C55E", activeColor: "white", shadow: "rgba(34,197,94,0.4)" },
  { label: "Senior", value: "SENIOR", color: "#6366F1", activeColor: "white", shadow: "rgba(99,102,241,0.4)" },
]

export default function LevelTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get("level") ?? ""

  function select(value: string) {
    // Save to cookie so student preview picks it up
    document.cookie = `jabc-level-preview=${value}; path=/; max-age=86400`
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("level", value)
    else params.delete("level")
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      {TABS.map((tab) => {
        const isActive = active === tab.value
        return (
          <button
            key={tab.value}
            onClick={() => select(tab.value)}
            className="px-6 py-2.5 rounded-2xl text-sm font-black transition-all"
            style={
              isActive
                ? {
                    background: tab.color,
                    color: tab.activeColor,
                    boxShadow: `0 4px 14px ${tab.shadow}`,
                    transform: "translateY(-1px)",
                  }
                : {
                    background: "white",
                    color: tab.color,
                    border: `2px solid ${tab.color}`,
                    transform: "translateY(0)",
                  }
            }
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
