"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const navItems = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/teacher/students", label: "Students", icon: "👥" },
  { href: "/teacher/teams", label: "Teams", icon: "🤝" },
  { href: "/teacher/videos", label: "Videos", icon: "🎬" },
  { href: "/teacher/sessions", label: "Sessions", icon: "📅" },
]

export default function TeacherSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r flex flex-col" style={{ background: "white", borderColor: "#E2E8F0" }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center gap-2">
          <span className="text-3xl">🚀</span>
          <div>
            <div className="font-black text-lg" style={{ color: "#6366F1" }}>JABC</div>
            <div className="text-xs font-bold" style={{ color: "#94A3B8" }}>Teacher Dashboard</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/teacher/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all"
              style={{
                background: isActive ? "#EEF2FF" : "transparent",
                color: isActive ? "#6366F1" : "#64748B",
              }}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t" style={{ borderColor: "#E2E8F0" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all"
          style={{ color: "#94A3B8" }}
        >
          <span>👋</span> Sign Out
        </button>
      </div>
    </aside>
  )
}
