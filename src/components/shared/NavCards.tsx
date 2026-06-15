"use client"

import Link from "next/link"

const NAV_CARDS = [
  {
    href: "#progress",
    emoji: "👥",
    label: "Students",
    gradient: "linear-gradient(135deg, #6366F1, #818CF8)",
    shadow: "rgba(99,102,241,0.35)",
    summary: "Track session progress, badges and team assignments",
  },
  {
    href: "/teacher/teams",
    emoji: "🤝",
    label: "Teams",
    gradient: "linear-gradient(135deg, #3B82F6, #60A5FA)",
    shadow: "rgba(59,130,246,0.35)",
    summary: "Create teams and drag students in to collaborate",
  },
  {
    href: "/teacher/reflections",
    emoji: "📝",
    label: "Student Reflections",
    gradient: "linear-gradient(135deg, #EC4899, #F472B6)",
    shadow: "rgba(236,72,153,0.35)",
    summary: "View written reflections and media submissions",
  },
  {
    href: "/teacher/sessions",
    emoji: "📅",
    label: "Sessions",
    gradient: "linear-gradient(135deg, #10B981, #34D399)",
    shadow: "rgba(16,185,129,0.35)",
    summary: "Lock or unlock sessions for students",
  },
]

export default function NavCards() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {NAV_CARDS.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className="rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between transition-all hover:scale-105 hover:opacity-90"
          style={{
            background: card.gradient,
            boxShadow: `0 10px 24px -4px ${card.shadow}`,
            border: "2px solid #1E293B",
            minHeight: "140px",
          }}
        >
          <div className="absolute -right-4 -bottom-4 text-8xl opacity-20 select-none">{card.emoji}</div>
          <div className="text-3xl relative">{card.emoji}</div>
          <div className="relative mt-2">
            <div className="text-base font-black text-white">{card.label}</div>
            <div className="text-xs font-semibold mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>{card.summary}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
