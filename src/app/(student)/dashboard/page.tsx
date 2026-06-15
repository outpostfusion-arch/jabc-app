import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

const SESSION_ROUTES: Record<number, string> = {
  1: "bmc",
  2: "target-market",
  3: "team-workspace",
  4: "tutorials",
  5: "financials",
  6: "brand",
}

const SESSION_CONFIG = [
  { icon: "🏢", gradient: "linear-gradient(135deg, #6366F1, #818CF8)", shadow: "rgba(99,102,241,0.35)", accent: "#6366F1", light: "#EEF2FF", text: "#4338CA" },
  { icon: "🎯", gradient: "linear-gradient(135deg, #F97316, #FB923C)", shadow: "rgba(249,115,22,0.35)", accent: "#F97316", light: "#FFF7ED", text: "#C2410C" },
  { icon: "🤝", gradient: "linear-gradient(135deg, #22C55E, #4ADE80)", shadow: "rgba(34,197,94,0.35)",  accent: "#22C55E", light: "#F0FDF4", text: "#15803D" },
  { icon: "🎬", gradient: "linear-gradient(135deg, #A855F7, #C084FC)", shadow: "rgba(168,85,247,0.35)", accent: "#A855F7", light: "#FDF4FF", text: "#7E22CE" },
  { icon: "💰", gradient: "linear-gradient(135deg, #FBBF24, #FCD34D)", shadow: "rgba(251,191,36,0.35)",  accent: "#FBBF24", light: "#FFFBEB", text: "#92400E" },
  { icon: "🎨", gradient: "linear-gradient(135deg, #F43F5E, #FB7185)", shadow: "rgba(244,63,94,0.35)",  accent: "#F43F5E", light: "#FFF1F2", text: "#BE123C" },
]

export default async function DashboardPage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { displayName: true, points: true, userBadges: { select: { badgeId: true } } },
  })

  const sessions = await prisma.classSession.findMany({ orderBy: { sortOrder: "asc" } })

  const progresses = await prisma.sessionProgress.findMany({
    where: { userId: session!.user.id },
  })

  const progressMap = Object.fromEntries(progresses.map((p) => [p.sessionId, p.status]))
  const completedCount = progresses.filter((p) => p.status === "COMPLETED").length
  const badgeCount = user?.userBadges.length ?? 0

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="rounded-3xl p-8 mb-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 55%, #EC4899 100%)",
          boxShadow: "0 20px 40px -10px rgba(99,102,241,0.45)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />

        <h1 className="text-2xl sm:text-3xl font-black text-white relative">
          Hey {user?.displayName?.split(" ")[0] ?? "there"}! 👋
        </h1>
        <p className="mt-1 text-base sm:text-lg font-semibold relative" style={{ color: "rgba(255,255,255,0.8)" }}>
          Ready to build your business? Pick up where you left off.
        </p>

        <div className="flex flex-wrap gap-3 mt-5 relative">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold" style={{ background: "rgba(255,255,255,0.18)", color: "white" }}>
            ⭐ {user?.points ?? 0} points
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold" style={{ background: "rgba(255,255,255,0.18)", color: "white" }}>
            🏆 {badgeCount} badge{badgeCount !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold" style={{ background: "rgba(255,255,255,0.18)", color: "white" }}>
            ✅ {completedCount} / {sessions.length} sessions done
          </div>
        </div>
      </div>

      {/* Session Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((s, i) => {
          const status = progressMap[s.id] ?? "NOT_STARTED"
          const cfg = SESSION_CONFIG[i % SESSION_CONFIG.length]
          const isLocked = s.isLocked
          const route = SESSION_ROUTES[s.id]

          return (
            <div
              key={s.id}
              className="rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: isLocked ? "#F8FAFC" : "white",
                boxShadow: isLocked
                  ? "0 4px 12px rgba(0,0,0,0.06)"
                  : `0 8px 24px -4px ${cfg.shadow}, 0 4px 8px -2px rgba(0,0,0,0.05)`,
                opacity: isLocked ? 0.65 : 1,
              }}
            >
              {/* Gradient top strip */}
              <div
                className="h-2"
                style={{ background: isLocked ? "#E2E8F0" : cfg.gradient }}
              />

              <div className="p-6">
                {/* Session number + status */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: isLocked ? "#F1F5F9" : cfg.light, color: isLocked ? "#94A3B8" : cfg.text }}
                  >
                    Session {s.id}
                  </div>
                  {status === "COMPLETED" && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>✓ Done</span>
                  )}
                  {status === "IN_PROGRESS" && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#FEF3C7", color: "#92400E" }}>▶ In Progress</span>
                  )}
                </div>

                {/* Icon circle + title */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4"
                  style={{
                    background: isLocked ? "#F1F5F9" : cfg.light,
                    boxShadow: isLocked ? "none" : `0 4px 12px -2px ${cfg.shadow}`,
                  }}
                >
                  {cfg.icon}
                </div>

                <h3 className="text-xl font-black mb-2" style={{ color: isLocked ? "#94A3B8" : "#1E293B" }}>{s.title}</h3>
                <p className="text-sm font-medium mb-4" style={{ color: "#64748B" }}>{s.description}</p>

                <p className="text-xs mb-5 font-semibold" style={{ color: "#94A3B8" }}>
                  📚 {s.bcCurriculumTag.split(";")[0]}
                </p>

                {/* CTA */}
                {isLocked ? (
                  <div className="w-full py-3 rounded-2xl text-center text-sm font-bold" style={{ background: "#E2E8F0", color: "#94A3B8" }}>
                    🔒 Locked by teacher
                  </div>
                ) : (
                  <Link
                    href={`/session/${s.id}/${route}`}
                    className="block w-full py-3 rounded-2xl text-center text-sm font-bold text-white transition-all active:scale-95 hover:opacity-90"
                    style={{ background: cfg.gradient, boxShadow: `0 4px 12px -2px ${cfg.shadow}` }}
                  >
                    {status === "NOT_STARTED" ? "Start Session →" : status === "COMPLETED" ? "Review →" : "Continue →"}
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
