"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AvatarImage, { AVATAR_IDS, AVATAR_NAMES } from "@/components/shared/AvatarImage"

interface BulkStudent {
  name: string
  username: string
  password: string
}

export default function NewStudentPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"single" | "bulk">("single")

  // Single mode
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [classCode, setClassCode] = useState("")
  const [classGroupId, setClassGroupId] = useState("")
  const [avatarEmoji, setAvatarEmoji] = useState("fox")
  const [singleLoading, setSingleLoading] = useState(false)
  const [singleError, setSingleError] = useState("")

  // Bulk mode
  const [bulkText, setBulkText] = useState("")
  const [bulkClassGroupId, setBulkClassGroupId] = useState("")
  const [bulkPreview, setBulkPreview] = useState<BulkStudent[]>([])
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkDone, setBulkDone] = useState(false)

  function autoUsername(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12)
  }

  function autoPassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  }

  function parseBulk() {
    const lines = bulkText.split("\n").map((l) => l.trim()).filter(Boolean)
    const students: BulkStudent[] = lines.map((name) => ({
      name,
      username: autoUsername(name),
      password: autoPassword(),
    }))
    setBulkPreview(students)
  }

  async function createSingle(e: React.FormEvent) {
    e.preventDefault()
    setSingleError("")
    setSingleLoading(true)
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, username, password, classCode, classGroupId: classGroupId || undefined, avatarEmoji }),
    })
    setSingleLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setSingleError(data.error ?? "Something went wrong")
    } else {
      router.push("/teacher/students")
    }
  }

  async function createBulk() {
    setBulkLoading(true)
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bulk: bulkPreview, classCode, classGroupId: bulkClassGroupId || undefined }),
    })
    setBulkLoading(false)
    if (res.ok) {
      setBulkDone(true)
    }
  }

  function downloadCredentials() {
    const csv = ["Name,Username,Password", ...bulkPreview.map((s) => `${s.name},${s.username},${s.password}`)].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "student-credentials.csv"
    a.click()
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>Add Students ✨</h1>
        <p className="mt-1 font-semibold" style={{ color: "#64748B" }}>Create one student or import a whole class at once</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex rounded-2xl p-1 mb-8 w-fit" style={{ background: "#F1F5F9" }}>
        <button
          onClick={() => setMode("single")}
          className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
          style={{ background: mode === "single" ? "white" : "transparent", color: mode === "single" ? "#6366F1" : "#64748B", boxShadow: mode === "single" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
        >
          Single Student
        </button>
        <button
          onClick={() => setMode("bulk")}
          className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
          style={{ background: mode === "bulk" ? "white" : "transparent", color: mode === "bulk" ? "#6366F1" : "#64748B", boxShadow: mode === "bulk" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
        >
          Bulk Import
        </button>
      </div>

      {mode === "single" ? (
        <form onSubmit={createSingle} className="rounded-3xl border p-6 space-y-5" style={{ background: "white", borderColor: "#E2E8F0" }}>
          <Field label="Full Name" value={displayName} onChange={(v) => { setDisplayName(v); if (!username) setUsername(autoUsername(v)) }} placeholder="e.g. Emma Johnson" required />
          <Field label="Username" value={username} onChange={setUsername} placeholder="e.g. emmajohnson" required hint="Student uses this to log in" />
          <Field label="Password" value={password} onChange={setPassword} placeholder="Create a password" required>
            <button type="button" onClick={() => setPassword(autoPassword())} className="ml-2 text-xs font-bold px-2 py-1 rounded-lg" style={{ background: "#EEF2FF", color: "#6366F1" }}>
              Generate
            </button>
          </Field>
          <Field label="Class Code (optional)" value={classCode} onChange={setClassCode} placeholder="e.g. CLASS2024" />

          {/* Level picker */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: "#64748B" }}>Level</label>
            <div className="flex gap-3">
              {[{ id: "", label: "Unassigned" }, { id: "group-junior", label: "🟢 Junior" }, { id: "group-senior", label: "🔵 Senior" }].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setClassGroupId(opt.id)}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: classGroupId === opt.id ? "#6366F1" : "#F1F5F9",
                    color: classGroupId === opt.id ? "white" : "#64748B",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Avatar picker */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: "#64748B" }}>Avatar</label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  title={AVATAR_NAMES[id]}
                  onClick={() => setAvatarEmoji(id)}
                  className="rounded-2xl flex items-center justify-center transition-all p-1"
                  style={{ border: `2px solid ${avatarEmoji === id ? "#6366F1" : "transparent"}`, background: avatarEmoji === id ? "#EEF2FF" : "#F8FAFC" }}
                >
                  <AvatarImage avatarId={id} size={44} />
                </button>
              ))}
            </div>
          </div>

          {singleError && (
            <div className="p-3 rounded-xl text-sm font-semibold" style={{ background: "#FFF1F2", color: "#F43F5E" }}>
              ⚠️ {singleError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={singleLoading} className="px-6 py-3 rounded-2xl text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
              {singleLoading ? "Creating..." : "Create Student →"}
            </button>
            <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-2xl font-bold text-sm" style={{ background: "#F1F5F9", color: "#64748B" }}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="rounded-3xl border p-6" style={{ background: "white", borderColor: "#E2E8F0" }}>
            <label className="block font-bold mb-2" style={{ color: "#1E293B" }}>
              Paste student names (one per line)
            </label>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="w-full h-40 px-4 py-3 rounded-2xl border-2 font-medium text-sm resize-none focus:outline-none"
              style={{ borderColor: "#E2E8F0", color: "#1E293B" }}
              placeholder={"Emma Johnson\nLiam Chen\nSophia Martinez\n..."}
            />
            <Field label="Class Code (optional)" value={classCode} onChange={setClassCode} placeholder="e.g. CLASS2024" />

            {/* Bulk level picker */}
            <div className="mt-4">
              <label className="block text-sm font-bold mb-2" style={{ color: "#64748B" }}>Level</label>
              <div className="flex gap-3">
                {[{ id: "", label: "Unassigned" }, { id: "group-junior", label: "🟢 Junior" }, { id: "group-senior", label: "🔵 Senior" }].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBulkClassGroupId(opt.id)}
                    className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background: bulkClassGroupId === opt.id ? "#6366F1" : "#F1F5F9",
                      color: bulkClassGroupId === opt.id ? "white" : "#64748B",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={parseBulk}
              className="mt-4 px-5 py-2.5 rounded-2xl text-white font-bold text-sm"
              style={{ background: "#6366F1" }}
            >
              Preview Accounts →
            </button>
          </div>

          {bulkPreview.length > 0 && (
            <div className="rounded-3xl border overflow-hidden" style={{ background: "white", borderColor: "#E2E8F0" }}>
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "#E2E8F0" }}>
                <span className="font-black" style={{ color: "#1E293B" }}>{bulkPreview.length} accounts ready</span>
                <button onClick={downloadCredentials} className="text-xs font-bold px-3 py-1.5 rounded-xl" style={{ background: "#EEF2FF", color: "#6366F1" }}>
                  Download CSV
                </button>
              </div>
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-sm">
                  <thead style={{ background: "#F8FAFC" }}>
                    <tr>
                      <th className="text-left px-4 py-2 font-bold" style={{ color: "#64748B" }}>Name</th>
                      <th className="text-left px-4 py-2 font-bold" style={{ color: "#64748B" }}>Username</th>
                      <th className="text-left px-4 py-2 font-bold" style={{ color: "#64748B" }}>Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkPreview.map((s, i) => (
                      <tr key={i} style={{ borderTop: "1px solid #F1F5F9" }}>
                        <td className="px-4 py-2 font-medium" style={{ color: "#1E293B" }}>{s.name}</td>
                        <td className="px-4 py-2"><code style={{ color: "#475569" }}>{s.username}</code></td>
                        <td className="px-4 py-2"><code style={{ color: "#475569" }}>{s.password}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {bulkDone ? (
                <div className="p-4 text-center font-bold" style={{ color: "#16A34A" }}>
                  ✅ All accounts created!{" "}
                  <button onClick={() => router.push("/teacher/students")} style={{ color: "#6366F1" }}>View students →</button>
                </div>
              ) : (
                <div className="p-4">
                  <button
                    onClick={createBulk}
                    disabled={bulkLoading}
                    className="px-6 py-3 rounded-2xl text-white font-bold text-sm"
                    style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)" }}
                  >
                    {bulkLoading ? "Creating..." : `Create ${bulkPreview.length} Accounts →`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, required, hint, children
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; hint?: string; children?: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1.5" style={{ color: "#64748B" }}>{label}</label>
      <div className="flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium focus:outline-none"
          style={{ borderColor: "#E2E8F0", color: "#1E293B" }}
        />
        {children}
      </div>
      {hint && <p className="text-xs mt-1 font-medium" style={{ color: "#94A3B8" }}>{hint}</p>}
    </div>
  )
}
