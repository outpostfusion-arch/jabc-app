"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ROBOTS, robotAvatarUrl } from "@/components/arrow/robots"
import { UNLOCKS, SESSION_LABELS, RARITY_CONFIG, CATEGORY_CONFIG } from "@/components/arrow/unlocks"
import Link from "next/link"

const TABS = ["Choose Robot", "Unlocks Preview"]

export default function ChooseRobotPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState(0)
  const [filter, setFilter] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const filteredUnlocks = filter ? UNLOCKS.filter((u) => u.session === filter) : UNLOCKS

  async function confirmRobot() {
    if (!selected || saving) return
    setSaving(true)
    try {
      const res = await fetch("/api/robot", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ robotId: selected }),
      })
      if (!res.ok) throw new Error("save failed")
      router.push("/dashboard")
      router.refresh()
    } catch {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-16">

      {/* Header */}
      <div
        className="rounded-3xl p-8 mb-8 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)", boxShadow: "0 16px 32px -8px rgba(15,23,42,0.4)" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🍃</span>
          <span className="text-xl font-black text-white">Arrow Leaf</span>
        </div>
        <h1 className="text-3xl font-black text-white">Choose Your Robot</h1>
        <p className="mt-1 font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>
          Pick your character — then unlock upgrades as you complete sessions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className="px-6 py-2.5 rounded-2xl text-sm font-black transition-all"
            style={tab === i
              ? { background: "#6366F1", color: "white", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }
              : { background: "#F1F5F9", color: "#64748B" }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── TAB 1: ROBOT PICKER ── */}
      {tab === 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {ROBOTS.map((robot) => {
              const isSelected = selected === robot.id
              return (
                <button
                  key={robot.id}
                  onClick={() => setSelected(robot.id)}
                  className="rounded-3xl overflow-hidden transition-all duration-200 text-left"
                  style={{
                    background: "white",
                    border: isSelected ? `3px solid #6366F1` : "2px solid #E2E8F0",
                    boxShadow: isSelected
                      ? "0 8px 24px -4px rgba(99,102,241,0.4)"
                      : "0 2px 8px rgba(0,0,0,0.05)",
                    transform: isSelected ? "translateY(-4px)" : "none",
                  }}
                >
                  {/* Color strip */}
                  <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${robot.primary}, ${robot.accent})` }} />

                  <div className="p-3 flex flex-col items-center">
                    <div className="w-full flex justify-center" style={{ height: 110 }}>
                      <img src={robotAvatarUrl(robot.seed, 90)} alt={robot.name} width={90} height={90} />
                    </div>
                    <div className="mt-2 text-center">
                      <div className="font-black text-xs" style={{ color: "#1E293B" }}>{robot.name}</div>
                      <div className="text-xs mt-0.5 font-medium" style={{ color: "#94A3B8" }}>{robot.tagline}</div>
                    </div>

                    {/* Color dots */}
                    <div className="flex gap-1.5 mt-2">
                      <span className="w-3 h-3 rounded-full border border-slate-200" style={{ background: robot.primary }} />
                      <span className="w-3 h-3 rounded-full border border-slate-200" style={{ background: robot.accent }} />
                    </div>

                    {isSelected && (
                      <div className="mt-2 px-3 py-1 rounded-full text-xs font-black" style={{ background: "#EEF2FF", color: "#6366F1" }}>
                        ✓ Selected
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Confirm button */}
          <div className="flex items-center gap-4">
            <button
              disabled={!selected || saving}
              onClick={confirmRobot}
              className="px-8 py-4 rounded-2xl font-black text-white text-lg transition-all"
              style={{
                background: selected ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "#E2E8F0",
                color: selected ? "white" : "#94A3B8",
                boxShadow: selected ? "0 8px 24px -4px rgba(99,102,241,0.45)" : "none",
              }}
            >
              {saving
                ? "Saving…"
                : selected
                ? `Let's Go with ${ROBOTS.find(r => r.id === selected)?.name}! →`
                : "Pick a robot above"}
            </button>
            <button onClick={() => setTab(1)} className="text-sm font-bold" style={{ color: "#6366F1" }}>
              See all unlocks →
            </button>
          </div>
        </>
      )}

      {/* ── TAB 2: UNLOCKS PREVIEW ── */}
      {tab === 1 && (
        <>
          {/* Session filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setFilter(null)}
              className="px-4 py-2 rounded-xl text-xs font-black transition-all"
              style={filter === null
                ? { background: "#1E293B", color: "white" }
                : { background: "#F1F5F9", color: "#64748B" }}
            >
              All Sessions
            </button>
            {[1, 2, 3, 4, 5, 6].map((s) => {
              const cfg = SESSION_LABELS[s]
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s as 1|2|3|4|5|6)}
                  className="px-4 py-2 rounded-xl text-xs font-black transition-all"
                  style={filter === s
                    ? { background: cfg.color, color: "white" }
                    : { background: cfg.bg, color: cfg.color }}
                >
                  Session {s}
                </button>
              )
            })}
          </div>

          {/* Unlock grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredUnlocks.map((unlock) => {
              const rarity = RARITY_CONFIG[unlock.rarity]
              const session = SESSION_LABELS[unlock.session]
              const category = CATEGORY_CONFIG[unlock.category]
              return (
                <div
                  key={unlock.id}
                  className="rounded-2xl p-4 flex flex-col gap-2"
                  style={{
                    background: "white",
                    border: `2px solid ${unlock.rarity === "legendary" ? "#F59E0B" : unlock.rarity === "rare" ? "#6366F1" : "#E2E8F0"}`,
                    boxShadow: unlock.rarity === "legendary" ? "0 4px 16px rgba(245,158,11,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Emoji */}
                  <div className="text-3xl text-center">{unlock.emoji}</div>

                  {/* Name */}
                  <div className="font-black text-sm text-center" style={{ color: "#1E293B" }}>{unlock.name}</div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 justify-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: session.bg, color: session.color }}>
                      S{unlock.session}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: rarity.bg, color: rarity.color }}>
                      {rarity.star} {rarity.label}
                    </span>
                  </div>

                  {/* Category */}
                  <div className="text-xs text-center font-semibold" style={{ color: "#94A3B8" }}>
                    {category.emoji} {category.label}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 text-center">
            <button onClick={() => setTab(0)} className="font-black text-sm" style={{ color: "#6366F1" }}>
              ← Back to robot picker
            </button>
          </div>
        </>
      )}
    </div>
  )
}
