"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import RobotMascot from "./RobotMascot"
import UserRobot, { type RobotConfig } from "./UserRobot"

export default function ResetMascot({
  size = 120,
  canReset = false,
  robotConfig = null,
}: {
  size?: number
  canReset?: boolean
  robotConfig?: RobotConfig | null
}) {
  const router = useRouter()
  const [resetting, setResetting] = useState(false)

  const mascot = robotConfig
    ? <UserRobot config={robotConfig} size={size} />
    : <RobotMascot size={size} />

  if (!canReset) {
    return mascot
  }

  async function handleReset() {
    if (resetting) return
    if (!window.confirm("Reset the demo? This clears the chosen robot and re-locks the tracks.")) return
    setResetting(true)
    try {
      const res = await fetch("/api/robot", { method: "DELETE" })
      if (!res.ok) throw new Error("reset failed")
      router.refresh()
    } catch {
      setResetting(false)
    }
  }

  return (
    <button
      onClick={handleReset}
      title="Reset demo (clears robot)"
      aria-label="Reset demo"
      className="transition-transform hover:scale-105 active:scale-95"
      style={{ cursor: "pointer", pointerEvents: "auto", opacity: resetting ? 0.5 : 1, background: "none", border: "none", padding: 0 }}
    >
      {mascot}
    </button>
  )
}
