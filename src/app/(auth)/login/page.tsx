"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Incorrect username or password. Try again!")
    } else {
      // Middleware will handle redirect based on role
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #FBBF24 100%)" }}>
      {/* Logo / Title */}
      <div className="mb-8 text-center">
        <div className="text-6xl mb-3">🚀</div>
        <h1 className="text-4xl font-black text-white drop-shadow-lg">JABC</h1>
        <p className="text-white/80 text-lg font-semibold mt-1">Junior Achievement Business Challenge</p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4">
        <h2 className="text-2xl font-black text-center mb-6" style={{ color: "#1E293B" }}>
          Welcome back! 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: "#64748B" }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 text-base font-medium transition-colors focus:outline-none"
              style={{ borderColor: username ? "#6366F1" : "#E2E8F0", color: "#1E293B" }}
              placeholder="Enter your username"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5" style={{ color: "#64748B" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 text-base font-medium transition-colors focus:outline-none"
              style={{ borderColor: password ? "#6366F1" : "#E2E8F0", color: "#1E293B" }}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm font-semibold" style={{ background: "#FFF1F2", color: "#F43F5E" }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-60"
            style={{ background: loading ? "#94A3B8" : "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "#94A3B8" }}>
          Ask your teacher for your login details
        </p>
      </div>
    </div>
  )
}
