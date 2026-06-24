"use client"

import { useState } from "react"
import Link from "next/link"

interface MakerCardProps {
  title: string
  tagline: string
  icon: React.ReactNode
  gradient: string
  shadow: string
  href: string
  locked?: boolean
}

export default function MakerCard({ title, tagline, icon, gradient, shadow, href, locked = false }: MakerCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div style={{ perspective: "1200px" }} className="w-full">
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "440px",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: gradient,
            boxShadow: `0 20px 40px -8px ${shadow}`,
            border: "2px solid rgba(255,255,255,0.15)",
          }}
        >
          {/* Top area */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 pt-8">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-5"
              style={{ background: "rgba(255,255,255,0.2)", fontSize: 48 }}
            >
              {icon}
            </div>
            <h2 className="text-2xl font-black text-white text-center leading-tight">{title}</h2>
            <p className="mt-2 text-sm font-semibold text-center" style={{ color: "rgba(255,255,255,0.75)" }}>
              {tagline}
            </p>
          </div>

          {/* Bottom actions */}
          <div className="p-6 flex flex-col gap-3">
            {locked ? (
              <Link
                href="/choose-robot"
                className="w-full py-3 rounded-2xl text-sm font-black text-center transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                style={{ background: "white", color: "#1E293B" }}
              >
                🔒 Choose a Robot First
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setFlipped(true)}
                  className="w-full py-3 rounded-2xl text-sm font-black transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "2px solid rgba(255,255,255,0.35)" }}
                >
                  What&apos;s inside? 👀
                </button>
                <Link
                  href={href}
                  className="w-full py-3 rounded-2xl text-sm font-black text-center transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "white", color: "#1E293B" }}
                >
                  Start Session →
                </Link>
              </>
            )}
          </div>

          {/* Lock overlay */}
          {locked && (
            <div
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
            >
              🔒
            </div>
          )}
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "white",
            boxShadow: `0 20px 40px -8px ${shadow}`,
            border: "2px solid #E2E8F0",
          }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ background: gradient }}
          >
            <span className="font-black text-white text-sm">{title}</span>
            <button
              onClick={() => setFlipped(false)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.25)", color: "white" }}
            >
              ← Back
            </button>
          </div>

          {/* Contents placeholder */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-3">
            <div className="text-4xl">🚧</div>
            <p className="text-sm font-bold text-center" style={{ color: "#94A3B8" }}>
              Coming soon — check back later!
            </p>
          </div>

          <div className="p-6">
            <Link
              href={href}
              className="w-full py-3 rounded-2xl text-sm font-black text-center block transition-all hover:opacity-90 active:scale-95 text-white"
              style={{ background: gradient }}
            >
              Start Session →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
