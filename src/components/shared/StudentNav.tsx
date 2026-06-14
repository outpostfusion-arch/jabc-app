"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import AvatarImage from "@/components/shared/AvatarImage"

interface Props {
  displayName: string
  avatarEmoji: string
  points: number
}

export default function StudentNav({ displayName, avatarEmoji, points }: Props) {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b shadow-sm" style={{ background: "white", borderColor: "#E2E8F0" }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-black text-xl" style={{ color: "#6366F1" }}>
          <span className="text-2xl">🚀</span>
          <span className="hidden sm:block">JABC</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="px-3 py-2 rounded-xl text-sm font-bold transition-colors"
            style={{ color: pathname === "/dashboard" ? "#6366F1" : "#64748B", background: pathname === "/dashboard" ? "#EEF2FF" : "transparent" }}
          >
            Sessions
          </Link>
          <Link
            href="/progress"
            className="px-3 py-2 rounded-xl text-sm font-bold transition-colors"
            style={{ color: pathname === "/progress" ? "#6366F1" : "#64748B", background: pathname === "/progress" ? "#EEF2FF" : "transparent" }}
          >
            My Progress
          </Link>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3">
          {/* Points */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: "#FEF3C7", color: "#D97706" }}>
            <span>⭐</span>
            <span>{points} pts</span>
          </div>

          {/* Avatar + name */}
          <div className="flex items-center gap-2">
            <AvatarImage avatarId={avatarEmoji} size={36} />
            <span className="hidden sm:block text-sm font-bold" style={{ color: "#1E293B" }}>{displayName}</span>
          </div>

          {/* Sign out */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm font-bold px-3 py-1.5 rounded-xl transition-colors"
            style={{ color: "#94A3B8" }}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}
