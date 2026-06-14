"use client"

import { useRouter, usePathname } from "next/navigation"

export default function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === "/teacher/dashboard") return null

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1.5 mb-4 text-sm font-bold px-4 py-2 rounded-xl transition-all hover:opacity-80"
      style={{ background: "white", color: "#64748B", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #E2E8F0" }}
    >
      ← Back
    </button>
  )
}
