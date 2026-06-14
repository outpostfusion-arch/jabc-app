"use client"

import { useState } from "react"

interface BlockConfig {
  key: string
  label: string
  hint: string
  emoji: string
  color: string
  border: string
  shadow: string
}

interface Props {
  config: BlockConfig
  items: string[]
  onChange: (items: string[]) => void
  example: string[]
  demo: string[]
  teacherMode?: boolean
  readOnly?: boolean
}

export default function BMCBlock({ config, items, onChange, example, demo, teacherMode = false, readOnly = false }: Props) {
  const [input, setInput] = useState("")
  const [flipped, setFlipped] = useState(false)
  const [demoIndex, setDemoIndex] = useState(0)

  function addItem() {
    const trimmed = input.trim()
    if (!trimmed) return
    onChange([...items, trimmed])
    setInput("")
  }

  function removeItem(idx: number) {
    onChange(items.filter((_, i) => i !== idx))
  }

  function addDemoPoint() {
    if (demoIndex >= demo.length) return
    onChange([...items, demo[demoIndex]])
    setDemoIndex(demoIndex + 1)
  }

  const demoRemaining = demo.length - demoIndex

  return (
    <div style={{ perspective: "1000px" }}>
      <div
        style={{
          display: "grid",
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── FRONT ── */}
        <div
          className="rounded-2xl p-4 flex flex-col"
          style={{
            gridArea: "1/1",
            background: config.color,
            border: `2px solid ${config.border}`,
            boxShadow: `0 6px 24px ${config.shadow}`,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden" as React.CSSProperties["WebkitBackfaceVisibility"],
            minHeight: "210px",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{config.emoji}</span>
              <span className="text-xs font-black uppercase tracking-wide" style={{ color: "#1E293B" }}>{config.label}</span>
            </div>
            <div className="flex items-center gap-1">
              {teacherMode && demoRemaining > 0 && (
                <button
                  onClick={addDemoPoint}
                  title={`Add demo point (${demoRemaining} left)`}
                  className="px-2 py-1 rounded-lg text-xs font-bold transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.75)", color: "#6366F1" }}
                >
                  ✏️
                </button>
              )}
              <button
                onClick={() => setFlipped(true)}
                title="See lemonade stand example"
                className="px-2 py-1 rounded-lg text-xs font-bold transition-all hover:scale-110"
                style={{ background: "rgba(255,255,255,0.75)", color: "#F59E0B" }}
              >
                💡
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="flex flex-wrap gap-1.5 flex-1 mb-2">
            {items.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.85)", color: "#1E293B" }}
              >
                {item}
                {!readOnly && (
                  <button onClick={() => removeItem(idx)} className="ml-0.5 opacity-50 hover:opacity-100 text-xs">×</button>
                )}
              </span>
            ))}
            {items.length === 0 && (
              <span className="text-xs italic" style={{ color: "#64748B" }}>No ideas yet…</span>
            )}
          </div>

          {/* Add input */}
          {!readOnly && (
            <div className="flex gap-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addItem() }}
                placeholder={config.hint.split("(")[0].trim() + "…"}
                className="flex-1 px-2.5 py-1.5 rounded-xl border text-xs font-medium focus:outline-none"
                style={{ borderColor: config.border, color: "#1E293B", background: "rgba(255,255,255,0.9)" }}
              />
              <button onClick={addItem} className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-white" style={{ background: config.border }}>Add</button>
            </div>
          )}
        </div>

        {/* ── BACK ── */}
        <div
          className="rounded-2xl p-4 flex flex-col"
          style={{
            gridArea: "1/1",
            minHeight: "210px",
            background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
            border: "2px solid #FBBF24",
            boxShadow: "0 6px 24px rgba(251,191,36,0.25)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden" as React.CSSProperties["WebkitBackfaceVisibility"],
            transform: "rotateY(180deg)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🍋</span>
              <span className="text-xs font-black uppercase tracking-wide" style={{ color: "#92400E" }}>Lemonade Stand</span>
            </div>
            <button
              onClick={() => setFlipped(false)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.8)", color: "#92400E" }}
            >
              ↩ Flip back
            </button>
          </div>

          {/* Example items */}
          <div className="flex flex-wrap gap-1.5 flex-1 mb-3">
            {example.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.85)", color: "#78350F" }}
              >
                {item}
              </span>
            ))}
          </div>

          <p className="text-xs font-medium italic" style={{ color: "#B45309" }}>
            {config.hint}
          </p>
        </div>
      </div>
    </div>
  )
}
