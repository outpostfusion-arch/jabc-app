"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface Brand { brandName: string; tagline: string }

const QUESTIONS = [
  { key: "whatLearned",   label: "1. What was your business idea?",                           placeholder: "Describe your product or service and the problem it solves..." },
  { key: "marketInsight", label: "2. Who is your target customer?",                           placeholder: "How did you identify them? How did you plan to reach them?" },
  { key: "proudOf",       label: "3. What was your team's greatest achievement?",             placeholder: "Describe a key win and what your specific role was in making it happen..." },
  { key: "challenges",    label: "4. What was your hardest challenge?",                       placeholder: "What made it difficult and how did you and your team work through it?" },
  { key: "nextSteps",     label: "5. If you were launching for real, what would you change?", placeholder: "Think about your product, marketing strategy, pricing, or brand..." },
] as const

type QuestionKey = typeof QUESTIONS[number]["key"]

const MOODS = [
  { emoji: "😴", label: "Meh" },
  { emoji: "😕", label: "Okay" },
  { emoji: "🙂", label: "Good" },
  { emoji: "💪", label: "Great" },
  { emoji: "🤩", label: "Amazing" },
]

const SKILLS = [
  { key: "skillTeamwork",   label: "Teamwork",         color: "#6366F1" },
  { key: "skillCreativity", label: "Creativity",       color: "#EC4899" },
  { key: "skillBusiness",   label: "Business Thinking", color: "#22C55E" },
  { key: "skillLeadership", label: "Leadership",       color: "#F59E0B" },
] as const

type SkillKey = typeof SKILLS[number]["key"]

const GOAL_STATUSES = [
  { value: "not_started", label: "Not started",  bg: "#F1F5F9", color: "#64748B" },
  { value: "in_progress", label: "In progress",  bg: "#FEF3C7", color: "#92400E" },
  { value: "achieved",    label: "Achieved! 🎉", bg: "#D1FAE5", color: "#065F46" },
]

