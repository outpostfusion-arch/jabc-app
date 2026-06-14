"use client"

import { useState, useEffect, useRef } from "react"

interface Prompt { id: string; timestampSeconds: number; promptText: string }
interface Video { id: string; title: string; description: string; sessionId: number; sortOrder: number; prompts: Prompt[] }

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [newPrompt, setNewPrompt] = useState({ timestampSeconds: 0, promptText: "" })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ title: "", description: "", sessionId: "4" })

  useEffect(() => {
    fetch("/api/videos").then((r) => r.json()).then(setVideos)
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !form.title) return
    setUploading(true)
    setUploadProgress("Uploading video...")
    const fd = new FormData()
    fd.append("file", file)
    const uploadRes = await fetch("/api/videos/upload", { method: "POST", body: fd })
    const { filePath, mimeType, sizeBytes } = await uploadRes.json()
    setUploadProgress("Saving...")
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title, description: form.description, filePath, sessionId: form.sessionId, mimeType, sizeBytes }),
    })
    const video = await res.json()
    setVideos([...videos, { ...video, prompts: [] }])
    setForm({ title: "", description: "", sessionId: "4" })
    setUploading(false)
    setUploadProgress("")
  }

  async function addPrompt(videoId: string) {
    if (!newPrompt.promptText.trim()) return
    const res = await fetch("/api/video-prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId, ...newPrompt, sortOrder: selectedVideo?.prompts.length ?? 0 }),
    })
    const prompt = await res.json()
    setVideos(videos.map((v) => v.id === videoId ? { ...v, prompts: [...v.prompts, prompt] } : v))
    setSelectedVideo((prev) => prev ? { ...prev, prompts: [...prev.prompts, prompt] } : null)
    setNewPrompt({ timestampSeconds: 0, promptText: "" })
  }

  async function deleteVideo(id: string) {
    if (!confirm("Delete this video?")) return
    await fetch(`/api/videos?id=${id}`, { method: "DELETE" })
    setVideos(videos.filter((v) => v.id !== id))
    if (selectedVideo?.id === id) setSelectedVideo(null)
  }

  async function deletePrompt(videoId: string, promptId: string) {
    await fetch(`/api/video-prompts?id=${promptId}`, { method: "DELETE" })
    setVideos(videos.map((v) => v.id === videoId ? { ...v, prompts: v.prompts.filter((p) => p.id !== promptId) } : v))
    setSelectedVideo((prev) => prev ? { ...prev, prompts: prev.prompts.filter((p) => p.id !== promptId) } : null)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>Tutorial Videos</h1>
        <p className="mt-1 font-semibold" style={{ color: "#64748B" }}>Upload videos for Session 4 and add reflection prompts at specific timestamps.</p>
      </div>

      {/* Upload form */}
      <div className="rounded-3xl border p-5 mb-6" style={{ background: "white", borderColor: "#E2E8F0" }}>
        <h2 className="font-black text-lg mb-4" style={{ color: "#1E293B" }}>Upload New Video</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Video title *" className="px-3 py-2 rounded-xl border text-sm font-medium focus:outline-none" style={{ borderColor: "#E2E8F0" }} />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" className="px-3 py-2 rounded-xl border text-sm font-medium focus:outline-none" style={{ borderColor: "#E2E8F0" }} />
          <select value={form.sessionId} onChange={(e) => setForm({ ...form, sessionId: e.target.value })} className="px-3 py-2 rounded-xl border text-sm font-medium focus:outline-none" style={{ borderColor: "#E2E8F0" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => <option key={i} value={i}>Session {i}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <input ref={fileInputRef} type="file" accept="video/*" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading || !form.title} className="px-5 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50" style={{ background: "#6366F1" }}>
            {uploading ? uploadProgress : "Choose Video File"}
          </button>
          {uploadProgress && <span className="text-sm font-semibold" style={{ color: "#6366F1" }}>{uploadProgress}</span>}
        </div>
      </div>

      {/* Video list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-3">
          {videos.map((video) => (
            <div key={video.id} onClick={() => setSelectedVideo(video)} className="p-4 rounded-2xl border cursor-pointer transition-all" style={{ background: selectedVideo?.id === video.id ? "#EEF2FF" : "white", borderColor: selectedVideo?.id === video.id ? "#6366F1" : "#E2E8F0" }}>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="font-black text-sm" style={{ color: "#1E293B" }}>{video.title}</div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: "#64748B" }}>Session {video.sessionId} • {video.prompts.length} prompts</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteVideo(video.id) }} className="text-xs px-2 py-1 rounded-lg" style={{ background: "#FFF1F2", color: "#F43F5E" }}>Delete</button>
              </div>
            </div>
          ))}
          {videos.length === 0 && <div className="text-center py-8" style={{ color: "#94A3B8" }}>No videos yet</div>}
        </div>

        {selectedVideo && (
          <div className="lg:col-span-2 rounded-3xl border p-5" style={{ background: "white", borderColor: "#E2E8F0" }}>
            <h2 className="font-black text-lg mb-4" style={{ color: "#1E293B" }}>Reflection Prompts: {selectedVideo.title}</h2>
            <p className="text-sm mb-4" style={{ color: "#64748B" }}>Add questions that pause the video at specific timestamps. Students must answer before continuing.</p>

            <div className="space-y-2 mb-4">
              {selectedVideo.prompts.map((p) => (
                <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "#F8FAFC" }}>
                  <span className="text-xs font-black px-2 py-1 rounded-lg mt-0.5" style={{ background: "#EEF2FF", color: "#6366F1" }}>{p.timestampSeconds}s</span>
                  <span className="flex-1 text-sm font-medium" style={{ color: "#1E293B" }}>{p.promptText}</span>
                  <button onClick={() => deletePrompt(selectedVideo.id, p.id)} className="text-xs px-2 py-1 rounded-lg" style={{ background: "#FFF1F2", color: "#F43F5E" }}>✕</button>
                </div>
              ))}
              {selectedVideo.prompts.length === 0 && <div className="text-center py-4 text-sm" style={{ color: "#94A3B8" }}>No prompts yet</div>}
            </div>

            <div className="flex gap-3">
              <input type="number" min={0} value={newPrompt.timestampSeconds} onChange={(e) => setNewPrompt({ ...newPrompt, timestampSeconds: parseInt(e.target.value) || 0 })} placeholder="Time (seconds)" className="w-32 px-3 py-2 rounded-xl border text-sm font-medium focus:outline-none" style={{ borderColor: "#E2E8F0" }} />
              <input value={newPrompt.promptText} onChange={(e) => setNewPrompt({ ...newPrompt, promptText: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addPrompt(selectedVideo.id)} placeholder="Question to ask students..." className="flex-1 px-3 py-2 rounded-xl border text-sm font-medium focus:outline-none" style={{ borderColor: "#E2E8F0" }} />
              <button onClick={() => addPrompt(selectedVideo.id)} className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "#6366F1" }}>Add</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}