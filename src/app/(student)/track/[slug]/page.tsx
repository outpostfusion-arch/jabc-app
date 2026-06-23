import Link from "next/link"

const TRACK_META: Record<string, { title: string; icon: string; gradient: string; shadow: string }> = {
  "3d-design":  { title: "3D Design",            icon: "🖨️", gradient: "linear-gradient(135deg, #6366F1, #818CF8)", shadow: "rgba(99,102,241,0.35)" },
  "video-game": { title: "Video Game Building",   icon: "🎮", gradient: "linear-gradient(135deg, #A855F7, #C084FC)", shadow: "rgba(168,85,247,0.35)" },
  "pixel-art":  { title: "Pixel Art & Animation", icon: "🎨", gradient: "linear-gradient(135deg, #F43F5E, #FB923C)", shadow: "rgba(244,63,94,0.35)" },
}

const TUTORIAL_NUMS = [1, 2, 3, 4, 5, 6]

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const meta = TRACK_META[slug] ?? { title: "Track", icon: "📚", gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)", shadow: "rgba(99,102,241,0.35)" }

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

      {/* Tutorial Cards */}
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
    </div>
  )
}
