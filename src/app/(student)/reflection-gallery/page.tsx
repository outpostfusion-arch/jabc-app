import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AvatarImage from "@/components/shared/AvatarImage"

const SKILLS = [
  { key: "skillTeamwork" as const,   label: "Teamwork",         color: "#6366F1" },
  { key: "skillCreativity" as const, label: "Creativity",       color: "#EC4899" },
  { key: "skillBusiness" as const,   label: "Business Thinking", color: "#22C55E" },
  { key: "skillLeadership" as const, label: "Leadership",       color: "#F59E0B" },
]

function SkillPips({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="w-2 h-2 rounded-full" style={{ background: i <= value ? color : "#E2E8F0" }} />
      ))}
    </div>
  )
}

export default async function ReflectionGalleryPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const students = await prisma.user.findMany({
    where: { role: "STUDENT", reflection: { isFeatured: true } },
    orderBy: { displayName: "asc" },
    select: {
      id: true,
      displayName: true,
      avatarEmoji: true,
      reflection: {
        select: {
          moodEmoji: true,
          whatLearned: true,
          proudOf: true,
          skillTeamwork: true,
          skillCreativity: true,
          skillBusiness: true,
          skillLeadership: true,
          goalStatus: true,
        },
      },
      brandProfile: { select: { brandName: true, tagline: true } },
    },
  })

  const GOAL_LABELS: Record<string, string> = {
    not_started: "Goals: Not started",
    in_progress:  "Goals: In progress",
    achieved:     "Achieved their goals 🎉",
  }
  const GOAL_COLORS: Record<string, { bg: string; color: string }> = {
    not_started: { bg: "#F1F5F9", color: "#64748B" },
    in_progress:  { bg: "#FEF3C7", color: "#92400E" },
    achieved:     { bg: "#D1FAE5", color: "#065F46" },
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div
        className="rounded-3xl p-8 mb-8 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #6366F1 0%, #EC4899 100%)", boxShadow: "0 16px 32px -8px rgba(99,102,241,0.4)" }}
      >
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        <h1 className="text-3xl font-black text-white relative">Featured Reflections ⭐</h1>
        <p className="mt-1 font-semibold relative" style={{ color: "rgba(255,255,255,0.75)" }}>
          {students.length} reflection{students.length !== 1 ? "s" : ""} featured by your teacher
        </p>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl" style={{ border: "2px solid #F1F5F9" }}>
          <div className="text-6xl mb-4">⭐</div>
          <div className="text-xl font-black" style={{ color: "#1E293B" }}>No featured reflections yet</div>
          <div className="text-sm mt-2" style={{ color: "#94A3B8" }}>Your teacher will feature standout reflections here</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map((student) => {
            const r = student.reflection!
            const goalStyle = GOAL_COLORS[r.goalStatus ?? "not_started"]
            const hasSkills = r.skillTeamwork || r.skillCreativity || r.skillBusiness || r.skillLeadership

            return (
              <div
                key={student.id}
                className="bg-white rounded-3xl overflow-hidden"
                style={{ boxShadow: "0 8px 24px -4px rgba(99,102,241,0.15)", border: "2px solid #EEF2FF" }}
              >
                {/* Header */}
                <div
                  className="px-5 py-4 flex items-center gap-3"
                  style={{ background: "linear-gradient(135deg, #EEF2FF, #FDF2F8)", borderBottom: "1px solid #E2E8F0" }}
                >
                  <AvatarImage avatarId={student.avatarEmoji ?? "fox"} size={48} />
                  <div className="flex-1 min-w-0">
                    <div className="font-black flex items-center gap-2" style={{ color: "#1E293B" }}>
                      {student.displayName}
                      {r.moodEmoji && <span className="text-xl">{r.moodEmoji}</span>}
                    </div>
                    {student.brandProfile?.brandName && (
                      <div className="text-xs font-bold mt-0.5" style={{ color: "#6366F1" }}>
                        🚀 {student.brandProfile.brandName}
                        {student.brandProfile.tagline && ` — ${student.brandProfile.tagline}`}
                      </div>
                    )}
                  </div>
                  <span className="text-lg">⭐</span>
                </div>

                {/* Skills */}
                {hasSkills && (
                  <div className="px-5 py-3 flex gap-3 flex-wrap" style={{ borderBottom: "1px solid #F8FAFC", background: "#FAFBFF" }}>
                    {SKILLS.map(({ key, label, color }) => r[key] > 0 ? (
                      <div key={key} className="flex items-center gap-1.5">
                        <span className="text-xs font-bold" style={{ color: "#64748B" }}>{label}</span>
                        <SkillPips value={r[key]} color={color} />
                      </div>
                    ) : null)}
                  </div>
                )}

                <div className="px-5 py-4 space-y-3">
                  {r.whatLearned && (
                    <div>
                      <div className="text-xs font-black mb-0.5" style={{ color: "#6366F1" }}>What I learned</div>
                      <div className="text-sm leading-relaxed" style={{ color: "#334155" }}>
                        {r.whatLearned.length > 200 ? r.whatLearned.slice(0, 200) + "..." : r.whatLearned}
                      </div>
                    </div>
                  )}
                  {r.proudOf && (
                    <div>
                      <div className="text-xs font-black mb-0.5" style={{ color: "#22C55E" }}>Most proud of</div>
                      <div className="text-sm leading-relaxed" style={{ color: "#334155" }}>
                        {r.proudOf.length > 150 ? r.proudOf.slice(0, 150) + "..." : r.proudOf}
                      </div>
                    </div>
                  )}
                  {r.goalStatus && r.goalStatus !== "not_started" && (
                    <span className="inline-block text-xs font-bold px-3 py-1 rounded-full" style={{ background: goalStyle.bg, color: goalStyle.color }}>
                      {GOAL_LABELS[r.goalStatus]}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
