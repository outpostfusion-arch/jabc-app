"use client"

import { signOut } from "next-auth/react"

export default function TeacherHeaderControls() {
  function switchToStudent() {
    document.cookie = "jabc-view-mode=student; path=/; max-age=86400"
    window.location.href = "/dashboard"
  }

  return (
    <div className="flex flex-col items-end gap-2 relative z-10">
      {/* Toggle */}
      <div className="flex items-center p-1 rounded-2xl" style={{ background: "rgba(255,255,255,0.15)" }}>
        <div className="px-4 py-2 rounded-xl text-sm font-bold" style={{ background: "white", color: "#6366F1" }}>
          Teacher
        </div>
        <button
          onClick={switchToStudent}
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          Student
        </button>
      </div>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-sm font-bold px-5 py-2 rounded-xl transition-all hover:bg-white/10"
        style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
      >
        👋 Sign Out
      </button>
    </div>
  )
}
