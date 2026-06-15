"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface Brand {
  brandName: string
  tagline: string
}

const QUESTIONS = [
  { key: "whatLearned",  label: "What did you learn from this program?",        placeholder: "Share your key takeaways from JABC..." },
  { key: "proudOf",     label: "What are you most proud of?",                   placeholder: "What did you accomplish that you're really proud of?" },
  { key: "challenges",  label: "What was your biggest challenge?",              placeholder: "What was hard? How did you handle it?" },
  { key: "nextSteps",   label: "What would you do differently next time?",      placeholder: "Looking back, what would you change or try?" },
] as const

type QuestionKey = typeof QUESTIONS[number]["key"]

export default function ReflectionPage() {
  const [answers, setAnswers] = useState<Record<QuestionKey, string>>({
    whatLearned: "",
    proudOf: "",
    challenges: "",
    nextSteps: "",
  })
  const [mediaUrl, setMediaUrl] = useState("")
  const [mediaType, setMediaType] = useState("")
  const [mediaTab, setMediaTab] = useState<"upload" | "link">("upload")
  const [linkInput, setLinkInput] = useState("")
  const [brand, setBrand] = useState<Brand | null>(null)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/reflections/me")
      .then((r) => r.json())
      .then(({ reflection, brand: b }) => {
        if (reflection) {
          setAnswers({
            whatLearned: reflection.whatLearned ?? "",
            proudOf: reflection.proudOf ?? "",
            challenges: reflection.challenges ?? "",
            nextSteps: reflection.nextSteps ?? "",
          })
          setMediaUrl(reflection.mediaUrl ?? "")
          setMediaType(reflection.mediaType ?? "")
          if (reflection.mediaType === "link") {
            setMediaTab("link")
            setLinkInput(reflection.mediaUrl ?? "")
          }
        }
        if (b?.brandName) setBrand(b)
      })
      .catch(() => {})
  }, [])

  async function save() {
    setSaveStatus("saving")
    try {
      const res = await fetch("/api/reflections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, mediaUrl, mediaType }),
      })
      if (!res.ok) throw new Error()
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2500)
    } catch {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 2500)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/reflections/upload", { method: "POST", body: fd })
      const { url } = await res.json()
      setMediaUrl(url)
      setMediaType(file.type.startsWith("video") ? "video-upload" : "audio-upload")
    } finally {
      setUploading(false)
    }
  }

  function handleLinkChange(v: string) {
    setLinkInput(v)
    setMediaUrl(v)
    setMediaType("link")
  }

  const saveLabel =
    saveStatus === "saving" ? "Saving..." :
    saveStatus === "saved"  ? "✓ Saved!" :
    saveStatus === "error"  ? "Error — try again" :
    "Save Reflection"

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div
        className="rounded-3xl p-8 mb-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
          boxShadow: "0 16px 32px -8px rgba(99,102,241,0.4)",
        }}
      >
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        <h1 className="text-3xl font-black text-white relative">My Reflection 📝</h1>
        <p className="mt-1 font-semibold relative" style={{ color: "rgba(255,255,255,0.75)" }}>
          Share what you learned and experienced in the JABC program
        </p>
      </div>

      <div className="space-y-5">
        {/* Text questions */}
        {QUESTIONS.map(({ key, label, placeholder }) => (
          <div
            key={key}
            className="bg-white rounded-3xl p-6"
            style={{ boxShadow: "0 4px 16px -4px rgba(0,0,0,0.08)", border: "1px solid #F1F5F9" }}
          >
            <label className="block text-sm font-black mb-3" style={{ color: "#1E293B" }}>{label}</label>
            <textarea
              value={answers[key]}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={placeholder}
              rows={3}
              className="w-full rounded-2xl px-4 py-3 text-sm resize-none outline-none transition-all"
              style={{ background: "#F8FAFC", border: "2px solid #E2E8F0", color: "#334155" }}
              onFocus={(e) => { e.target.style.borderColor = "#6366F1" }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0" }}
            />
          </div>
        ))}

        {/* Media section */}
        <div
          className="bg-white rounded-3xl p-6"
          style={{ boxShadow: "0 4px 16px -4px rgba(0,0,0,0.08)", border: "1px solid #F1F5F9" }}
        >
          <div className="text-sm font-black mb-4" style={{ color: "#1E293B" }}>Media Reflection (Optional)</div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMediaTab("upload")}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{ background: mediaTab === "upload" ? "#6366F1" : "#F1F5F9", color: mediaTab === "upload" ? "white" : "#64748B" }}
            >
              📤 Upload Video / Audio
            </button>
            <button
              onClick={() => setMediaTab("link")}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{ background: mediaTab === "link" ? "#6366F1" : "#F1F5F9", color: mediaTab === "link" ? "white" : "#64748B" }}
            >
              🔗 Paste a Link
            </button>
          </div>

          {mediaTab === "upload" ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,audio/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 rounded-2xl text-sm font-bold border-2 border-dashed transition-all hover:opacity-80"
                style={{ borderColor: "#6366F1", color: "#6366F1", background: "#F5F3FF" }}
              >
                {uploading
                  ? "Uploading..."
                  : mediaUrl && mediaType !== "link"
                  ? "✓ File uploaded — click to replace"
                  : "Click to upload a video or audio file"}
              </button>
              {mediaUrl && mediaType === "video-upload" && (
                <video src={mediaUrl} controls className="w-full rounded-xl mt-3" />
              )}
              {mediaUrl && mediaType === "audio-upload" && (
                <audio src={mediaUrl} controls className="w-full mt-3" />
              )}
            </div>
          ) : (
            <div>
              <input
                type="url"
                value={linkInput}
                onChange={(e) => handleLinkChange(e.target.value)}
                placeholder="https://youtube.com/... or Google Drive, Loom, etc."
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: "#F8FAFC", border: "2px solid #E2E8F0", color: "#334155" }}
                onFocus={(e) => { e.target.style.borderColor = "#6366F1" }}
                onBlur={(e) => { e.target.style.borderColor = "#E2E8F0" }}
              />
            </div>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={save}
          disabled={saveStatus === "saving"}
          className="w-full py-4 rounded-3xl text-base font-black text-white transition-all hover:opacity-90 active:scale-95"
          style={{
            background: saveStatus === "saved"
              ? "linear-gradient(135deg, #22C55E, #4ADE80)"
              : saveStatus === "error"
              ? "linear-gradient(135deg, #EF4444, #F87171)"
              : "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow: "0 8px 24px -4px rgba(99,102,241,0.4)",
          }}
        >
          {saveLabel}
        </button>

        {/* Brand project link */}
        <div
          className="bg-white rounded-3xl p-6 flex items-center justify-between"
          style={{ boxShadow: "0 4px 16px -4px rgba(0,0,0,0.08)", border: "1px solid #F1F5F9" }}
        >
          <div>
            <div className="text-sm font-black" style={{ color: "#1E293B" }}>🚀 Your Session 6 Brand Project</div>
            {brand?.brandName ? (
              <div className="text-sm mt-0.5 font-semibold" style={{ color: "#6366F1" }}>
                {brand.brandName}{brand.tagline ? ` — ${brand.tagline}` : ""}
              </div>
            ) : (
              <div className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>Complete Session 6 to build your brand</div>
            )}
          </div>
          <Link
            href="/session/6/brand"
            className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:opacity-80"
            style={{ background: "linear-gradient(135deg, #F43F5E, #FB7185)", boxShadow: "0 4px 12px -2px rgba(244,63,94,0.35)" }}
          >
            View Project →
          </Link>
        </div>
      </div>
    </div>
  )
}
