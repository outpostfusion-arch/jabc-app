import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const SESSION_LABELS = ["", "What Is a Business?", "Target Markets & Promotions", "Team Marketing", "Product Tutorials", "Financial Basics", "Brand & Final Pitch"]
const SESSION_EMOJIS = ["", "&#x1F3E2;", "&#x1F3AF;", "&#x1F91D;", "&#x2699;&#xFE0F;", "&#x1F4B0;", "&#x1F3A8;"]
const BADGE_COLORS: Record<string, string> = {
  "business-architect": "#6366F1",
  "market-explorer": "#F43F5E",
  "promo-master": "#EC4899",
  "team-player": "#22C55E",
  maker: "#A855F7",
  "price-setter": "#FBBF24",
  "first-profit": "#14B8A6",
  entrepreneur: "#F97316",
}

export default async function ProgressPage() {
  const session = await auth()
  const [user, progress, userBadges] = await Promise.all([
    prisma.user.findUnique({ where: { id: session!.user.id }, select: { points: true, displayName: true, avatarEmoji: true } }),
    prisma.sessionProgress.findMany({ where: { userId: session!.user.id } }),
    prisma.userBadge.findMany({ where: { userId: session!.user.id }, include: { badge: true } }),
  ])

  const progressMap = Object.fromEntries(progress.map((p) => [p.sessionId, p]))
  const completedCount = progress.filter((p) => p.status === "COMPLETED").length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>My Progress</h1>
        <p className="mt-1 font-semibold" style={{ color: "#64748B" }}>Track your journey through the JABC program!</p>
      </div>

      {/* Points + overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl p-4 text-center border" style={{ background: "#EEF2FF", borderColor: "#6366F1" }}>
          <div className="text-3xl font-black" style={{ color: "#4338CA" }}>{user?.points ?? 0}</div>
          <div className="text-xs font-black uppercase tracking-wide mt-1" style={{ color: "#6366F1" }}>Points</div>
        </div>
        <div className="rounded-2xl p-4 text-center border" style={{ background: "#F0FDF4", borderColor: "#22C55E" }}>
          <div className="text-3xl font-black" style={{ color: "#15803D" }}>{completedCount}/6</div>
          <div className="text-xs font-black uppercase tracking-wide mt-1" style={{ color: "#22C55E" }}>Sessions Done</div>
        </div>
        <div className="rounded-2xl p-4 text-center border" style={{ background: "#FFFBEB", borderColor: "#FBBF24" }}>
          <div className="text-3xl font-black" style={{ color: "#92400E" }}>{userBadges.length}/8</div>
          <div className="text-xs font-black uppercase tracking-wide mt-1" style={{ color: "#FBBF24" }}>Badges Earned</div>
        </div>
        <div className="rounded-2xl p-4 text-center border" style={{ background: "#FFF1F2", borderColor: "#F43F5E" }}>
          <div className="text-3xl font-black" style={{ color: "#BE123C" }}>{Math.round((completedCount / 6) * 100)}%</div>
          <div className="text-xs font-black uppercase tracking-wide mt-1" style={{ color: "#F43F5E" }}>Complete</div>
        </div>
      </div>

      {/* Session progress */}
      <div className="mb-8">
        <h2 className="text-xl font-black mb-4" style={{ color: "#1E293B" }}>Sessions</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((id) => {
            const p = progressMap[id]
            const status = p?.status ?? "NOT_STARTED"
            const statusColor = status === "COMPLETED" ? "#22C55E" : status === "IN_PROGRESS" ? "#FBBF24" : "#94A3B8"
            const statusLabel = status === "COMPLETED" ? "Completed" : status === "IN_PROGRESS" ? "In Progress" : "Not Started"
            return (
              <div key={id} className="flex items-center gap-4 p-4 rounded-2xl border" style={{ background: "white", borderColor: "#E2E8F0" }}>
                <div className="text-2xl w-8 text-center">{SESSION_EMOJIS[id]}</div>
                <div className="flex-1">
                  <div className="font-black" style={{ color: "#1E293B" }}>Session {id}: {SESSION_LABELS[id]}</div>
                  {p?.completedAt && (
                    <div className="text-xs font-medium mt-0.5" style={{ color: "#94A3B8" }}>
                      Completed {new Date(p.completedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black" style={{ background: statusColor + "22", color: statusColor }}>{statusLabel}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-xl font-black mb-4" style={{ color: "#1E293B" }}>Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {userBadges.map((ub) => (
            <div key={ub.id} className="rounded-2xl border p-4 text-center" style={{ background: "white", borderColor: "#E2E8F0" }}>
              <div className="text-4xl mb-2">{ub.badge.emoji}</div>
              <div className="text-sm font-black" style={{ color: BADGE_COLORS[ub.badge.slug] ?? "#6366F1" }}>{ub.badge.name}</div>
              <div className="text-xs font-medium mt-1" style={{ color: "#94A3B8" }}>+{ub.badge.points} pts</div>
            </div>
          ))}
          {userBadges.length === 0 && (
            <div className="col-span-4 text-center py-8" style={{ color: "#94A3B8" }}>
              Complete sessions to earn badges!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}