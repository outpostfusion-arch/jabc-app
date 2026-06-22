"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import AvatarImage from "@/components/shared/AvatarImage"

interface StudentReflection {
  whatLearned: string
  marketInsight: string
  proudOf: string
  challenges: string
  nextSteps: string
  moodEmoji: string
}

interface Student {
  id: string
  displayName: string
  avatarEmoji: string
  reflection: StudentReflection | null
}

export default function ReflectionsPanel({
  students,
  levelLabel,
}: {
  students: Student[]
  levelLabel: string
}) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [students, open])

  return (
    <div className="mt-8">
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "white",
          boxShadow: "0 8px 24px -4px rgba(0,0,0,0.08)",
          border: "2px solid #1E293B",
        }}
      >
        {/* Header with toggle */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
        >
          <span className="font-black text-lg text-white">
            Student Reflections 📝{levelLabel !== "All" && ` — ${levelLabel}`}
          </span>

          <div className="flex items-center gap-3">
            <Link
              href="/teacher/reflections"
              className="px-4 py-1.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
            >
              View All →
            </Link>

            {/* Toggle switch */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="relative flex-shrink-0"
              style={{ width: 48, height: 26 }}
              aria-label={open ? "Hide reflections" : "Show reflections"}
            >
              <span
                className="block rounded-full transition-colors duration-300"
                style={{
                  width: 48,
                  height: 26,
                  background: open ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
                }}
              />
              <span
                className="absolute top-0.5 left-0.5 rounded-full transition-transform duration-300 shadow-sm"
                style={{
                  width: 22,
                  height: 22,
                  background: open ? "#6366F1" : "white",
                  transform: open ? "translateX(22px)" : "translateX(0)",
                }}
              />
            </button>
          </div>
        </div>

        {/* Sliding content */}
        <div
          style={{
            height: open ? height : 0,
            overflow: "hidden",
            transition: "height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div ref={contentRef} className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {students.map((student) => {
              const r = student.reflection
              const hasAny = r && (r.whatLearned || r.marketInsight || r.proudOf || r.challenges || r.nextSteps)

              return (
                <div
                  key={student.id}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1.5px solid #E2E8F0", background: "#FAFBFF" }}
                >
                  <div
                    className="px-4 py-3 flex items-center gap-3"
                    style={{ borderBottom: "1.5px solid #E2E8F0", background: "white" }}
                  >
                    <AvatarImage avatarId={student.avatarEmoji ?? "fox"} size={32} />
                    <span className="font-black text-sm" style={{ color: "#1E293B" }}>{student.displayName}</span>
                    {r?.moodEmoji && <span className="text-lg">{r.moodEmoji}</span>}
                    <span
                      className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
                      style={hasAny
                        ? { background: "#D1FAE5", color: "#065F46" }
                        : { background: "#F1F5F9", color: "#94A3B8" }}
                    >
                      {hasAny ? "✓ Submitted" : "Not yet"}
                    </span>
                  </div>

                  {hasAny && r ? (
                    <div className="px-4 py-3 space-y-2.5">
                      {r.whatLearned && (
                        <div>
                          <div className="text-xs font-black mb-0.5" style={{ color: "#6366F1" }}>Business idea</div>
                          <div className="text-xs leading-relaxed" style={{ color: "#475569" }}>{r.whatLearned}</div>
                        </div>
                      )}
                      {r.marketInsight && (
                        <div>
                          <div className="text-xs font-black mb-0.5" style={{ color: "#A855F7" }}>Target customer</div>
                          <div className="text-xs leading-relaxed" style={{ color: "#475569" }}>{r.marketInsight}</div>
                        </div>
                      )}
                      {r.proudOf && (
                        <div>
                          <div className="text-xs font-black mb-0.5" style={{ color: "#22C55E" }}>Team achievement</div>
                          <div className="text-xs leading-relaxed" style={{ color: "#475569" }}>{r.proudOf}</div>
                        </div>
                      )}
                      {r.challenges && (
                        <div>
                          <div className="text-xs font-black mb-0.5" style={{ color: "#F59E0B" }}>Biggest challenge</div>
                          <div className="text-xs leading-relaxed" style={{ color: "#475569" }}>{r.challenges}</div>
                        </div>
                      )}
                      {r.nextSteps && (
                        <div>
                          <div className="text-xs font-black mb-0.5" style={{ color: "#EC4899" }}>Would change / improve</div>
                          <div className="text-xs leading-relaxed" style={{ color: "#475569" }}>{r.nextSteps}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <div className="text-2xl mb-1">📝</div>
                      <div className="text-xs font-medium" style={{ color: "#94A3B8" }}>No reflection submitted yet</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
