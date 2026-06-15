"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import AvatarImage from "@/components/shared/AvatarImage"

interface Reflection {
  id: string
  whatLearned: string
  proudOf: string
  challenges: string
  nextSteps: string
  mediaUrl: string
  mediaType: string
  teacherFeedback: string
  moodEmoji: string
  skillTeamwork: number
  skillCreativity: number
  skillBusiness: number
  skillLeadership: number
  isFeatured: boolean
  goalStatus: string
  updatedAt: string
}
interface Student {
  id: string
  displayName: string
  username: string
  avatarEmoji: string
  reflection: Reflection | null
  brandProfile: { brandName: string; tagline: string } | null
}

const SKILLS = [
  { key: "skillTeamwork" as const,   label: "Team",       color: "#6366F1" },
  { key: "skillCreativity" as const, label: "Create",     color: "#EC4899" },
  { key: "skillBusiness" as const,   label: "Business",   color: "#22C55E" },
  { key: "skillLeadership" as const, label: "Lead",       color: "#F59E0B" },
]

const GOAL_STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  not_started: { label: "Goals: Not started", bg: "#F1F5F9", color: "#64748B" },
  in_progress:  { label: "Goals: In progress",  bg: "#FEF3C7", color: "#92400E" },
  achieved:     { label: "Goals: Achieved 🎉",  bg: "#D1FAE5", color: "#065F46" },
}

function hasContent(r: Reflection | null) {
  return !!(r && (r.whatLearned || r.proudOf || r.challenges || r.nextSteps))
}

function SkillPips({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: i <= value ? color : "#E2E8F0" }}
        />
      ))}
    </div>
  )
}

