"use client"

import { useRouter, useSearchParams } from "next/navigation"

const TABS = [
  { label: "All Students", value: "" },
  { label: "🟢 Junior", value: "JUNIOR" },
  { label: "🔵 Senior", value: "SENIOR" },
]

export default function LevelTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get("level") ?? ""

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("level", value)
    else params.delete("level")
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {TABS.map((tab) => {
        const isActive = active === tab.value
        return (
          <button
            key={tab.value}
            onClick={() => select(tab.value)}
            className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
            style={
              isActive
                ? { background: "#6366F1", color: "white", boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }
                : { background: "#F1F5F9", color: "#64748B" }
            }
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
