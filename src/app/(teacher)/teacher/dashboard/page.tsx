import { prisma } from "@/lib/prisma"
import Link from "next/link"
import AvatarImage from "@/components/shared/AvatarImage"
import TeacherHeaderControls from "@/components/shared/TeacherHeaderControls"
import NavCards from "@/components/shared/NavCards"
import LevelTabs from "@/components/shared/LevelTabs"
import ReflectionsPanel from "@/components/shared/ReflectionsPanel"
import { Suspense } from "react"

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string; shadow: string }> = {
  NOT_STARTED: { bg: "#E2E8F0", text: "#94A3B8", label: "–",  shadow: "none" },
  IN_PROGRESS:  { bg: "#F59E0B", text: "#ffffff", label: "▶",  shadow: "0 2px 8px rgba(245,158,11,0.45)" },
  COMPLETED:    { bg: "#22C55E", text: "#ffffff", label: "✓",  shadow: "0 2px 8px rgba(34,197,94,0.45)" },
}

const SESSION_META: Record<number, { icon: string; label?: string }> = {
  1: { icon: "💼" },
  2: { icon: "🎯" },
  3: { icon: "🤝" },
  4: { icon: "⚙️" },
  5: { icon: "💰" },
  6: { icon: "🚀", label: "Product Launch" },
}

const LEVEL_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  PRIMARY: { bg: "#FEF3C7", color: "#92400E", label: "Primary" },
  JUNIOR:  { bg: "#DCFCE7", color: "#166534", label: "Junior" },
  SENIOR:  { bg: "#DBEAFE", color: "#1E40AF", label: "Senior" },
}

export default async function TeacherDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>
}) {
  const { level } = await searchParams

  const [allStudents, sessions, teams] = await Promise.all([
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { displayName: "asc" },
      include: {
        sessionProgress: true,
        userBadges: { include: { badge: true } },
        classGroup: { select: { level: true, name: true } },
        reflection: {
          select: {
            whatLearned: true,
            marketInsight: true,
            proudOf: true,
            challenges: true,
            nextSteps: true,
            moodEmoji: true,
          },
        },
      },
    }),
    prisma.classSession.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.team.findMany({ include: { members: { select: { userId: true } } } }),
  ])

  const students = level
    ? allStudents.filter((s) => s.classGroup?.level === level)
    : allStudents

  const studentTeamMap = new Map<string, string>()
  for (const team of teams) {
    for (const m of team.members) studentTeamMap.set(m.userId, team.name)
  }

  const inProgress = students.filter((s) => s.sessionProgress.some((p) => p.status === "IN_PROGRESS")).length

  const levelLabel = level === "PRIMARY" ? "Primary" : level === "JUNIOR" ? "Junior" : level === "SENIOR" ? "Senior" : "All"

  const LEVEL_COLOR: Record<string, string> = {
    PRIMARY: "linear-gradient(135deg, #F59E0B, #D97706)",
    JUNIOR:  "linear-gradient(135deg, #22C55E, #16A34A)",
    SENIOR:  "linear-gradient(135deg, #6366F1, #8B5CF6)",
  }
  const progressBarBg = level ? (LEVEL_COLOR[level] ?? "linear-gradient(135deg, #6366F1, #8B5CF6)") : "linear-gradient(135deg, #6366F1, #8B5CF6)"

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
        <div className="flex items-start justify-between relative gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-white">Class Dashboard 📊</h1>
            <p className="mt-1 font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
              {students.length} {levelLabel !== "All" ? `${levelLabel} ` : ""}students · {inProgress} actively working
            </p>
            <div className="hidden md:flex items-center gap-3 mt-3">
              <span className="text-4xl">🍃</span>
              <div className="flex flex-col">
                <span className="text-4xl font-black text-white leading-none">Arrow Leaf</span>
                <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>Entrepreneurship program</span>
              </div>
            </div>
          </div>
          <TeacherHeaderControls />
        </div>
      </div>

      {/* Nav cards */}
      <NavCards />

      {/* Level Tabs */}
      <Suspense>
        <LevelTabs />
      </Suspense>

      {/* Progress Grid */}
      <div
        id="progress"
        className="rounded-3xl overflow-hidden"
        style={{
          background: "white",
          boxShadow: "0 8px 24px -4px rgba(0,0,0,0.08), 0 4px 8px -2px rgba(0,0,0,0.04)",
          border: "2px solid #1E293B",
        }}
      >
        {/* Table header bar */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: progressBarBg }}
        >
          <span className="font-black text-lg text-white">
            Student Progress {levelLabel !== "All" && `— ${levelLabel}`}
          </span>
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
                <th className="text-center px-3 py-3 font-bold" style={{ color: "#64748B" }}>Level</th>
                <th className="text-center px-3 py-3 font-bold" style={{ color: "#64748B" }}>Badges</th>
                {sessions.map((s) => {
                  const meta = SESSION_META[s.id] ?? { icon: "📋" }
                  return (
                    <th key={s.id} className="text-center px-4 py-3 font-bold" style={{ color: "#64748B", minWidth: "80px" }}>
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-base">{meta.icon}</span>
                        <span className="text-sm font-black">S{s.id}</span>
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
                const levelCfg = student.classGroup ? LEVEL_BADGE[student.classGroup.level] : null
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
                      {levelCfg ? (
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{ background: levelCfg.bg, color: levelCfg.color }}
                        >
                          {levelCfg.label}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "#CBD5E1" }}>—</span>
                      )}
                    </td>
                    <td className="text-center px-3 py-3">
                      <div className="flex justify-center gap-0.5 whitespace-nowrap">
                        {student.userBadges.length === 0 ? (
                          <span className="text-xs" style={{ color: "#CBD5E1" }}>—</span>
                        ) : (
                          student.userBadges.map((ub) => (
                            <span key={ub.badge.id} title={ub.badge.name} className="text-base leading-none">{ub.badge.emoji}</span>
                          ))
                        )}
                      </div>
                    </td>
                    {sessions.map((s) => {
                      const status = progressMap[s.id] ?? "NOT_STARTED"
                      const cfg = STATUS_CONFIG[status]
                      return (
                        <td key={s.id} className="text-center px-3 py-3">
                          <span
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                            style={{ background: cfg.bg, color: cfg.text, boxShadow: cfg.shadow, border: "2px solid #1E293B" }}
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
                  <td colSpan={sessions.length + 4} className="text-center py-16">
                    <div className="text-5xl mb-3">👥</div>
                    <div className="font-bold text-lg" style={{ color: "#1E293B" }}>
                      No {levelLabel !== "All" ? `${levelLabel} ` : ""}students yet
                    </div>
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
