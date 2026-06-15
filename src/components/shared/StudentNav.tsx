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

const NAV_LINKS = [
  { href: "/dashboard",           label: "Sessions",    shortLabel: "Sessions"  },
  { href: "/progress",            label: "My Progress", shortLabel: "Progress"  },
  { href: "/reflection",          label: "Reflection",  shortLabel: "Reflect"   },
  { href: "/reflection-gallery",  label: "Gallery ⭐",  shortLabel: "Gallery"   },
]

export default function StudentNav({ displayName, avatarEmoji, points }: Props) {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b shadow-sm" style={{ background: "white", borderColor: "#E2E8F0" }}>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-1.5 font-black text-lg sm:text-xl flex-shrink-0" style={{ color: "#6366F1" }}>
          <span className="text-xl sm:text-2xl">🚀</span>
          <span className="hidden sm:block">JABC</span>
        </Link>

        {/* Nav links — scrollable on mobile */}
        <div
          className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto flex-1 mx-1 sm:mx-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors flex-shrink-0"
                style={{
                  color: isActive ? "#6366F1" : "#64748B",
                  background: isActive ? "#EEF2FF" : "transparent",
                }}
              >
                <span className="sm:hidden">{link.shortLabel}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            )
          })}
        </div>

        {/* User info */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Points — hidden on very small */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold" style={{ background: "#FEF3C7", color: "#D97706" }}>
            ⭐ {points}
          </div>

          {/* Avatar */}
          <AvatarImage avatarId={avatarEmoji} size={32} />
          <span className="hidden md:block text-sm font-bold" style={{ color: "#1E293B" }}>{displayName}</span>

          {/* Sign out */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs sm:text-sm font-bold px-2 sm:px-3 py-1.5 rounded-xl transition-colors"
            style={{ color: "#94A3B8" }}
          >
            <span className="hidden sm:inline">Sign out</span>
            <span className="sm:hidden">👋</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
