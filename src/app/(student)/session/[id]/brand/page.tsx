"use client"

import { useState, useRef, useEffect } from "react"
import LogoBuilder from "@/components/brand/LogoBuilder"
import BrandNameHelper from "@/components/brand/BrandNameHelper"

const COLORS = ["#6366F1", "#F43F5E", "#FBBF24", "#22C55E", "#06B6D4", "#8B5CF6", "#EC4899", "#F97316"]
const PITCH_PROMPTS = [
  { key: "who", label: "Who are you?", placeholder: "We are a student-run business called..." },
  { key: "what", label: "What do you sell?", placeholder: "We make and sell..." },
  { key: "why", label: "Why should people care?", placeholder: "Our product is perfect for you because..." },
  { key: "cta", label: "Your call to action", placeholder: "Visit us at... / Find us at the school fair on..." },
]

interface BrandData {
  brandName: string
  tagline: string
  colorPalette: string[]
  salesPitch: string
  pitchParts: Record<string, string>
}

export default function BrandPage() {
  const [brand, setBrand] = useState<BrandData>({
    brandName: "",
    tagline: "",
    colorPalette: [],
    salesPitch: "",
    pitchParts: {},
  })
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null)
  const [badge, setBadge] = useState<{ name: string; emoji: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<"logo" | "brand" | "pitch">("logo")
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch("/api/brand").then((r) => r.json()).then((data) => {
      if (data) {
        setBrand((prev) => ({
          ...prev,
          brandName: data.brandName ?? "",
          tagline: data.tagline ?? "",
          colorPalette: data.colorPalette ?? [],
          salesPitch: data.salesPitch ?? "",
        }))
      }
    })
    fetch("/api/logo").then((r) => r.json()).then((data) => {
      if (data?.pngDataUrl) setLogoDataUrl(data.pngDataUrl)
    })
  }, [])

  function updateBrand(field: string, value: string | string[]) {
    const updated = { ...brand, [field]: value }
    setBrand(updated)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      const res = await fetch("/api/brand", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName: updated.brandName, tagline: updated.tagline, colorPalette: updated.colorPalette, salesPitch: updated.salesPitch }),
      })
      const json = await res.json()
      if (json.badge) setBadge(json.badge)
      setSaving(false)
    }, 600)
  }

  function updatePitchPart(key: string, value: string) {
    const parts = { ...brand.pitchParts, [key]: value }
    const fullPitch = PITCH_PROMPTS.map((p) => parts[p.key] ?? "").filter(Boolean).join(" ")
    const updated = { ...brand, pitchParts: parts, salesPitch: fullPitch }
    setBrand(updated)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      await fetch("/api/brand", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName: updated.brandName, tagline: updated.tagline, colorPalette: updated.colorPalette, salesPitch: fullPitch }),
      })
    }, 600)
  }

  function toggleColor(color: string) {
    const current = brand.colorPalette
    const next = current.includes(color) ? current.filter((c) => c !== color) : [...current.slice(0, 2), color]
    updateBrand("colorPalette", next)
  }

  async function exportPdf() {
    const { pdf, Document, Page, Text, View, Image, StyleSheet } = await import("@react-pdf/renderer")

    const styles = StyleSheet.create({
      page: { padding: 40, fontFamily: "Helvetica" },
      title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
      subtitle: { fontSize: 14, color: "#64748B", marginBottom: 24 },
      section: { marginBottom: 20 },
      sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#6366F1" },
      text: { fontSize: 12, color: "#1E293B", lineHeight: 1.5 },
      colors: { flexDirection: "row", gap: 8, marginTop: 4 },
      colorSwatch: { width: 24, height: 24, borderRadius: 12 },
    })

    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            {logoDataUrl && <Image src={logoDataUrl} style={{ width: 100, height: 100, marginBottom: 12 }} />}
            <Text style={styles.title}>{brand.brandName || "My Business"}</Text>
            <Text style={styles.subtitle}>{brand.tagline}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Brand Colors</Text>
            <View style={styles.colors}>
              {brand.colorPalette.map((c) => (
                <View key={c} style={[styles.colorSwatch, { backgroundColor: c }]} />
              ))}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Sales Pitch</Text>
            <Text style={styles.text}>{brand.salesPitch}</Text>
          </View>
        </Page>
      </Document>
    )

    const blob = await pdf(doc).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${brand.brandName || "business"}-plan.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm font-bold mb-2" style={{ color: "#EC4899" }}>
          <span>🎨</span> Session 6
        </div>
        <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>Brand & Final Pitch</h1>
        <p className="mt-1 font-semibold" style={{ color: "#64748B" }}>
          Design your logo, name your brand, choose your colours, and craft your sales pitch!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["logo", "brand", "pitch"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all" style={{ background: tab === t ? "#6366F1" : "white", color: tab === t ? "white" : "#475569", border: `2px solid ${tab === t ? "#6366F1" : "#E2E8F0"}` }}>
            {t === "logo" && "🎨 Logo Builder"}
            {t === "brand" && "✏️ Brand Profile"}
            {t === "pitch" && "🎤 Sales Pitch"}
          </button>
        ))}
        <button onClick={exportPdf} className="ml-auto px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "#22C55E" }}>
          ⬇ Export Business Plan PDF
        </button>
      </div>

      {tab === "logo" && (
        <div className="space-y-4">
          <div className="rounded-3xl border p-5" style={{ background: "white", borderColor: "#E2E8F0" }}>
            <h3 className="font-black text-lg mb-4" style={{ color: "#1E293B" }}>🎨 Logo Builder</h3>
            <p className="text-sm mb-4 font-medium" style={{ color: "#64748B" }}>Add text, shapes, and emojis to design your logo. Changes save automatically!</p>
            <LogoBuilder onExport={(url) => setLogoDataUrl(url)} />
          </div>
        </div>
      )}

      {tab === "brand" && (
        <div className="space-y-4">
          <BrandNameHelper onSelect={(name) => updateBrand("brandName", name)} />

          <div className="rounded-3xl border p-5" style={{ background: "white", borderColor: "#E2E8F0" }}>
            <h3 className="font-black text-lg mb-4" style={{ color: "#1E293B" }}>✏️ Brand Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>Brand Name</label>
                <input value={brand.brandName} onChange={(e) => updateBrand("brandName", e.target.value)} placeholder="What is your business called?" className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none" style={{ borderColor: "#E2E8F0", color: "#1E293B" }} />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>Tagline</label>
                <input value={brand.tagline} onChange={(e) => updateBrand("tagline", e.target.value)} placeholder="A short, catchy slogan (e.g. 'Fidget your stress away!')" className="w-full px-4 py-3 rounded-xl border-2 font-medium focus:outline-none" style={{ borderColor: "#E2E8F0", color: "#1E293B" }} />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wide mb-2" style={{ color: "#94A3B8" }}>Brand Colors (pick up to 3)</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => toggleColor(c)} className="w-10 h-10 rounded-full border-4 transition-all" style={{ background: c, borderColor: brand.colorPalette.includes(c) ? "#1E293B" : "transparent" }} />
                  ))}
                </div>
                {brand.colorPalette.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: "#94A3B8" }}>Selected:</span>
                    {brand.colorPalette.map((c) => (
                      <div key={c} className="w-6 h-6 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
            {saving && <div className="mt-2 text-xs font-bold" style={{ color: "#94A3B8" }}>Saving...</div>}
          </div>
        </div>
      )}

      {tab === "pitch" && (
        <div className="space-y-4">
          <div className="rounded-3xl border p-5" style={{ background: "white", borderColor: "#E2E8F0" }}>
            <h3 className="font-black text-lg mb-1" style={{ color: "#1E293B" }}>🎤 Sales Pitch Builder</h3>
            <p className="text-sm mb-5 font-medium" style={{ color: "#64748B" }}>Answer each question to build your pitch step by step.</p>
            <div className="space-y-4">
              {PITCH_PROMPTS.map((p) => (
                <div key={p.key}>
                  <label className="block text-sm font-black mb-1" style={{ color: "#475569" }}>{p.label}</label>
                  <textarea value={brand.pitchParts[p.key] ?? ""} onChange={(e) => updatePitchPart(p.key, e.target.value)} placeholder={p.placeholder} rows={2} className="w-full px-4 py-3 rounded-xl border-2 text-sm font-medium resize-none focus:outline-none" style={{ borderColor: "#E2E8F0", color: "#1E293B" }} />
                </div>
              ))}
            </div>
          </div>

          {brand.salesPitch && (
            <div className="rounded-3xl p-6 text-center" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
              <div className="text-4xl mb-3">
                {logoDataUrl ? <img src={logoDataUrl} alt="logo" className="w-16 h-16 mx-auto rounded-xl" /> : "🏆"}
              </div>
              <div className="text-2xl font-black text-white mb-1">{brand.brandName || "My Brand"}</div>
              <div className="text-white/80 font-semibold mb-4">{brand.tagline}</div>
              <div className="text-white font-medium leading-relaxed max-w-sm mx-auto">{brand.salesPitch}</div>
              {brand.colorPalette.length > 0 && (
                <div className="flex justify-center gap-2 mt-4">
                  {brand.colorPalette.map((c) => (
                    <div key={c} className="w-5 h-5 rounded-full border-2 border-white/50" style={{ background: c }} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {badge && (
        <div className="fixed bottom-6 right-6 z-50 p-5 rounded-3xl shadow-2xl" style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}>
          <div className="text-4xl text-center mb-2">{badge.emoji}</div>
          <div className="text-white font-black text-center">Badge Earned!</div>
          <div className="text-white/80 text-center font-semibold mt-1">{badge.name}</div>
          <button onClick={() => setBadge(null)} className="mt-3 w-full text-center text-sm text-white/60 font-bold">Dismiss</button>
        </div>
      )}
    </div>
  )
}
