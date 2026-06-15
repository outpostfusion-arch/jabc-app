import { prisma } from "@/lib/prisma"
import Link from "next/link"
import AvatarImage from "@/components/shared/AvatarImage"
import TeacherHeaderControls from "@/components/shared/TeacherHeaderControls"

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string; shadow: string }> = {
  NOT_STARTED: { bg: "#F1F5F9", text: "#94A3B8", label: "—", shadow: "none" },
  IN_PROGRESS:  { bg: "#FEF3C7", text: "#D97706", label: "▶", shadow: "0 2px 6px rgba(251,191,36,0.3)" },
  COMPLETED:    { bg: "#D1FAE5", text: "#065F46", label: "✓", shadow: "0 2px 6px rgba(34,197,94,0.3)" },
}

const SESSION_META: Record<number, { icon: string; label?: string }> = {
  1: { icon: "💼" },
  2: { icon: "🎯" },
  3: { icon: "🤝" },
  4: { icon: "⚙️" },
  5: { icon: "💰" },
  6: { icon: "🚀", label: "Product Launch" },
}

const NAV_CARDS = [
  { href: "#progress",          emoji: "👥", label: "Students",   gradient: "linear-gradient(135deg, #6366F1, #818CF8)", shadow: "rgba(99,102,241,0.35)" },
  { href: "/teacher/teams",     emoji: "🤝", label: "Teams",      gradient: "linear-gradient(135deg, #3B82F6, #60A5FA)", shadow: "rgba(59,130,246,0.35)" },
  { href: "/teacher/videos",    emoji: "🎬", label: "Videos",     gradient: "linear-gradient(135deg, #EC4899, #F472B6)", shadow: "rgba(236,72,153,0.35)" },
  { href: "/teacher/sessions",  emoji: "📅", label: "Sessions",   gradient: "linear-gradient(135deg, #10B981, #34D399)", shadow: "rgba(16,185,129,0.35)" },
]

export default async function TeacherDashboardPage() {
  const [students, sessions, teams] = await Promise.all([
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { displayName: "asc" },
      include: {
        sessionProgress: true,
        userBadges: { include: { badge: true } },
      },
    }),
    prisma.classSession.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.team.findMany({ include: { members: { select: { userId: true } } } }),
  ])

  const studentTeamMap = new Map<string, string>()
  for (const team of teams) {
    for (const m of team.members) studentTeamMap.set(m.userId, team.name)
  }

  const inProgress = students.filter((s) => s.sessionProgress.some((p) => p.status === "IN_PROGRESS")).length

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
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        <div className="absolute right-24 bottom-0 w-32 h-32 rounded-full" style={{ background: "rgba(99,102,241,0.12)" }} />
        <div className="flex items-start justify-between relative">
          <div>
            <h1 className="text-3xl font-black text-white">Class Dashboard 📊</h1>
            <p className="mt-1 font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
              {students.length} students · {inProgress} actively working
            </p>
          </div>
          <div className="absolute left-1/2 top-0 -translate-x-1/2 flex items-center gap-3">
            <span className="text-5xl">🚀</span>
            <div className="flex flex-col">
              <span className="text-5xl font-black text-white leading-none">JABC</span>
              <span className="text-base font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>Entrepreneurship program</span>
            </div>
          </div>
          <TeacherHeaderControls />
        </div>
      </div>

      {/* Nav cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {NAV_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-3xl p-8 relative overflow-hidden transition-all hover:scale-105 hover:opacity-90 flex flex-col justify-between"
            style={{
              background: card.gradient,
              boxShadow: `0 10px 24px -4px ${card.shadow}`,
              minHeight: "140px",
            }}
          >
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-20 select-none">{card.emoji}</div>
            <div className="text-3xl relative">{card.emoji}</div>
            <div className="text-base font-black mt-4 relative text-white">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Progress Grid */}
      <div
        id="progress"
        className="rounded-3xl overflow-hidden"
        style={{
          background: "white",
          boxShadow: "0 8px 24px -4px rgba(0,0,0,0.08), 0 4px 8px -2px rgba(0,0,0,0.04)",
          border: "1px solid #F1F5F9",
        }}
      >
        {/* Table header bar */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
          }}
        >
          <span className="font-black text-lg text-white">Student Progress</span>
          <Link
            href="/teacher/students/new"
            className="px-4 py-1.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
          >
            + Add Student
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #EEF2FF" }}>
                <th className="text-left px-5 py-3 font-bold" style={{ color: "#64748B" }}>Student</th>
                <th className="text-center px-3 py-3 font-bold" style={{ color: "#64748B" }}>Pts</th>
                {sessions.map((s) => {
                  const meta = SESSION_META[s.id] ?? { icon: "📋" }
                  return (
                    <th key={s.id} className="text-center px-4 py-3 font-bold" style={{ color: "#64748B", minWidth: "80px" }}>
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-base">{meta.icon}</span>
                        <span className="text-xs font-black">S{s.id}</span>
                        {meta.label && (
                          <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "#6366F1" }}>{meta.label}</span>
                        )}
                      </div>
                    </th>
                  )
                })}
                <th className="text-center px-4 py-3 font-bold" style={{ color: "#64748B" }}>View</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => {
                const progressMap = Object.fromEntries(student.sessionProgress.map((p) => [p.sessionId, p.status]))
                return (
                  <tr
                    key={student.id}
                    className="transition-colors hover:bg-indigo-50/40"
                    style={{ borderTop: idx > 0 ? "1px solid #F1F5F9" : undefined }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <AvatarImage avatarId={student.avatarEmoji ?? "fox"} size={36} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold" style={{ color: "#1E293B" }}>{student.displayName}</span>
                            {studentTeamMap.has(student.id) && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#EEF2FF", color: "#6366F1" }}>
                                🤝 {studentTeamMap.get(student.id)}
                              </span>
                            )}
                          </div>
                          <div className="text-xs" style={{ color: "#94A3B8" }}>@{student.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center px-3 py-3">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: "#FEF9C3", color: "#A16207", boxShadow: "0 2px 6px rgba(251,191,36,0.25)" }}
                      >
                        ⭐ {student.points}
                      </span>
                    </td>
                    {sessions.map((s) => {
                      const status = progressMap[s.id] ?? "NOT_STARTED"
                      const cfg = STATUS_CONFIG[status]
                      return (
                        <td key={s.id} className="text-center px-3 py-3">
                          <span
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                            style={{ background: cfg.bg, color: cfg.text, boxShadow: cfg.shadow }}
                            title={status}
                          >
                            {cfg.label}
                          </span>
                        </td>
                      )
                    })}
                    <td className="text-center px-4 py-3">
                      <Link
                        href={`/teacher/students/${student.id}`}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                        style={{ background: "#EEF2FF", color: "#6366F1", boxShadow: "0 2px 6px rgba(99,102,241,0.2)" }}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {students.length === 0 && (
                <tr>
                  <td colSpan={sessions.length + 3} className="text-center py-16">
                    <div className="text-5xl mb-3">👥</div>
                    <div className="font-bold text-lg" style={{ color: "#1E293B" }}>No students yet</div>
                    <div className="text-sm mt-1">
                      <Link href="/teacher/students/new" style={{ color: "#6366F1" }}>Create student accounts →</Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
