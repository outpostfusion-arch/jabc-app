"use client"
import { useState, useCallback } from "react"
import { RobotSVG } from "./RobotSVG"
import { STEPS } from "./parts"
import { COLOR_SCHEMES, getScheme } from "./schemes"
import { DEFAULT_CONFIG } from "./types"
import type { RobotConfig } from "./types"

interface Props {
  initialConfig?: Partial<RobotConfig>
  onSave: (config: RobotConfig) => Promise<void>
}

export function RobotBuilderUI({ initialConfig, onSave }: Props) {
  const [config, setConfig] = useState<RobotConfig>({ ...DEFAULT_CONFIG, ...initialConfig })
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [dancing, setDancing] = useState(false)
  const [showColor, setShowColor] = useState(false)

  const scheme = getScheme(config.colorScheme)
  const currentStep = STEPS[step]
  const isLastStep = step === STEPS.length - 1

  function setPart(key: keyof RobotConfig, value: string) {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const dance = useCallback(() => {
    if (dancing) return
    setDancing(true)
    setTimeout(() => setDancing(false), 1100)
  }, [dancing])

  async function handleSave() {
    if (saving) return
    setSaving(true)
    try { await onSave(config) } finally { setSaving(false) }
  }

  const progressPct = ((step + 1) / STEPS.length) * 100

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", background: "#0F172A",
      fontFamily: "'Nunito', system-ui, sans-serif",
    }}>

      {/* ── LEFT: Robot preview ─────────────────────────────────────────── */}
      <div style={{
        flex: "0 0 42%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "32px 24px", gap: 20,
        borderRight: "1px solid rgba(255,255,255,0.07)",
        position: "relative", overflow: "hidden",
      }}>
        {/* colour glow behind robot */}
        <div style={{
          position: "absolute", width: 340, height: 340, borderRadius: "50%",
          background: `radial-gradient(circle, ${scheme.primary}44 0%, transparent 68%)`,
          pointerEvents: "none",
        }} />

        {/* Robot — click to dance */}
        <button
          onClick={dance}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            filter: `drop-shadow(0 12px 28px ${scheme.primary}66)`,
            transition: "filter 0.3s",
          }}
          title="Click to dance!"
        >
          <RobotSVG config={config} size={190} animate={!dancing} dancing={dancing} />
        </button>

        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 700, margin: 0 }}>
          👆 Tap to dance
        </p>

        {/* Active-step label */}
        <div style={{
          background: "rgba(255,255,255,0.05)", borderRadius: 14,
          padding: "10px 22px", textAlign: "center",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 800, letterSpacing: 1.5, marginBottom: 3 }}>
            NOW BUILDING
          </div>
          <div style={{ color: "white", fontSize: 17, fontWeight: 900 }}>
            {currentStep.emoji} {currentStep.label}
          </div>
        </div>

        {/* Colour pill in corner */}
        <button
          onClick={() => setShowColor(v => !v)}
          style={{
            position: "absolute", bottom: 20, right: 20,
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 16px", borderRadius: 24,
            background: `${scheme.primary}33`,
            border: `1px solid ${scheme.primary}66`,
            cursor: "pointer", color: "white",
            fontSize: 12, fontWeight: 800,
          }}
        >
          <span style={{ width: 14, height: 14, borderRadius: "50%", background: scheme.primary, display: "inline-block" }} />
          {scheme.name}
          <span style={{ opacity: 0.6 }}>🎨</span>
        </button>

        {/* Inline colour picker dropdown */}
        {showColor && (
          <div style={{
            position: "absolute", bottom: 60, right: 20, zIndex: 10,
            background: "#1E293B", borderRadius: 16, padding: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: 200,
          }}>
            {COLOR_SCHEMES.map(s => (
              <button
                key={s.id}
                onClick={() => { setPart("colorScheme", s.id); setShowColor(false) }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 10px", borderRadius: 10, cursor: "pointer",
                  background: config.colorScheme === s.id ? `${s.primary}33` : "rgba(255,255,255,0.04)",
                  border: config.colorScheme === s.id ? `1.5px solid ${s.primary}` : "1.5px solid transparent",
                  color: "white", fontSize: 12, fontWeight: 800,
                }}
              >
                <span style={{ width: 14, height: 14, borderRadius: "50%", background: s.primary, flexShrink: 0 }} />
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT: Builder panel ─────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Step pills */}
        <div style={{
          display: "flex", gap: 6, padding: "18px 24px 0",
          overflowX: "auto", flexShrink: 0,
          scrollbarWidth: "none",
        }}>
          {STEPS.map((s, i) => {
            const done = i < step
            const active = i === step
            return (
              <button
                key={s.key}
                onClick={() => setStep(i)}
                style={{
                  flexShrink: 0, padding: "5px 14px", borderRadius: 20, border: "none",
                  cursor: "pointer", fontSize: 12, fontWeight: 800, transition: "all 0.18s",
                  background: active ? scheme.primary : done ? `${scheme.primary}33` : "rgba(255,255,255,0.06)",
                  color: active ? "white" : done ? scheme.accent : "rgba(255,255,255,0.28)",
                  boxShadow: active ? `0 4px 14px ${scheme.primary}55` : "none",
                }}
              >
                {done ? "✓ " : ""}{s.emoji} {s.label}
              </button>
            )
          })}
        </div>

        {/* Part grid */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          <h2 style={{ color: "white", fontSize: 20, fontWeight: 900, marginBottom: 4, marginTop: 0 }}>
            {currentStep.emoji} Pick a {currentStep.label}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, fontWeight: 700, marginBottom: 18, marginTop: 0 }}>
            Click a style — your robot updates live on the left.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 10,
          }}>
            {currentStep.parts.map(part => {
              const selected = config[currentStep.key] === part.id
              return (
                <button
                  key={part.id}
                  onClick={() => setPart(currentStep.key, part.id)}
                  style={{
                    padding: "12px 8px", borderRadius: 14, cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    transition: "all 0.15s",
                    background: selected ? `${scheme.primary}25` : "rgba(255,255,255,0.04)",
                    border: selected ? `2px solid ${scheme.primary}` : "2px solid rgba(255,255,255,0.07)",
                    transform: selected ? "scale(1.04)" : "scale(1)",
                    boxShadow: selected ? `0 4px 16px ${scheme.primary}44` : "none",
                  }}
                >
                  {/* Mini part preview */}
                  <div style={{
                    width: 80, height: 80, borderRadius: 10,
                    background: "rgba(0,0,0,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden",
                  }}>
                    <svg viewBox="0 0 200 400" width={60} height={60}>
                      {part.render({
                        primary: selected ? scheme.primary : "rgba(255,255,255,0.45)",
                        accent:  selected ? scheme.accent  : "rgba(255,255,255,0.28)",
                      })}
                    </svg>
                  </div>

                  <span style={{ color: selected ? "white" : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 800 }}>
                    {part.name}
                  </span>

                  {selected && (
                    <span style={{ color: scheme.primary, fontSize: 10, fontWeight: 900 }}>✓ Selected</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          padding: "14px 24px", flexShrink: 0,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                padding: "11px 22px", borderRadius: 12,
                border: "2px solid rgba(255,255,255,0.12)",
                background: "transparent", color: "white",
                fontWeight: 800, fontSize: 13, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {/* Progress bar */}
          <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 5 }}>
            <div style={{
              height: "100%", borderRadius: 5,
              background: `linear-gradient(90deg, ${scheme.primary}, ${scheme.accent})`,
              width: `${progressPct}%`, transition: "width 0.35s ease",
            }} />
          </div>

          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
            {step + 1} / {STEPS.length}
          </span>

          {isLastStep ? (
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "12px 28px", borderRadius: 12, border: "none",
                background: `linear-gradient(135deg, ${scheme.primary}, ${scheme.accent})`,
                color: "white", fontWeight: 900, fontSize: 15, cursor: "pointer",
                boxShadow: `0 4px 20px ${scheme.primary}66`,
                fontFamily: "inherit",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving…" : "Build My Robot! 🚀"}
            </button>
          ) : (
            <button
              onClick={() => setStep(s => s + 1)}
              style={{
                padding: "12px 28px", borderRadius: 12, border: "none",
                background: `linear-gradient(135deg, ${scheme.primary}, ${scheme.accent})`,
                color: "white", fontWeight: 900, fontSize: 15, cursor: "pointer",
                boxShadow: `0 4px 20px ${scheme.primary}66`,
                fontFamily: "inherit",
              }}
            >
              Next: {STEPS[step + 1]?.label} {STEPS[step + 1]?.emoji} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
