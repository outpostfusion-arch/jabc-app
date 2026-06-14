"use client"

import { useState, useEffect } from "react"

interface Student { id: string; displayName: string; avatarEmoji: string; classCode: string }
interface Team { id: string; name: string; classCode: string; members: { userId: string; user: Student }[] }

type DragInfo =
  | { type: "unassigned"; studentId: string }
  | { type: "member"; studentId: string; fromTeamId: string }

const STUDENT_COLORS = [
  { bg: "#EEF2FF", border: "#818CF8", text: "#4338CA", ghost: "#6366F1" },
  { bg: "#EFF6FF", border: "#60A5FA", text: "#1D4ED8", ghost: "#3B82F6" },
  { bg: "#FDF2F8", border: "#F472B6", text: "#9D174D", ghost: "#EC4899" },
  { bg: "#ECFDF5", border: "#34D399", text: "#065F46", ghost: "#10B981" },
  { bg: "#FFFBEB", border: "#FBBF24", text: "#92400E", ghost: "#F59E0B" },
  { bg: "#F5F3FF", border: "#A78BFA", text: "#5B21B6", ghost: "#8B5CF6" },
  { bg: "#FFF1F2", border: "#FB7185", text: "#9F1239", ghost: "#F43F5E" },
  { bg: "#ECFEFF", border: "#22D3EE", text: "#164E63", ghost: "#06B6D4" },
]

const TEAM_COLORS = [
  { gradient: "linear-gradient(135deg, #6366F1, #818CF8)", shadow: "rgba(99,102,241,0.45)", accent: "#6366F1", light: "rgba(99,102,241,0.12)" },
  { gradient: "linear-gradient(135deg, #3B82F6, #60A5FA)", shadow: "rgba(59,130,246,0.45)", accent: "#3B82F6", light: "rgba(59,130,246,0.12)" },
  { gradient: "linear-gradient(135deg, #EC4899, #F472B6)", shadow: "rgba(236,72,153,0.45)", accent: "#EC4899", light: "rgba(236,72,153,0.12)" },
  { gradient: "linear-gradient(135deg, #10B981, #34D399)", shadow: "rgba(16,185,129,0.45)", accent: "#10B981", light: "rgba(16,185,129,0.12)" },
  { gradient: "linear-gradient(135deg, #F59E0B, #FBBF24)", shadow: "rgba(245,158,11,0.45)", accent: "#F59E0B", light: "rgba(245,158,11,0.12)" },
  { gradient: "linear-gradient(135deg, #8B5CF6, #A78BFA)", shadow: "rgba(139,92,246,0.45)", accent: "#8B5CF6", light: "rgba(139,92,246,0.12)" },
]

// Each member row inside a team gets a distinct translucent tint
const MEMBER_ROW_OPACITIES = [0.28, 0.20, 0.34, 0.16, 0.24]

