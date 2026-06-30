import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import MakerCard from "@/components/arrow/MakerCard"
import ResetMascot from "@/components/arrow/ResetMascot"
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
    title: "Digital Design & Marketing",
    tagline: "Build a brand, create content, and learn to market like a pro.",
    icon: "📱",
    gradient: "linear-gradient(135deg, #F59E0B, #FBBF24)",
    shadow: "rgba(245,158,11,0.4)",
    href: "/track/digital-design",
    unlock: "robot" as const,
  },
  {
    title: "3D Design",
    tagline: "Design and print real objects you can hold in your hands.",
    icon: (
      <svg width="48" height="46" viewBox="0 0 56 54" fill="none">
        {/* Printer front panel — light blue */}
        <rect x="0" y="0" width="56" height="54" rx="10" fill="#5BA4D9"/>
        {/* Inner chamber — dark */}
        <rect x="4" y="4" width="48" height="34" rx="5" fill="#2D3A4A"/>
        {/* Horizontal rail — grey */}
        <rect x="7" y="14" width="42" height="5" rx="2.5" fill="#8FA3B4"/>
        {/* Print head block */}
        <rect x="27" y="8" width="15" height="15" rx="2" fill="#1B2736"/>
        {/* Nozzle */}
        <rect x="32.5" y="23" width="4" height="9" rx="1.5" fill="#8FA3B4"/>
        {/* Printed object — white vase */}
        <rect x="23" y="27" width="18" height="3" rx="1.5" fill="white"/>
        <path d="M25 30 C22 35 26 39 30 39.5 L34 39.5 C38 39 42 35 39 30 Z" fill="white"/>
        <rect x="27" y="39.5" width="10" height="2.5" rx="1" fill="white"/>
        {/* Bottom control panel */}
        <rect x="4" y="43" width="22" height="8" rx="3" fill="#1B2736"/>
        {/* Red button */}
        <circle cx="36" cy="47" r="4.5" fill="#E53E3E"/>
        {/* Yellow button */}
        <circle cx="48" cy="47" r="4.5" fill="#F6C90E"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #6366F1, #818CF8)",
    shadow: "rgba(99,102,241,0.4)",
    href: "/track/3d-design",
    unlock: "later" as const,
  },
  {
    title: "Video Game Building",
    tagline: "Create your own game from scratch and share it with friends.",
    icon: "🎮",
    gradient: "linear-gradient(135deg, #A855F7, #C084FC)",
    shadow: "rgba(168,85,247,0.4)",
    href: "/track/video-game",
    unlock: "later" as const,
  },
  {
    title: "Pixel Art & Animation",
    tagline: "Bring characters and worlds to life one pixel at a time.",
    icon: "🎨",
    gradient: "linear-gradient(135deg, #F43F5E, #FB923C)",
    shadow: "rgba(244,63,94,0.4)",
    href: "/track/pixel-art",
    unlock: "later" as const,
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
      robotId: true,
      classGroup: { select: { level: true } },
    },
  })

  // Teachers in student-preview mode use the cookie they set via LevelTabs
  const isTeacher = user?.role === "TEACHER"

  // Reaching /dashboard means the student experience.
  // - No robot yet: every card is locked behind choosing a robot.
  // - Robot chosen: only the "robot"-unlock track opens; "later" tracks
  //   stay locked (future progression).
  // Applies to teachers previewing too, so they see what students see.
  const hasRobot = !!user?.robotId
  const robotConfig = user?.robotId ? (() => { try { return JSON.parse(user.robotId) } catch { return null } })() : null
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
        {/* Robot mascot — clickable demo-reset for teachers, decorative for students */}
        <div
          className="absolute -right-2 -bottom-2 opacity-90 hidden sm:block"
          style={{ pointerEvents: isTeacher ? "auto" : "none" }}
        >
          <ResetMascot size={120} canReset={isTeacher} robotConfig={robotConfig} />
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
      <div className="relative mb-6">
        {!hasRobot && (
          <div className="absolute -top-3 left-6 z-10 animate-bounce">
            <span
              className="px-3 py-1 rounded-full text-xs font-black shadow-lg whitespace-nowrap"
              style={{ background: "#1E293B", color: "white" }}
            >
              👇 Start here
            </span>
          </div>
        )}
        <Link
          href="/choose-robot"
          className="flex items-center justify-between px-6 py-4 rounded-2xl transition-all hover:opacity-90"
          style={{
            background: !hasRobot
              ? "linear-gradient(135deg, #F59E0B, #FB923C)"
              : "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow: !hasRobot ? "0 4px 20px rgba(245,158,11,0.5)" : "0 4px 16px rgba(99,102,241,0.35)",
            ...(!hasRobot ? { animation: "robot-cta-pulse 2s ease-in-out infinite" } : {}),
          }}
        >
          <div>
            <div className="font-black text-white">
              {!hasRobot ? "Choose Your Robot to Begin! 🤖" : "Choose Your Robot 🤖"}
            </div>
            <div className="text-xs font-semibold mt-0.5" style={{ color: "rgba(255,255,255,0.8)" }}>
              {!hasRobot
                ? "Pick your character to unlock your first maker track"
                : "Pick your character + preview 48 unlocks"}
            </div>
          </div>
          <span className="text-2xl">→</span>
        </Link>
      </div>

      {/* Maker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TRACKS.map((track) => {
          // No robot → locked behind the picker.
          // Robot chosen → only "robot"-unlock tracks open; others stay locked.
          const lockedForRobot = !hasRobot
          const lockedForLater = hasRobot && track.unlock === "later"
          const locked = lockedForRobot || lockedForLater
          const lockLabel = lockedForRobot ? "🔒 Choose a Robot First" : "🔒 Coming Soon"
          const lockHref = lockedForRobot ? "/choose-robot" : undefined
          return (
            <MakerCard
              key={track.href}
              {...track}
              locked={locked}
              lockLabel={lockLabel}
              lockHref={lockHref}
            />
          )
        })}
      </div>
    </div>
  )
}
