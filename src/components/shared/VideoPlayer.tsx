"use client"

import { useState, useRef, useEffect } from "react"

interface Prompt {
  id: string
  timestampSeconds: number
  promptText: string
}

interface Props {
  videoId: string
  title: string
  description: string
  prompts: Prompt[]
  savedReflections?: Record<string, string>
  readOnly?: boolean
}

export default function VideoPlayer({ videoId, title, description, prompts, savedReflections = {}, readOnly = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null)
  const [reflection, setReflection] = useState("")
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>(savedReflections)
  const [notes, setNotes] = useState("")
  const [speed, setSpeed] = useState(1)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      for (const prompt of prompts) {
        if (
          Math.abs(video.currentTime - prompt.timestampSeconds) < 0.5 &&
          !savedAnswers[prompt.id] &&
          !dismissed.has(prompt.id)
        ) {
          video.pause()
          setActivePrompt(prompt)
          setReflection(savedAnswers[prompt.id] ?? "")
          break
        }
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    return () => video.removeEventListener("timeupdate", handleTimeUpdate)
  }, [prompts, savedAnswers, dismissed])

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed
  }, [speed])

  async function submitReflection() {
    if (!activePrompt || !reflection.trim()) return
    await fetch("/api/video-reflections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, promptId: activePrompt.id, answer: reflection }),
    })
    setSavedAnswers({ ...savedAnswers, [activePrompt.id]: reflection })
    setActivePrompt(null)
    videoRef.current?.play()
  }

  function dismissPrompt() {
    if (!activePrompt) return
    setDismissed(new Set([...dismissed, activePrompt.id]))
    setActivePrompt(null)
    videoRef.current?.play()
  }

  return (
    <div className="rounded-3xl border overflow-hidden" style={{ background: "white", borderColor: "#E2E8F0" }}>
      {/* Header */}
      <div className="p-5 border-b" style={{ borderColor: "#E2E8F0" }}>
        <h2 className="text-xl font-black" style={{ color: "#1E293B" }}>🎬 {title}</h2>
        {description && <p className="mt-1 text-sm font-medium" style={{ color: "#64748B" }}>{description}</p>}
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Video */}
        <div className="lg:col-span-2">
          <div className="relative rounded-2xl overflow-hidden" style={{ background: "#000", aspectRatio: "16/9" }}>
            <video
              ref={videoRef}
              src={`/api/videos/${videoId}`}
              className="w-full h-full"
              controls
              style={{ display: "block" }}
            />
          </div>

          {/* Speed control */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs font-bold" style={{ color: "#64748B" }}>Speed:</span>
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: speed === s ? "#6366F1" : "#F1F5F9",
                  color: speed === s ? "white" : "#475569",
                }}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Reflection prompts summary */}
          {prompts.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-black uppercase tracking-wide mb-2" style={{ color: "#94A3B8" }}>
                Reflection Questions ({Object.keys(savedAnswers).filter(id => prompts.some(p => p.id === id)).length}/{prompts.length} answered)
              </div>
              <div className="space-y-2">
                {prompts.map((prompt) => (
                  <div key={prompt.id} className="p-3 rounded-xl text-sm" style={{ background: savedAnswers[prompt.id] ? "#F0FDF4" : "#F8FAFC" }}>
                    <div className="flex items-start gap-2">
                      <span>{savedAnswers[prompt.id] ? "✅" : "⏸"}</span>
                      <div>
                        <div className="font-semibold" style={{ color: "#1E293B" }}>{prompt.promptText}</div>
                        {savedAnswers[prompt.id] && (
                          <div className="mt-1 text-xs" style={{ color: "#64748B" }}>{savedAnswers[prompt.id]}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-black mb-2" style={{ color: "#64748B" }}>📝 My Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={readOnly}
            placeholder="Take notes while watching... What materials are used? What steps look tricky? What ideas do you have?"
            className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium resize-none focus:outline-none"
            style={{ borderColor: "#E2E8F0", color: "#1E293B", minHeight: "300px" }}
          />
        </div>
      </div>

      {/* Reflection modal overlay */}
      {activePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-md m-4 rounded-3xl p-6" style={{ background: "white" }}>
            <div className="text-2xl mb-2">⏸️ Reflection Time!</div>
            <p className="font-bold text-lg mb-4" style={{ color: "#1E293B" }}>{activePrompt.promptText}</p>
            <textarea
              autoFocus
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Write your answer here..."
              className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium resize-none focus:outline-none mb-4"
              style={{ borderColor: "#6366F1", color: "#1E293B", minHeight: "100px" }}
            />
            <div className="flex gap-3">
              <button
                onClick={submitReflection}
                disabled={!reflection.trim()}
                className="flex-1 py-3 rounded-2xl text-white font-bold text-sm disabled:opacity-50"
                style={{ background: "#6366F1" }}
              >
                Save & Continue →
              </button>
              <button
                onClick={dismissPrompt}
                className="px-4 py-3 rounded-2xl font-bold text-sm"
                style={{ background: "#F1F5F9", color: "#64748B" }}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