export default function ReflectionPage() {
  const [answers, setAnswers] = useState<Record<QuestionKey, string>>({
    whatLearned: "", marketInsight: "", proudOf: "", challenges: "", nextSteps: "",
  })
  const [mediaUrl, setMediaUrl] = useState("")
  const [mediaType, setMediaType] = useState("")
  const [mediaTab, setMediaTab] = useState<"upload" | "link">("upload")
  const [linkInput, setLinkInput] = useState("")
  const [brand, setBrand] = useState<Brand | null>(null)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [uploading, setUploading] = useState(false)
  const [moodEmoji, setMoodEmoji] = useState("")
  const [skills, setSkills] = useState<Record<SkillKey, number>>({
    skillTeamwork: 0, skillCreativity: 0, skillBusiness: 0, skillLeadership: 0,
  })
  const [goalStatus, setGoalStatus] = useState("not_started")
  const [teacherFeedback, setTeacherFeedback] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/reflections/me")
      .then((r) => r.json())
      .then(({ reflection: r, brand: b }) => {
        if (r) {
          setAnswers({
            whatLearned: r.whatLearned ?? "",
            marketInsight: r.marketInsight ?? "",
            proudOf: r.proudOf ?? "",
            challenges: r.challenges ?? "",
            nextSteps: r.nextSteps ?? "",
          })
          setMediaUrl(r.mediaUrl ?? "")
          setMediaType(r.mediaType ?? "")
          if (r.mediaType === "link") { setMediaTab("link"); setLinkInput(r.mediaUrl ?? "") }
          setMoodEmoji(r.moodEmoji ?? "")
          setSkills({
            skillTeamwork: r.skillTeamwork ?? 0,
            skillCreativity: r.skillCreativity ?? 0,
            skillBusiness: r.skillBusiness ?? 0,
            skillLeadership: r.skillLeadership ?? 0,
          })
          setGoalStatus(r.goalStatus ?? "not_started")
          setTeacherFeedback(r.teacherFeedback ?? "")
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
        body: JSON.stringify({ ...answers, mediaUrl, mediaType, moodEmoji, ...skills, goalStatus }),
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
    } finally { setUploading(false) }
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
        className="rounded-3xl p-8 mb-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)", boxShadow: "0 16px 32px -8px rgba(99,102,241,0.4)" }}
      >
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        <h1 className="text-3xl font-black text-white relative">My Reflection 📝</h1>
        <p className="mt-1 font-semibold relative" style={{ color: "rgba(255,255,255,0.75)" }}>
          Share what you learned and experienced in the JABC program
        </p>
      </div>

      <div className="space-y-5">

        {/* Mood picker */}
        <div className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 4px 16px -4px rgba(0,0,0,0.08)", border: "2px solid #F1F5F9" }}>
          <div className="text-sm font-black mb-4" style={{ color: "#1E293B" }}>How are you feeling about your project?</div>
          <div className="grid grid-cols-5 gap-2">
            {MOODS.map((m) => (
              <button
                key={m.emoji}
                onClick={() => setMoodEmoji(moodEmoji === m.emoji ? "" : m.emoji)}
                className="flex flex-col items-center gap-1.5 flex-1 py-3 rounded-2xl transition-all active:scale-95"
                style={{
                  background: moodEmoji === m.emoji ? "#EEF2FF" : "#F8FAFC",
                  border: moodEmoji === m.emoji ? "2px solid #6366F1" : "2px solid #F1F5F9",
                }}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-xs font-bold" style={{ color: moodEmoji === m.emoji ? "#6366F1" : "#94A3B8" }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reflection questions */}
        {QUESTIONS.map(({ key, label, placeholder }) => (
          <div key={key} className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 4px 16px -4px rgba(0,0,0,0.08)", border: "2px solid #F1F5F9" }}>
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

        {/* Goal status check-in */}
        <div className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 4px 16px -4px rgba(0,0,0,0.08)", border: "2px solid #F1F5F9" }}>
          <div className="text-sm font-black mb-1" style={{ color: "#1E293B" }}>Goal check-in 🎯</div>
          <div className="text-xs mb-4" style={{ color: "#94A3B8" }}>How did you do on your "next steps" goals?</div>
          <div className="flex gap-3">
            {GOAL_STATUSES.map((gs) => (
              <button
                key={gs.value}
                onClick={() => setGoalStatus(gs.value)}
                className="flex-1 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95"
                style={{
                  background: goalStatus === gs.value ? gs.bg : "#F8FAFC",
                  color: goalStatus === gs.value ? gs.color : "#94A3B8",
                  border: goalStatus === gs.value ? `2px solid ${gs.color}` : "2px solid #F1F5F9",
                }}
              >
                {gs.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skill self-rating */}
        <div className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 4px 16px -4px rgba(0,0,0,0.08)", border: "2px solid #F1F5F9" }}>
          <div className="text-sm font-black mb-1" style={{ color: "#1E293B" }}>Rate your skills ⭐</div>
          <div className="text-xs mb-5" style={{ color: "#94A3B8" }}>How confident do you feel in each area after JABC?</div>
          <div className="space-y-4">
            {SKILLS.map(({ key, label, color }) => (
              <div key={key} className="flex items-center gap-4">
                <div className="w-32 text-xs font-black" style={{ color: "#1E293B" }}>{label}</div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSkills((prev) => ({ ...prev, [key]: prev[key] === star ? 0 : star }))}
                      className="text-2xl transition-all active:scale-90"
                    >
                      {star <= skills[key] ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
                {skills[key] > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: color + "20", color }}>
                    {skills[key]}/5
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 4px 16px -4px rgba(0,0,0,0.08)", border: "2px solid #F1F5F9" }}>
          <div className="text-sm font-black mb-4" style={{ color: "#1E293B" }}>Media Reflection (Optional)</div>
          <div className="flex gap-2 mb-4">
            {(["upload", "link"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMediaTab(tab)}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={{ background: mediaTab === tab ? "#6366F1" : "#F1F5F9", color: mediaTab === tab ? "white" : "#64748B" }}
              >
                {tab === "upload" ? "📤 Upload Video / Audio" : "🔗 Paste a Link"}
              </button>
            ))}
          </div>
          {mediaTab === "upload" ? (
            <div>
              <input ref={fileInputRef} type="file" accept="video/*,audio/*" className="hidden" onChange={handleFileUpload} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 rounded-2xl text-sm font-bold border-2 border-dashed transition-all hover:opacity-80"
                style={{ borderColor: "#6366F1", color: "#6366F1", background: "#F5F3FF" }}
              >
                {uploading ? "Uploading..." : mediaUrl && mediaType !== "link" ? "✓ File uploaded — click to replace" : "Click to upload a video or audio file"}
              </button>
              {mediaUrl && mediaType === "video-upload" && <video src={mediaUrl} controls className="w-full rounded-xl mt-3" />}
              {mediaUrl && mediaType === "audio-upload" && <audio src={mediaUrl} controls className="w-full mt-3" />}
            </div>
          ) : (
            <input
              type="url"
              value={linkInput}
              onChange={(e) => { setLinkInput(e.target.value); setMediaUrl(e.target.value); setMediaType("link") }}
              placeholder="https://youtube.com/... or Google Drive, Loom, etc."
              className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all"
              style={{ background: "#F8FAFC", border: "2px solid #E2E8F0", color: "#334155" }}
              onFocus={(e) => { e.target.style.borderColor = "#6366F1" }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E8F0" }}
            />
          )}
        </div>

        {/* Save button */}
        <button
          onClick={save}
          disabled={saveStatus === "saving"}
          className="w-full py-4 rounded-3xl text-base font-black text-white transition-all hover:opacity-90 active:scale-95"
          style={{
            background: saveStatus === "saved" ? "linear-gradient(135deg, #22C55E, #4ADE80)"
              : saveStatus === "error" ? "linear-gradient(135deg, #EF4444, #F87171)"
              : "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow: "0 8px 24px -4px rgba(99,102,241,0.4)",
          }}
        >
          {saveLabel}
        </button>

        {/* Teacher feedback */}
        {teacherFeedback && (
          <div
            className="bg-white rounded-3xl p-6"
            style={{ boxShadow: "0 4px 16px -4px rgba(0,0,0,0.08)", border: "2px solid #6366F1" }}
          >
            <div className="text-sm font-black mb-2" style={{ color: "#6366F1" }}>💬 Teacher Feedback</div>
            <div className="text-sm leading-relaxed" style={{ color: "#334155" }}>{teacherFeedback}</div>
          </div>
        )}

        {/* Brand project link */}
        <div className="bg-white rounded-3xl p-6 flex items-center justify-between" style={{ boxShadow: "0 4px 16px -4px rgba(0,0,0,0.08)", border: "2px solid #F1F5F9" }}>
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
