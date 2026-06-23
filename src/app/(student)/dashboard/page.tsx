import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import MakerCard from "@/components/arrow/MakerCard"
import RobotMascot from "@/components/arrow/RobotMascot"
import Link from "next/link"

const LEVEL_THEME = {
  PRIMARY: {
    label: "Primary",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
    shadow: "rgba(245,158,11,0.45)",
    badge: { bg: "#FEF3C7", color: "#92400E" },
  },
  JUNIOR: {
    label: "Junior",
    gradient: "linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)",
    shadow: "rgba(34,197,94,0.45)",
    badge: { bg: "#DCFCE7", color: "#166534" },
  },
  SENIOR: {
    label: "Senior",
    gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
    shadow: "rgba(99,102,241,0.45)",
    badge: { bg: "#EEF2FF", color: "#4338CA" },
  },
} as const

type Level = keyof typeof LEVEL_THEME

const TRACKS = [
  {
    title: "3D Design",
    tagline: "Design and print real objects you can hold in your hands.",
    icon: "🖨️",
    gradient: "linear-gradient(135deg, #6366F1, #818CF8)",
    shadow: "rgba(99,102,241,0.4)",
    href: "/track/3d-design",
  },
  {
    title: "Video Game Building",
    tagline: "Create your own game from scratch and share it with friends.",
    icon: "🎮",
    gradient: "linear-gradient(135deg, #A855F7, #C084FC)",
    shadow: "rgba(168,85,247,0.4)",
    href: "/track/video-game",
  },
  {
    title: "Pixel Art & Animation",
    tagline: "Bring characters and worlds to life one pixel at a time.",
    icon: "🎨",
    gradient: "linear-gradient(135deg, #F43F5E, #FB923C)",
    shadow: "rgba(244,63,94,0.4)",
    href: "/track/pixel-art",
  },
]

export default async function DashboardPage() {
  const session = await auth()
  const cookieStore = await cookies()

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: {
      displayName: true,
      role: true,
      classGroup: { select: { level: true } },
    },
  })

  // Teachers in student-preview mode use the cookie they set via LevelTabs
  const isTeacher = user?.role === "TEACHER"
  const levelRaw = isTeacher
    ? cookieStore.get("jabc-level-preview")?.value
    : user?.classGroup?.level ?? undefined

  const level = (levelRaw && levelRaw in LEVEL_THEME ? levelRaw : null) as Level | null
  const theme = level ? LEVEL_THEME[level] : null

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="rounded-3xl p-8 mb-10 relative overflow-hidden"
        style={{
          background: theme ? theme.gradient : "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
          boxShadow: `0 20px 40px -10px ${theme ? theme.shadow : "rgba(15,23,42,0.4)"}`,
        }}
      >
        {/* Robot mascot */}
        <div className="absolute -right-2 -bottom-2 opacity-90 hidden sm:block" style={{ pointerEvents: "none" }}>
          <RobotMascot size={120} />
        </div>

        <div className="flex items-center gap-3 mb-3 relative">
          <span className="text-4xl">🍃</span>
          <span className="text-2xl font-black text-white">Arrow Leaf</span>
          {level && (
            <span
              className="px-3 py-1 rounded-full text-xs font-black ml-1"
              style={{ background: theme!.badge.bg, color: theme!.badge.color }}
            >
              {theme!.label}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white relative">
          Hey {user?.displayName?.split(" ")[0] ?? "there"}! 👋
        </h1>
        <p className="mt-2 text-base font-semibold relative" style={{ color: "rgba(255,255,255,0.75)" }}>
          {level ? `${theme!.label} track — pick a maker challenge below.` : "Pick a track and start making something awesome."}
        </p>
      </div>

      {/* Choose robot CTA */}
      <Link
        href="/choose-robot"
        className="flex items-center justify-between px-6 py-4 rounded-2xl mb-6 transition-all hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}
      >
        <div>
          <div className="font-black text-white">Choose Your Robot 🤖</div>
          <div className="text-xs font-semibold mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>Pick your character + preview 48 unlocks</div>
        </div>
        <span className="text-2xl">→</span>
      </Link>

      {/* Maker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {TRACKS.map((track) => (
          <MakerCard key={track.href} {...track} />
        ))}
      </div>
    </div>
  )
}
