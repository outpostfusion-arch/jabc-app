import { prisma } from "@/lib/prisma"
import AvatarImage from "@/components/shared/AvatarImage"
import Link from "next/link"

function ReflectionAnswer({ label, text }: { label: string; text: string }) {
  if (!text) return null
  return (
    <div>
      <div className="text-xs font-black mb-1" style={{ color: "#6366F1" }}>{label}</div>
      <div className="text-sm leading-relaxed" style={{ color: "#334155" }}>{text}</div>
    </div>
  )
}

export default async function TeacherReflectionsPage() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { displayName: "asc" },
    select: {
      id: true,
      displayName: true,
      username: true,
      avatarEmoji: true,
      reflection: {
        select: {
          whatLearned: true,
          proudOf: true,
          challenges: true,
          nextSteps: true,
          mediaUrl: true,
          mediaType: true,
        },
      },
      brandProfile: { select: { brandName: true, tagline: true } },
    },
  })

  const submitted = students.filter(
    (s) => s.reflection && (s.reflection.whatLearned || s.reflection.proudOf || s.reflection.challenges || s.reflection.nextSteps)
  ).length

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
        <h1 className="text-3xl font-black text-white relative">Student Reflections 📝</h1>
        <p className="mt-1 font-semibold relative" style={{ color: "rgba(255,255,255,0.6)" }}>
          {submitted} of {students.length} students have submitted
        </p>
        <div className="flex gap-3 mt-4 relative">
          <div className="px-4 py-2 rounded-2xl text-sm font-bold" style={{ background: "rgba(255,255,255,0.12)", color: "white" }}>
            ✓ {submitted} submitted
          </div>
          <div className="px-4 py-2 rounded-2xl text-sm font-bold" style={{ background: "rgba(255,255,255,0.12)", color: "white" }}>
            ⏳ {students.length - submitted} pending
          </div>
        </div>
      </div>

      {/* Student cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {students.map((student) => {
          const r = student.reflection
          const hasContent = r && (r.whatLearned || r.proudOf || r.challenges || r.nextSteps)

          return (
            <div
              key={student.id}
              className="rounded-3xl overflow-hidden bg-white"
              style={{
                boxShadow: "0 8px 24px -4px rgba(0,0,0,0.08), 0 2px 8px -2px rgba(0,0,0,0.04)",
                border: "1px solid #F1F5F9",
              }}
            >
              {/* Student header */}
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: "2px solid #F8FAFC" }}
              >
                <div className="flex items-center gap-3">
                  <AvatarImage avatarId={student.avatarEmoji ?? "fox"} size={44} />
                  <div>
                    <div className="font-black" style={{ color: "#1E293B" }}>{student.displayName}</div>
                    <div className="text-xs" style={{ color: "#94A3B8" }}>@{student.username}</div>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={hasContent
                    ? { background: "#D1FAE5", color: "#065F46" }
                    : { background: "#F1F5F9", color: "#94A3B8" }}
                >
                  {hasContent ? "✓ Submitted" : "Not yet"}
                </span>
              </div>

              {/* Reflection answers */}
              {hasContent && r ? (
                <div className="px-5 py-4 space-y-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <ReflectionAnswer label="What they learned" text={r.whatLearned} />
                  <ReflectionAnswer label="Most proud of" text={r.proudOf} />
                  <ReflectionAnswer label="Biggest challenge" text={r.challenges} />
                  <ReflectionAnswer label="Would do differently" text={r.nextSteps} />
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
                    <a
                      href={r.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl transition-all hover:opacity-80"
                      style={{ background: "#EEF2FF", color: "#6366F1" }}
                    >
                      🔗 View Media Reflection
                    </a>
                  ) : r.mediaType?.includes("video") ? (
                    <video src={r.mediaUrl} controls className="w-full rounded-xl" style={{ maxHeight: 200 }} />
                  ) : (
                    <audio src={r.mediaUrl} controls className="w-full" />
                  )}
                </div>
              )}

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
                  View Brand Project →
                </Link>
              </div>
            </div>
          )
        })}

        {students.length === 0 && (
          <div className="col-span-2 text-center py-16">
            <div className="text-5xl mb-3">👥</div>
            <div className="font-bold text-lg" style={{ color: "#1E293B" }}>No students yet</div>
          </div>
        )}
      </div>
    </div>
  )
}