export default function TeamsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [newTeamName, setNewTeamName] = useState("")
  const [loading, setLoading] = useState(true)
  const [dragInfo, setDragInfo] = useState<DragInfo | null>(null)
  const [dragOverTeamId, setDragOverTeamId] = useState<string | null>(null)
  const [dragOverUnassigned, setDragOverUnassigned] = useState(false)
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  useEffect(() => {
    Promise.all([
      fetch("/api/students").then((r) => r.json()),
      fetch("/api/teams").then((r) => r.json()),
    ]).then(([s, t]) => {
      setStudents(s)
      setTeams(t)
      setLoading(false)
    })
  }, [])

  async function createTeam() {
    if (!newTeamName.trim()) return
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTeamName.trim() }),
    })
    const team = await res.json()
    setTeams((prev) => [...prev, { ...team, members: [] }])
    setNewTeamName("")
  }

  async function renameTeam(teamId: string) {
    if (!editingName.trim()) { setEditingTeamId(null); return }
    await fetch(`/api/teams/${teamId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName.trim() }),
    })
    setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, name: editingName.trim() } : t))
    setEditingTeamId(null)
  }

  async function addToTeam(teamId: string, studentId: string) {
    await fetch(`/api/teams/${teamId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: studentId }),
    })
    const student = students.find((s) => s.id === studentId)!
    setTeams((prev) => prev.map((t) =>
      t.id === teamId ? { ...t, members: [...t.members, { userId: studentId, user: student }] } : t
    ))
  }

  async function removeFromTeam(teamId: string, studentId: string) {
    await fetch(`/api/teams/${teamId}/members?userId=${studentId}`, { method: "DELETE" })
    setTeams((prev) => prev.map((t) =>
      t.id === teamId ? { ...t, members: t.members.filter((m) => m.userId !== studentId) } : t
    ))
  }

  function handleDrop(toTeamId: string) {
    if (!dragInfo) return
    if (dragInfo.type === "unassigned") {
      addToTeam(toTeamId, dragInfo.studentId)
    } else if (dragInfo.type === "member" && dragInfo.fromTeamId !== toTeamId) {
      removeFromTeam(dragInfo.fromTeamId, dragInfo.studentId)
      addToTeam(toTeamId, dragInfo.studentId)
    }
    setDragInfo(null)
    setDragOverTeamId(null)
  }

  function handleDropToUnassigned() {
    if (dragInfo?.type === "member") {
      removeFromTeam(dragInfo.fromTeamId, dragInfo.studentId)
    }
    setDragInfo(null)
    setDragOverUnassigned(false)
  }

  function clearDrag() {
    setDragInfo(null)
    setDragOverTeamId(null)
    setDragOverUnassigned(false)
  }

  function makeDragGhost(
    e: React.DragEvent,
    emoji: string,
    name: string,
    background: string,
    textColor: string,
  ) {
    const ghost = document.createElement("div")
    ghost.style.cssText = `
      position:fixed; top:-9999px; left:-9999px;
      display:flex; align-items:center; gap:10px;
      padding:10px 14px; border-radius:14px;
      background:${background};
      color:${textColor};
      font-family:inherit; font-size:14px; font-weight:600;
      box-shadow:0 8px 24px rgba(0,0,0,0.18);
      white-space:nowrap; pointer-events:none;
    `
    ghost.innerHTML = `<span style="font-size:1.2rem">${emoji}</span><span>${name}</span>`
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, ghost.offsetHeight / 2)
    setTimeout(() => ghost.remove(), 100)
  }

  const assignedIds = new Set(teams.flatMap((t) => t.members.map((m) => m.userId)))
  const unassigned = students.filter((s) => !assignedIds.has(s.id))

  // Stable colour index so each student keeps the same colour regardless of list position
  const studentColorIndex = new Map(students.map((s, i) => [s.id, i]))
  const isDraggingMember = dragInfo?.type === "member"

  if (loading) return <div className="text-center py-20 font-bold" style={{ color: "#94A3B8" }}>Loading...</div>

  return (
    <>
      <style>{`
        @keyframes team-pulse {
          0%, 100% { transform: scale(1.01); }
          50%       { transform: scale(1.04); }
        }
        .is-drag-over { animation: team-pulse 0.55s ease-in-out infinite; }

        @keyframes unassigned-pulse {
          0%, 100% { transform: scale(1.005); }
          50%       { transform: scale(1.015); }
        }
        .unassigned-drag-over { animation: unassigned-pulse 0.55s ease-in-out infinite; }
      `}</style>

      <div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>Teams</h1>
            <p className="mt-1 font-semibold" style={{ color: "#64748B" }}>Drag students into teams · drag members out to unassign.</p>
          </div>
          <div className="flex gap-2">
            <input
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createTeam()}
              placeholder="Team name..."
              className="px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none"
              style={{ borderColor: "#E2E8F0" }}
            />
            <button onClick={createTeam} className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "#6366F1" }}>
              + New Team
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Unassigned students — also a drop target when dragging a member out */}
          <div
            onDragOver={(e) => { if (isDraggingMember) { e.preventDefault(); setDragOverUnassigned(true) } }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverUnassigned(false) }}
            onDrop={isDraggingMember ? handleDropToUnassigned : undefined}
            className={`rounded-3xl border p-5 transition-all${dragOverUnassigned ? " unassigned-drag-over" : ""}`}
            style={{
              background: dragOverUnassigned ? "#F0FDF4" : "white",
              borderColor: dragOverUnassigned ? "#34D399" : "#E2E8F0",
              border: `2px solid ${dragOverUnassigned ? "#34D399" : "#E2E8F0"}`,
              boxShadow: dragOverUnassigned ? "0 0 0 4px rgba(52,211,153,0.2)" : undefined,
            }}
          >
            <h2 className="font-black text-lg mb-1" style={{ color: "#1E293B" }}>
              Unassigned Students ({unassigned.length})
            </h2>
            <p className="text-xs font-semibold mb-4" style={{ color: isDraggingMember ? "#10B981" : "#94A3B8" }}>
              {isDraggingMember ? "↓ Drop here to unassign" : "Drag a student onto a team"}
            </p>
            <div className="space-y-2">
              {unassigned.map((s) => {
                const isBeingDragged = dragInfo?.studentId === s.id
                const sc = STUDENT_COLORS[(studentColorIndex.get(s.id) ?? 0) % STUDENT_COLORS.length]
                return (
                  <div
                    key={s.id}
                    draggable
                    onDragStart={(e) => {
                      setDragInfo({ type: "unassigned", studentId: s.id })
                      makeDragGhost(e, s.avatarEmoji, s.displayName, sc.ghost, "white")
                    }}
                    onDragEnd={clearDrag}
                    className="flex items-center gap-3 p-3 rounded-xl select-none"
                    style={{
                      background: sc.bg,
                      opacity: isBeingDragged ? 0.4 : 1,
                      border: `2px solid ${sc.border}`,
                      cursor: "grab",
                      transition: "opacity 0.15s",
                    }}
                  >
                    <span className="font-semibold flex-1" style={{ color: sc.text }}>{s.displayName}</span>
                    <span className="text-xs font-bold select-none" style={{ color: sc.border }}>⠿⠿</span>
                  </div>
                )
              })}
              {unassigned.length === 0 && !isDraggingMember && (
                <div className="text-center py-6" style={{ color: "#94A3B8" }}>🎉 All students assigned!</div>
              )}
              {unassigned.length === 0 && isDraggingMember && (
                <div className="text-center py-6 rounded-xl border-2 border-dashed font-semibold text-sm" style={{ color: "#10B981", borderColor: "#34D399" }}>
                  Drop to unassign
                </div>
              )}
            </div>
          </div>

          {/* Team cards */}
          <div className="space-y-4">
            {teams.map((team, idx) => {
              const colors = TEAM_COLORS[idx % TEAM_COLORS.length]
              const hasMembers = team.members.length > 0
              const isOver = dragOverTeamId === team.id
              const isEditing = editingTeamId === team.id

              return (
                <div
                  key={team.id}
                  onDragOver={(e) => { e.preventDefault(); if (dragOverTeamId !== team.id) setDragOverTeamId(team.id) }}
                  onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverTeamId(null) }}
                  onDrop={() => handleDrop(team.id)}
                  className={`rounded-3xl p-5 transition-all${isOver ? " is-drag-over" : ""}`}
                  style={{
                    background: hasMembers ? colors.gradient : colors.light,
                    border: `2px solid ${isOver ? colors.accent : "transparent"}`,
                    boxShadow: isOver
                      ? `0 0 0 4px ${colors.shadow}, 0 16px 32px -8px ${colors.shadow}`
                      : hasMembers
                        ? `0 10px 24px -4px ${colors.shadow}`
                        : `0 2px 8px -2px ${colors.shadow}`,
                    transition: "background 0.35s, box-shadow 0.2s, border-color 0.2s",
                  }}
                >
                  {/* Team header */}
                  <div className="flex items-center justify-between mb-3 gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          autoFocus
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") renameTeam(team.id); if (e.key === "Escape") setEditingTeamId(null) }}
                          className="flex-1 px-3 py-1 rounded-xl text-sm font-bold focus:outline-none"
                          style={{ background: "rgba(255,255,255,0.25)", color: hasMembers ? "white" : "#1E293B" }}
                        />
                        <button
                          onClick={() => renameTeam(team.id)}
                          className="px-3 py-1 rounded-xl text-xs font-black"
                          style={{ background: "rgba(255,255,255,0.3)", color: hasMembers ? "white" : "#1E293B" }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTeamId(null)}
                          className="px-3 py-1 rounded-xl text-xs font-black"
                          style={{ background: "rgba(0,0,0,0.08)", color: hasMembers ? "rgba(255,255,255,0.7)" : "#64748B" }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-black text-lg flex-1" style={{ color: hasMembers ? "white" : "#1E293B" }}>
                          {team.name}
                        </h3>
                        <button
                          onClick={() => { setEditingTeamId(team.id); setEditingName(team.name) }}
                          className="text-xs px-2.5 py-1 rounded-xl font-bold transition-all hover:opacity-80"
                          style={{ background: "rgba(255,255,255,0.2)", color: hasMembers ? "white" : "#64748B" }}
                          title="Rename team"
                        >
                          ✎ Edit
                        </button>
                      </>
                    )}
                    {!isEditing && (
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                        style={{
                          background: hasMembers ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
                          color: hasMembers ? "white" : colors.accent,
                        }}
                      >
                        {team.members.length} members
                      </span>
                    )}
                  </div>

                  {/* Member rows */}
                  <div className="space-y-2">
                    {team.members.map((m, memberIdx) => {
                      const opacity = MEMBER_ROW_OPACITIES[memberIdx % MEMBER_ROW_OPACITIES.length]
                      const isBeingDragged = dragInfo?.studentId === m.userId
                      return (
                        <div
                          key={m.userId}
                          draggable
                          onDragStart={(e) => {
                            e.stopPropagation()
                            setDragInfo({ type: "member", studentId: m.userId, fromTeamId: team.id })
                            makeDragGhost(e, m.user.avatarEmoji, m.user.displayName, colors.gradient, "white")
                          }}
                          onDragEnd={clearDrag}
                          className="flex items-center gap-3 p-2.5 rounded-xl select-none"
                          style={{
                            background: `rgba(255,255,255,${opacity})`,
                            opacity: isBeingDragged ? 0.35 : 1,
                            cursor: "grab",
                            border: `1.5px solid rgba(255,255,255,${Math.min(opacity + 0.12, 0.45)})`,
                            transition: "opacity 0.15s",
                          }}
                        >
                          <span className="font-semibold flex-1 text-sm" style={{ color: hasMembers ? "white" : "#1E293B" }}>
                            {m.user.displayName}
                          </span>
                          <span className="text-xs font-bold select-none mr-1" style={{ color: "rgba(255,255,255,0.4)" }}>⠿⠿</span>
                          <button
                            onClick={() => removeFromTeam(team.id, m.userId)}
                            className="text-xs px-2 py-0.5 rounded-lg font-bold"
                            style={{ background: "rgba(255,255,255,0.2)", color: hasMembers ? "rgba(255,255,255,0.8)" : "#F43F5E" }}
                          >
                            ✕
                          </button>
                        </div>
                      )
                    })}

                    {team.members.length === 0 && (
                      <div
                        className="text-center py-5 rounded-xl text-sm font-semibold border-2 border-dashed transition-all"
                        style={{
                          color: isOver ? colors.accent : "#94A3B8",
                          borderColor: isOver ? colors.accent : "rgba(255,255,255,0.3)",
                          background: isOver ? `rgba(255,255,255,0.15)` : "transparent",
                        }}
                      >
                        {isOver ? "✦ Drop to add!" : "Drag students here"}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {teams.length === 0 && (
              <div className="rounded-3xl border p-10 text-center" style={{ borderColor: "#E2E8F0" }}>
                <div className="text-4xl mb-2">🤝</div>
                <div className="font-bold mb-4" style={{ color: "#94A3B8" }}>No teams yet</div>
                <div className="flex gap-2 justify-center">
                  <input
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createTeam()}
                    placeholder="Team name..."
                    className="px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none"
                    style={{ borderColor: "#E2E8F0" }}
                  />
                  <button onClick={createTeam} className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "#6366F1" }}>
                    + New Team
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
