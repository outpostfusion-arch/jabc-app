"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const NAV_CARDS = [
  {
    href: "#progress",
    emoji: "👥",
    label: "Students",
    gradient: "linear-gradient(135deg, #6366F1, #818CF8)",
    shadow: "rgba(99,102,241,0.35)",
    summary: "Track every student's session progress, badge count, and team assignment at a glance.",
  },
  {
    href: "/teacher/teams",
    emoji: "🤝",
    label: "Teams",
    gradient: "linear-gradient(135deg, #3B82F6, #60A5FA)",
    shadow: "rgba(59,130,246,0.35)",
    summary: "Create teams, drag students in and out, and manage team names for collaborative sessions.",
  },
  {
    href: "/teacher/reflections",
    emoji: "📝",
    label: "Student Reflections",
    gradient: "linear-gradient(135deg, #EC4899, #F472B6)",
    shadow: "rgba(236,72,153,0.35)",
    summary: "View written reflections, video and audio submissions, and links to each student's brand project.",
  },
  {
    href: "/teacher/sessions",
    emoji: "📅",
    label: "Sessions",
    gradient: "linear-gradient(135deg, #10B981, #34D399)",
    shadow: "rgba(16,185,129,0.35)",
    summary: "Lock or unlock sessions to control what students can access at each stage of the program.",
  },
]

export default function NavCards() {
  const [flipped, setFlipped] = useState<string | null>(null)
  const router = useRouter()

  function handleClick(card: typeof NAV_CARDS[number]) {
    setFlipped(card.label)
    setTimeout(() => {
      router.push(card.href)
    }, 500)
  }

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {NAV_CARDS.map((card) => {
        const isFlipped = flipped === card.label
        return (
          <div
            key={card.label}
            className="relative cursor-pointer"
            style={{ minHeight: "140px", perspective: "1000px" }}
            onClick={() => handleClick(card)}
          >
            <div
              className="relative w-full transition-transform duration-500"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                minHeight: "140px",
              }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 rounded-3xl p-8 flex flex-col justify-between overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  background: card.gradient,
                  boxShadow: `0 10px 24px -4px ${card.shadow}`,
                  border: "2px solid #1E293B",
                  minHeight: "140px",
                }}
              >
                <div className="absolute -right-4 -bottom-4 text-8xl opacity-20 select-none">{card.emoji}</div>
                <div className="text-3xl relative">{card.emoji}</div>
                <div className="text-base font-black mt-4 relative text-white">{card.label}</div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 rounded-3xl p-5 flex flex-col justify-center gap-2"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "white",
                  border: "2px solid #1E293B",
                  boxShadow: `0 10px 24px -4px ${card.shadow}`,
                  minHeight: "140px",
                }}
              >
                <div className="text-base font-black" style={{ color: "#1E293B" }}>{card.label}</div>
                <p className="text-sm font-bold leading-relaxed" style={{ color: "#64748B" }}>{card.summary}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
