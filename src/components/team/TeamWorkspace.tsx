"use client"

import { useState, useEffect, useRef } from "react"

interface DocData {
  slogan: string
  keyMessages: string[]
  toneOfVoice: string
  version: number
}

interface Message {
  id: string
  userId: string
  content: string
  createdAt: string
}

interface Props {
  teamId: string
  teamName: string
  userId: string
  initialDoc?: DocData
  readOnly?: boolean
}

export default function TeamWorkspace({ teamId, teamName, userId, initialDoc, readOnly = false }: Props) {
  const [doc, setDoc] = useState<DocData>(initialDoc ?? { slogan: "", keyMessages: ["", "", ""], toneOfVoice: "", version: 0 })
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "conflict">("idle")
  const [badge, setBadge] = useState<{ name: string; emoji: string } | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    fetchDoc()
    const interval = setInterval(() => {
      fetchMessages()
      fetchDoc()
    }, 3000)
    return () => clearInterval(interval)
  }, [teamId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function fetchDoc() {
    const res = await fetch(`/api/teams/${teamId}/doc`)
    if (res.ok) {
      const data = await res.json()
      if (data.version > doc.version) {
        setDoc(data)
      }
    }
  }

  async function fetchMessages() {
    const res = await fetch(`/api/teams/${teamId}/messages`)
    if (res.ok) {
      const data = await res.json()
      setMessages(data)
    }
  }

  function saveDoc(updated: DocData) {
    if (readOnly) return
    setSaveState("saving")
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const res = await fetch(`/api/teams/${teamId}/doc`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
      if (res.status === 409) {
        setSaveState("conflict")
        fetchDoc()
      } else if (res.ok) {
        setSaveState("saved")
        const json = await res.json()
        setDoc((prev) => ({ ...prev, version: json.version }))
        if (json.badge) setBadge(json.badge)
      }
    }, 800)
  }

  function updateKeyMessage(idx: number, value: string) {
    const updated = { ...doc, keyMessages: doc.keyMessages.map((m, i) => (i === idx ? value : m)) }
    setDoc(updated)
    saveDoc(updated)
  }

  function updateField(field: "slogan" | "toneOfVoice", value: string) {
    const updated = { ...doc, [field]: value }
    setDoc(updated)
    saveDoc(updated)
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim()) return
    await fetch(`/api/teams/${teamId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage.trim() }),
    })
    setNewMessage("")
    fetchMessages()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Marketing Doc */}
      <div className="lg:col-span-2 space-y-5">
        <div className="rounded-3xl border p-6" style={{ background: "white", borderColor: "#E2E8F0" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black" style={{ color: "#1E293B" }}>Team: {teamName} 📝</h2>
              <p className="text-sm font-semibold" style={{ color: "#64748B" }}>Build your marketing messaging together</p>
            </div>
            <span className="text-xs font-semibold" style={{ color: saveState === "saved" ? "#22C55E" : saveState === "saving" ? "#94A3B8" : saveState === "conflict" ? "#F43F5E" : "transparent" }}>
              {saveState === "saved" ? "✓ Saved" : saveState === "saving" ? "Saving..." : saveState === "conflict" ? "⚠ Conflict — reloaded" : "·"}
            </span>
          </div>

          <div className="space-y-5">
            {/* Slogan */}
            <div>
              <label className="block text-sm font-black mb-2" style={{ color: "#64748B" }}>
                🎯 Our Slogan
                <span className="ml-2 text-xs font-medium">(short, catchy, memorable)</span>
              </label>
              <input
                value={doc.slogan}
                onChange={(e) => updateField("slogan", e.target.value)}
                disabled={readOnly}
                placeholder='e.g. "Spin Into Style!" or "Where Learning Meets Profit"'
                className="w-full px-4 py-3 rounded-2xl border-2 font-bold text-sm focus:outline-none"
                style={{ borderColor: doc.slogan ? "#22C55E" : "#E2E8F0", color: "#1E293B" }}
              />
            </div>

            {/* Key Messages */}
            <div>
              <label className="block text-sm font-black mb-2" style={{ color: "#64748B" }}>
                💬 3 Key Messages
                <span className="ml-2 text-xs font-medium">(what do you want customers to remember?)</span>
              </label>
              <div className="space-y-2">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0" style={{ background: "#EEF2FF", color: "#6366F1" }}>
                      {idx + 1}
                    </span>
                    <input
                      value={doc.keyMessages[idx] ?? ""}
                      onChange={(e) => updateKeyMessage(idx, e.target.value)}
                      disabled={readOnly}
                      placeholder={["Our product is unique because...", "Our customers feel...", "Buying from us means..."][idx]}
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 text-sm font-medium focus:outline-none"
                      style={{ borderColor: doc.keyMessages[idx] ? "#22C55E" : "#E2E8F0", color: "#1E293B" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tone of Voice */}
            <div>
              <label className="block text-sm font-black mb-2" style={{ color: "#64748B" }}>
                🎨 Our Tone of Voice
                <span className="ml-2 text-xs font-medium">(how do we want to sound?)</span>
              </label>
              <textarea
                value={doc.toneOfVoice}
                onChange={(e) => updateField("toneOfVoice", e.target.value)}
                disabled={readOnly}
                placeholder="e.g. Fun and energetic! We use exclamation marks and emojis. We speak like we're talking to a friend..."
                className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium resize-none focus:outline-none"
                style={{ borderColor: doc.toneOfVoice ? "#22C55E" : "#E2E8F0", color: "#1E293B", minHeight: "100px" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Chat */}
      <div className="rounded-3xl border flex flex-col" style={{ background: "white", borderColor: "#E2E8F0", maxHeight: "500px" }}>
        <div className="p-4 border-b font-black" style={{ color: "#1E293B", borderColor: "#E2E8F0" }}>
          💬 Team Chat
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.userId === userId ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[85%] px-3 py-2 rounded-2xl text-sm font-medium"
                style={{
                  background: msg.userId === userId ? "#6366F1" : "#F1F5F9",
                  color: msg.userId === userId ? "white" : "#1E293B",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center py-4 text-sm" style={{ color: "#94A3B8" }}>
              No messages yet. Say hi to your team! 👋
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {!readOnly && (
          <form onSubmit={sendMessage} className="p-3 border-t flex gap-2" style={{ borderColor: "#E2E8F0" }}>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Say something..."
              className="flex-1 px-3 py-2 rounded-xl border text-sm font-medium focus:outline-none"
              style={{ borderColor: "#E2E8F0", color: "#1E293B" }}
            />
            <button type="submit" className="px-3 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "#6366F1" }}>
              Send
            </button>
          </form>
        )}
      </div>

      {badge && (
        <div className="fixed bottom-6 right-6 z-50 p-5 rounded-3xl shadow-2xl" style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)" }}>
          <div className="text-4xl text-center mb-2">{badge.emoji}</div>
          <div className="text-white font-black text-center">Badge Earned!</div>
          <div className="text-white/80 text-center font-semibold mt-1">{badge.name}</div>
          <button onClick={() => setBadge(null)} className="mt-3 w-full text-center text-sm text-white/60 font-bold">Dismiss</button>
        </div>
      )}
    </div>
  )
}
