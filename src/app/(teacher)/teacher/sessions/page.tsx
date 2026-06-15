"use client"

import { useState, useEffect, useRef } from "react"

interface SessionStats { completed: number; inProgress: number; notStarted: number }
interface ClassSession {
  id: number
  title: string
  description: string
  bcCurriculumTag: string
  isLocked: boolean
  sortOrder: number
  teacherNote: string
  dueDate: string | null
  stats: SessionStats
}

const SESSION_META: Record<number, { emoji: string; color: string; light: string }> = {
  1: { emoji: "🏢", color: "#6366F1", light: "#EEF2FF" },
  2: { emoji: "🎯", color: "#F43F5E", light: "#FFF1F2" },
  3: { emoji: "🤝", color: "#22C55E", light: "#F0FDF4" },
  4: { emoji: "⚙️", color: "#A855F7", light: "#FAF5FF" },
  5: { emoji: "💰", color: "#FBBF24", light: "#FFFBEB" },
  6: { emoji: "🎨", color: "#EC4899", light: "#FDF2F8" },
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)
  const [saving, setSaving] = useState<Record<number, boolean>>({})
  const noteTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({})

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => { setSessions(data); setLoading(false) })
  }, [])

  async function toggleLock(id: number, isLocked: boolean) {
    const updated = await fetch(`/api/sessions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLocked: !isLocked }),
    }).then((r) => r.json())
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, isLocked: updated.isLocked } : s))
  }

  async function bulkLock(isLocked: boolean) {
    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "bulk-lock", isLocked }),
    })
    setSessions((prev) => prev.map((s) => ({ ...s, isLocked })))
  }

  function handleNoteChange(id: number, note: string) {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, teacherNote: note } : s))
    clearTimeout(noteTimers.current[id])
    setSaving((prev) => ({ ...prev, [id]: true }))
    noteTimers.current[id] = setTimeout(async () => {
      await fetch(`/api/sessions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherNote: note }),
      })
      setSaving((prev) => ({ ...prev, [id]: false }))
    }, 800)
  }

  async function handleDueDate(id: number, dueDate: string) {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, dueDate: dueDate || null } : s))
    await fetch(`/api/sessions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dueDate: dueDate || null }),
    })
  }

  function onDragStart(id: number) { setDragging(id) }
  function onDragOver(e: React.DragEvent, id: number) { e.preventDefault(); setDragOver(id) }

  async function onDrop(targetId: number) {
    if (dragging === null || dragging === targetId) { setDragging(null); setDragOver(null); return }
    const from = sessions.findIndex((s) => s.id === dragging)
    const to = sessions.findIndex((s) => s.id === targetId)
    const reordered = [...sessions]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    const withOrders = reordered.map((s, i) => ({ ...s, sortOrder: i + 1 }))
    setSessions(withOrders)
    setDragging(null)
    setDragOver(null)
    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reorder", orders: withOrders.map((s) => ({ id: s.id, sortOrder: s.sortOrder })) }),
    })
  }

  if (loading) return <div className="text-center py-20 font-bold" style={{ color: "#94A3B8" }}>Loading...</div>

  const allLocked = sessions.every((s) => s.isLocked)
  const allUnlocked = sessions.every((s) => !s.isLocked)

  return (
    <div>
      {/* Header */}
      <div
        className="rounded-3xl p-8 mb-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
          boxShadow: "0 16px 32px -8px rgba(15,23,42,0.35)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Session Control 📅</h1>
            <p className="mt-1 font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
              Manage access, notes, due dates and order for each session
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => bulkLock(false)}
              disabled={allUnlocked}
              className="px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: "#22C55E", color: "white" }}
            >
              🔓 Unlock All
            </button>
            <button
              onClick={() => bulkLock(true)}
              disabled={allLocked}
              className="px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: "#F43F5E", color: "white" }}
            >
              🔒 Lock All
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.map((s) => {
          const meta = SESSION_META[s.id] ?? { emoji: "📋", color: "#6366F1", light: "#EEF2FF" }
          const total = s.stats.completed + s.stats.inProgress + s.stats.notStarted
          const isDragTarget = dragOver === s.id && dragging !== s.id

          return (
            <div
              key={s.id}
              draggable
              onDragStart={() => onDragStart(s.id)}
              onDragOver={(e) => onDragOver(e, s.id)}
              onDrop={() => onDrop(s.id)}
              onDragEnd={() => { setDragging(null); setDragOver(null) }}
              className="rounded-3xl overflow-hidden transition-all duration-200"
              style={{
                background: "white",
                border: isDragTarget ? `2px solid ${meta.color}` : "2px solid #E2E8F0",
                boxShadow: dragging === s.id ? "0 16px 40px -8px rgba(0,0,0,0.2)" : "0 4px 16px -4px rgba(0,0,0,0.08)",
                opacity: dragging === s.id ? 0.5 : 1,
                transform: isDragTarget ? "scale(1.01)" : "scale(1)",
              }}
            >
              {/* Card top row */}
              <div className="flex items-center gap-4 p-5">
                <div className="cursor-grab text-2xl select-none leading-none" style={{ color: "#CBD5E1" }}>⠿</div>

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: meta.light }}
                >
                  {meta.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-black" style={{ color: "#1E293B" }}>Session {s.id}: {s.title}</div>
                  <div className="text-sm mt-0.5" style={{ color: "#64748B" }}>{s.description}</div>

                  {/* Progress stats */}
                  <div className="flex items-center gap-4 mt-2.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>
                      ✓ {s.stats.completed} done
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#FEF3C7", color: "#92400E" }}>
                      ▶ {s.stats.inProgress} in progress
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#F1F5F9", color: "#64748B" }}>
                      – {s.stats.notStarted} not started
                    </span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#F1F5F9", minWidth: 60 }}>
                      <div className="h-full flex">
                        <div style={{ width: `${total ? (s.stats.completed / total) * 100 : 0}%`, background: "#22C55E", transition: "width 0.3s" }} />
                        <div style={{ width: `${total ? (s.stats.inProgress / total) * 100 : 0}%`, background: "#F59E0B", transition: "width 0.3s" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleLock(s.id, s.isLocked)}
                  className="px-4 py-2 rounded-xl text-sm font-black transition-all hover:opacity-80 flex-shrink-0"
                  style={{
                    background: s.isLocked ? "#FFF1F2" : "#F0FDF4",
                    color: s.isLocked ? "#F43F5E" : "#22C55E",
                    border: `2px solid ${s.isLocked ? "#F43F5E" : "#22C55E"}`,
                  }}
                >
                  {s.isLocked ? "🔒 Locked" : "🔓 Open"}
                </button>
              </div>

              {/* Note + Due date */}
              <div className="flex gap-4 px-5 pb-5" style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
                <div className="flex-1">
                  <label className="text-xs font-black mb-1.5 flex items-center gap-2" style={{ color: "#6366F1" }}>
                    📝 Teacher Note
                    {saving[s.id] && <span className="font-normal" style={{ color: "#94A3B8" }}>Saving...</span>}
                    {saving[s.id] === false && <span className="font-normal" style={{ color: "#22C55E" }}>Saved ✓</span>}
                  </label>
                  <textarea
                    value={s.teacherNote}
                    onChange={(e) => handleNoteChange(s.id, e.target.value)}
                    placeholder="Add a note or instruction students will see at the top of this session..."
                    rows={2}
                    className="w-full rounded-xl px-3 py-2 text-sm resize-none outline-none transition-all"
                    style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#334155" }}
                    onFocus={(e) => { e.target.style.borderColor = "#6366F1" }}
                    onBlur={(e) => { e.target.style.borderColor = "#E2E8F0" }}
                  />
                </div>
                <div style={{ minWidth: 190 }}>
                  <label className="text-xs font-black mb-1.5 block" style={{ color: "#F43F5E" }}>📅 Due Date</label>
                  <input
                    type="date"
                    value={s.dueDate ? s.dueDate.split("T")[0] : ""}
                    onChange={(e) => handleDueDate(s.id, e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                    style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#334155" }}
                  />
                  {s.dueDate && (
                    <button
                      onClick={() => handleDueDate(s.id, "")}
                      className="text-xs mt-1 font-bold"
                      style={{ color: "#94A3B8" }}
                    >
                      Clear date
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
