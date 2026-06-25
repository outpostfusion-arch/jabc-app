import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TRACK_LESSONS } from "@/components/arrow/lessons"
import DesignWorkDemo from "@/components/arrow/DesignWorkDemo"

const TRACK_META: Record<string, { title: string; icon: string; gradient: string; shadow: string }> = {
  "digital-design": { title: "Digital Design & Marketing", icon: "📱", gradient: "linear-gradient(135deg, #F59E0B, #FBBF24)", shadow: "rgba(245,158,11,0.35)" },
  "3d-design":      { title: "3D Design",                  icon: "🖨️", gradient: "linear-gradient(135deg, #6366F1, #818CF8)", shadow: "rgba(99,102,241,0.35)" },
  "video-game":     { title: "Video Game Building",         icon: "🎮", gradient: "linear-gradient(135deg, #A855F7, #C084FC)", shadow: "rgba(168,85,247,0.35)" },
  "pixel-art":      { title: "Pixel Art & Animation",       icon: "🎨", gradient: "linear-gradient(135deg, #F43F5E, #FB923C)", shadow: "rgba(244,63,94,0.35)" },
}

const TUTORIAL_NUMS = [1, 2, 3, 4, 5, 6]

// Tracks a student can open right now. Choosing a robot unlocks these;
// the rest stay locked until later progression is added.
const OPEN_TRACKS = ["digital-design"]

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Gate: a robot must be chosen before opening any track, and only the
  // currently-open tracks are reachable. Applies to teachers previewing too.
  const session = await auth()
  if (session) {
    const me = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { robotId: true },
    })
    if (!me?.robotId) redirect("/choose-robot")
    if (!OPEN_TRACKS.includes(slug)) redirect("/dashboard")
  }

  const meta = TRACK_META[slug] ?? { title: "Track", icon: "📚", gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)", shadow: "rgba(99,102,241,0.35)" }
  const lessons = TRACK_LESSONS[slug]

  return (
    <div>
      {/* Header */}
      <div
        className="rounded-3xl p-8 mb-8 relative overflow-hidden"
        style={{
          background: meta.gradient,
          boxShadow: `0 20px 40px -10px ${meta.shadow}`,
        }}
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-bold mb-4 px-3 py-1.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
        >
          ← Back
        </Link>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            {meta.icon}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{meta.title}</h1>
            <p className="text-sm font-semibold mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
              6 tutorials to guide you through
            </p>
          </div>
        </div>
      </div>

      {/* Featured Session 1 teaching visual (digital-design only) */}
      {slug === "digital-design" && (
        <div className="mb-8">
          <DesignWorkDemo />
        </div>
      )}

      {/* Lesson cards — real content when we have it, placeholders otherwise */}
      {lessons ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {lessons.map((lesson) => (
            <div
              key={lesson.session}
              className="rounded-3xl overflow-hidden flex flex-col"
              style={{
                background: "white",
                border: "2px solid #E2E8F0",
                boxShadow: "0 4px 16px -4px rgba(0,0,0,0.06)",
              }}
            >
              {/* Color strip */}
              <div className="h-2" style={{ background: meta.gradient }} />

              <div className="p-6 flex flex-col gap-4 flex-1">
                {/* Session number + title */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-black text-white shrink-0"
                    style={{ background: meta.gradient }}
                  >
                    {lesson.session}
                  </div>
                  <h3 className="text-lg font-black leading-tight" style={{ color: "#1E293B" }}>
                    {lesson.title}
                  </h3>
                </div>

                {/* Objective */}
                <p className="text-sm font-semibold" style={{ color: "#64748B" }}>
                  {lesson.objective}
                </p>

                {/* What you'll build */}
                <div className="rounded-2xl p-4" style={{ background: "#F8FAFC" }}>
                  <div className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>
                    🎨 You&apos;ll build
                  </div>
                  <div className="text-sm font-bold" style={{ color: "#334155" }}>
                    {lesson.build}
                  </div>
                </div>

                {/* Canva skills */}
                <div className="flex flex-wrap gap-1.5">
                  {lesson.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: "#EEF2FF", color: "#4338CA" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Concept */}
                <div className="text-xs font-semibold" style={{ color: "#64748B" }}>
                  💡 <span style={{ color: "#1E293B", fontWeight: 800 }}>{lesson.concept.term}:</span>{" "}
                  {lesson.concept.framing}
                </div>

                {/* Open in Canva */}
                <a
                  href={`https://www.canva.com/templates/?query=${encodeURIComponent(lesson.canvaSearch)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl text-center text-sm font-black text-white mt-auto transition-all hover:opacity-90"
                  style={{ background: meta.gradient }}
                >
                  Open in Canva ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TUTORIAL_NUMS.map((num) => (
            <div
              key={num}
              className="rounded-3xl overflow-hidden"
              style={{
                background: "white",
                border: "2px solid #E2E8F0",
                boxShadow: "0 4px 16px -4px rgba(0,0,0,0.06)",
              }}
            >
              {/* Color strip */}
              <div className="h-2" style={{ background: meta.gradient }} />

              <div className="p-6 flex flex-col gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black"
                  style={{ background: "#F8FAFC", color: "#94A3B8" }}
                >
                  {num}
                </div>

                <div>
                  <div className="h-4 rounded-lg mb-2" style={{ background: "#F1F5F9", width: "60%" }} />
                  <div className="h-3 rounded-lg mb-1.5" style={{ background: "#F8FAFC", width: "90%" }} />
                  <div className="h-3 rounded-lg" style={{ background: "#F8FAFC", width: "75%" }} />
                </div>

                <div
                  className="w-full py-3 rounded-2xl text-center text-sm font-bold mt-auto"
                  style={{ background: "#F1F5F9", color: "#CBD5E1" }}
                >
                  Coming Soon
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
