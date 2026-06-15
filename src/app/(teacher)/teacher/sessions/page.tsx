"use client"

import { useState, useEffect } from "react"

interface ClassSession { id: number; title: string; description: string; bcCurriculumTag: string; isLocked: boolean }

export default function SessionsPage() {
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sessions").then((r) => r.json()).then((data) => {
      setSessions(data)
      setLoading(false)
    })
  }, [])

  async function toggleLock(id: number, isLocked: boolean) {
    const res = await fetch(`/api/sessions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLocked: !isLocked }),
    })
    const updated = await res.json()
    setSessions(sessions.map((s) => s.id === id ? { ...s, isLocked: updated.isLocked } : s))
  }

  const SESSION_EMOJIS = ["", "🏢", "🎯", "🤝", "⚙️", "💰", "🎨"]
  const SESSION_COLORS = ["", "#6366F1", "#F43F5E", "#22C55E", "#A855F7", "#FBBF24", "#EC4899"]

  if (loading) return <div className="text-center py-20 font-bold" style={{ color: "#94A3B8" }}>Loading...</div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>Session Control</h1>
        <p className="mt-1 font-semibold" style={{ color: "#64748B" }}>Lock or unlock sessions to control student access.</p>
      </div>

      <div className="space-y-4">
        {sessions.map((s) => (
          <div key={s.id} className="flex items-center gap-4 p-5 rounded-3xl border" style={{ background: "white", borderColor: "#E2E8F0" }}>
            <div className="text-3xl">{SESSION_EMOJIS[s.id]}</div>
            <div className="flex-1">
              <div className="font-black" style={{ color: "#1E293B" }}>Session {s.id}: {s.title}</div>
              <div className="text-sm font-medium mt-0.5" style={{ color: "#64748B" }}>{s.description}</div>
              <div className="text-xs font-bold mt-1" style={{ color: SESSION_COLORS[s.id] }}>{s.bcCurriculumTag}</div>
            </div>
            <button
              onClick={() => toggleLock(s.id, s.isLocked)}
              className="px-5 py-2.5 rounded-xl text-sm font-black transition-all"
              style={{
                background: s.isLocked ? "#FFF1F2" : "#F0FDF4",
                color: s.isLocked ? "#F43F5E" : "#22C55E",
                border: `2px solid ${s.isLocked ? "#F43F5E" : "#22C55E"}`,
              }}
            >
              {s.isLocked ? "🔒 Locked — Click to Unlock" : "🔓 Open — Click to Lock"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}