export default function TeacherReflectionsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "submitted" | "pending">("all")
  const [savingFeedback, setSavingFeedback] = useState<Record<string, boolean>>({})
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({})
  const feedbackTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => {
    fetch("/api/reflections")
      .then((r) => r.json())
      .then((data: Student[]) => {
        if (!Array.isArray(data)) { setLoading(false); return }
        setStudents(data)
        const initFeedback: Record<string, string> = {}
        data.forEach((s) => { initFeedback[s.id] = s.reflection?.teacherFeedback ?? "" })
        setFeedbackText(initFeedback)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function toggleFeatured(student: Student) {
    const next = !student.reflection?.isFeatured
    setStudents((prev) => prev.map((s) => s.id === student.id
      ? { ...s, reflection: s.reflection ? { ...s.reflection, isFeatured: next } : null }
      : s
    ))
    await fetch(`/api/reflections/${student.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: next }),
    })
  }

  function handleFeedbackChange(studentId: string, text: string) {
    setFeedbackText((prev) => ({ ...prev, [studentId]: text }))
    clearTimeout(feedbackTimers.current[studentId])
    setSavingFeedback((prev) => ({ ...prev, [studentId]: true }))
    feedbackTimers.current[studentId] = setTimeout(async () => {
      await fetch(`/api/reflections/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherFeedback: text }),
      })
      setSavingFeedback((prev) => ({ ...prev, [studentId]: false }))
    }, 800)
  }

  function exportCSV() {
    const headers = ["Name", "Username", "Submitted", "Mood", "Teamwork", "Creativity", "Business", "Leadership", "Goal Status", "What Learned", "Proud Of", "Challenges", "Next Steps", "Media URL"]
    const rows = students.map((s) => [
      s.displayName, s.username,
      hasContent(s.reflection) ? "Yes" : "No",
      s.reflection?.moodEmoji ?? "",
      s.reflection?.skillTeamwork ?? 0,
      s.reflection?.skillCreativity ?? 0,
      s.reflection?.skillBusiness ?? 0,
      s.reflection?.skillLeadership ?? 0,
      s.reflection?.goalStatus ?? "not_started",
      s.reflection?.whatLearned ?? "",
      s.reflection?.proudOf ?? "",
      s.reflection?.challenges ?? "",
      s.reflection?.nextSteps ?? "",
      s.reflection?.mediaUrl ?? "",
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "reflections.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  const submitted = students.filter((s) => hasContent(s.reflection)).length
  const filtered = students.filter((s) =>
    filter === "submitted" ? hasContent(s.reflection) :
    filter === "pending"   ? !hasContent(s.reflection) : true
  )

  if (loading) return <div className="text-center py-20 font-bold" style={{ color: "#94A3B8" }}>Loading...</div>

  return (
    <div>
      {/* Header */}
      <div
        className="rounded-3xl p-8 mb-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)", boxShadow: "0 16px 32px -8px rgba(15,23,42,0.35)" }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Student Reflections 📝</h1>
            <p className="mt-1 font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
              {submitted} of {students.length} students have submitted
            </p>
            <div className="flex gap-3 mt-4">
              <div className="px-4 py-2 rounded-2xl text-sm font-bold" style={{ background: "rgba(255,255,255,0.12)", color: "white" }}>
                ✓ {submitted} submitted
              </div>
              <div className="px-4 py-2 rounded-2xl text-sm font-bold" style={{ background: "rgba(255,255,255,0.12)", color: "white" }}>
                ⏳ {students.length - submitted} pending
              </div>
              <div className="px-4 py-2 rounded-2xl text-sm font-bold" style={{ background: "rgba(255,255,255,0.12)", color: "white" }}>
                ⭐ {students.filter((s) => s.reflection?.isFeatured).length} featured
              </div>
            </div>
          </div>
          <button
            onClick={exportCSV}
            className="px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:opacity-80 flex-shrink-0"
            style={{ background: "#22C55E", color: "white", boxShadow: "0 4px 12px -2px rgba(34,197,94,0.4)" }}
          >
            ⬇ Export CSV
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-5">
          {(["all", "submitted", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all"
              style={{
                background: filter === f ? "white" : "rgba(255,255,255,0.12)",
                color: filter === f ? "#1E293B" : "rgba(255,255,255,0.8)",
              }}
            >
              {f === "all" ? `All (${students.length})` : f === "submitted" ? `Submitted (${submitted})` : `Pending (${students.length - submitted})`}
            </button>
          ))}
        </div>
      </div>

      {/* Student cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((student) => {
          const r = student.reflection
          const submitted_ = hasContent(r)
          const goalCfg = GOAL_STATUS_CONFIG[r?.goalStatus ?? "not_started"]

          return (
            <div
              key={student.id}
              className="rounded-3xl overflow-hidden bg-white"
              style={{
                boxShadow: r?.isFeatured
                  ? "0 8px 24px -4px rgba(99,102,241,0.2), 0 2px 8px -2px rgba(0,0,0,0.04)"
                  : "0 8px 24px -4px rgba(0,0,0,0.08), 0 2px 8px -2px rgba(0,0,0,0.04)",
                border: r?.isFeatured ? "2px solid #6366F1" : "2px solid #F1F5F9",
              }}
            >
              {/* Student header */}
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "2px solid #F8FAFC" }}>
                <div className="flex items-center gap-3">
                  <AvatarImage avatarId={student.avatarEmoji ?? "fox"} size={44} />
                  <div>
                    <div className="font-black flex items-center gap-2" style={{ color: "#1E293B" }}>
                      {student.displayName}
                      {r?.moodEmoji && <span className="text-xl">{r.moodEmoji}</span>}
                    </div>
                    <div className="text-xs" style={{ color: "#94A3B8" }}>@{student.username}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFeatured(student)}
                    title={r?.isFeatured ? "Remove from gallery" : "Feature in gallery"}
                    className="text-xl transition-all hover:scale-110 active:scale-90"
                  >
                    {r?.isFeatured ? "⭐" : "☆"}
                  </button>
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={submitted_ ? { background: "#D1FAE5", color: "#065F46" } : { background: "#F1F5F9", color: "#94A3B8" }}
                  >
                    {submitted_ ? "✓ Submitted" : "Not yet"}
                  </span>
                </div>
              </div>

              {/* Skills row (if rated) */}
              {r && (r.skillTeamwork || r.skillCreativity || r.skillBusiness || r.skillLeadership) ? (
                <div className="px-5 py-3 flex gap-4 flex-wrap" style={{ borderBottom: "1px solid #F8FAFC", background: "#FAFBFF" }}>
                  {SKILLS.map(({ key, label, color }) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <span className="text-xs font-bold" style={{ color: "#64748B" }}>{label}</span>
                      <SkillPips value={r[key]} color={color} />
                    </div>
                  ))}
                  {r.goalStatus && r.goalStatus !== "not_started" && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full ml-auto" style={{ background: goalCfg.bg, color: goalCfg.color }}>
                      {goalCfg.label}
                    </span>
                  )}
                </div>
              ) : null}

              {/* Reflection answers */}
              {submitted_ && r ? (
                <div className="px-5 py-4 space-y-3" style={{ borderBottom: "1px solid #F1F5F9" }}>
                  {r.whatLearned && (
                    <div>
                      <div className="text-xs font-black mb-0.5" style={{ color: "#6366F1" }}>What they learned</div>
                      <div className="text-sm leading-relaxed" style={{ color: "#334155" }}>{r.whatLearned}</div>
                    </div>
                  )}
                  {r.proudOf && (
                    <div>
                      <div className="text-xs font-black mb-0.5" style={{ color: "#22C55E" }}>Most proud of</div>
                      <div className="text-sm leading-relaxed" style={{ color: "#334155" }}>{r.proudOf}</div>
                    </div>
                  )}
                  {r.challenges && (
                    <div>
                      <div className="text-xs font-black mb-0.5" style={{ color: "#F59E0B" }}>Biggest challenge</div>
                      <div className="text-sm leading-relaxed" style={{ color: "#334155" }}>{r.challenges}</div>
                    </div>
                  )}
                  {r.nextSteps && (
                    <div>
                      <div className="text-xs font-black mb-0.5" style={{ color: "#EC4899" }}>Would do differently</div>
                      <div className="text-sm leading-relaxed" style={{ color: "#334155" }}>{r.nextSteps}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-5 py-8 text-center" style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <div className="text-4xl mb-2">📝</div>
                  <div className="text-sm font-medium" style={{ color: "#94A3B8" }}>No reflection submitted yet</div>
                </div>
              )}

              {/* Media */}
              {r?.mediaUrl && (
                <div className="px-5 py-3" style={{ borderBottom: "1px solid #F1F5F9" }}>
                  {r.mediaType === "link" ? (
                    <a href={r.mediaUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl"
                      style={{ background: "#EEF2FF", color: "#6366F1" }}>
                      🔗 View Media Reflection
                    </a>
                  ) : r.mediaType?.includes("video") ? (
                    <video src={r.mediaUrl} controls className="w-full rounded-xl" style={{ maxHeight: 200 }} />
                  ) : (
                    <audio src={r.mediaUrl} controls className="w-full" />
                  )}
                </div>
              )}

              {/* Teacher feedback */}
              <div className="px-5 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
                <label className="text-xs font-black mb-1.5 flex items-center gap-2" style={{ color: "#6366F1" }}>
                  💬 Your Feedback
                  {savingFeedback[student.id] && <span className="font-normal" style={{ color: "#94A3B8" }}>Saving...</span>}
                  {savingFeedback[student.id] === false && <span className="font-normal" style={{ color: "#22C55E" }}>Saved ✓</span>}
                </label>
                <textarea
                  value={feedbackText[student.id] ?? ""}
                  onChange={(e) => handleFeedbackChange(student.id, e.target.value)}
                  placeholder="Write feedback visible to this student..."
                  rows={2}
                  className="w-full rounded-xl px-3 py-2 text-sm resize-none outline-none transition-all"
                  style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#334155" }}
                  onFocus={(e) => { e.target.style.borderColor = "#6366F1" }}
                  onBlur={(e) => { e.target.style.borderColor = "#E2E8F0" }}
                />
              </div>

              {/* Footer */}
              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  {student.brandProfile?.brandName ? (
                    <div>
                      <div className="text-xs font-black" style={{ color: "#6366F1" }}>🚀 {student.brandProfile.brandName}</div>
                      {student.brandProfile.tagline && (
                        <div className="text-xs" style={{ color: "#94A3B8" }}>{student.brandProfile.tagline}</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs" style={{ color: "#CBD5E1" }}>No brand yet</div>
                  )}
                </div>
                <Link
                  href={`/teacher/students/${student.id}`}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                  style={{ background: "#EEF2FF", color: "#6366F1", boxShadow: "0 2px 6px rgba(99,102,241,0.2)" }}
                >
                  View Brand →
                </Link>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16">
            <div className="text-5xl mb-3">📝</div>
            <div className="font-bold text-lg" style={{ color: "#1E293B" }}>No students match this filter</div>
          </div>
        )}
      </div>
    </div>
  )
}
