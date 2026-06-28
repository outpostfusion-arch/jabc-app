"use client"
import type { RobotConfig } from "./types"
import { getScheme } from "./schemes"
import { PART_MAP } from "./parts"

const GHOST = "#94A3B8"

interface Props {
  config: RobotConfig
  size?: number
  animate?: boolean
  dancing?: boolean
}

export function RobotSVG({ config, size = 200, animate = false, dancing = false }: Props) {
  const scheme = getScheme(config.colorScheme)
  const c = { primary: scheme.primary, accent: scheme.accent }
  const ghost = { primary: GHOST, accent: GHOST }

  const get = (map: Record<string, { render: (c: { primary: string; accent: string }) => React.ReactNode }>, id: string, fallbackId: string) => {
    const part = map[id]
    if (part) return part.render(c)
    return <g opacity="0.22">{map[fallbackId]?.render(ghost)}</g>
  }

  return (
    <svg
      viewBox="0 0 200 400"
      width={size}
      height={size * 2}
      style={{
        animation: dancing
          ? "robotDance 0.5s ease-in-out 2"
          : animate
          ? "robotFloat 3s ease-in-out infinite"
          : undefined,
        overflow: "visible",
      }}
    >
      <defs>
        <style>{`
          @keyframes robotFloat {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-10px); }
          }
          @keyframes robotDance {
            0%   { transform: rotate(0deg)  scale(1); }
            25%  { transform: rotate(-10deg) scale(1.06); }
            50%  { transform: rotate(10deg)  scale(1.06); }
            75%  { transform: rotate(-6deg)  scale(1.03); }
            100% { transform: rotate(0deg)  scale(1); }
          }
        `}</style>
      </defs>

      {/* Render bottom-up so head sits on top */}
      {get(PART_MAP.feet,    config.feet,    "boots")}
      {get(PART_MAP.legs,    config.legs,    "standard")}
      {get(PART_MAP.body,    config.body,    "classic")}
      {get(PART_MAP.arms,    config.arms,    "standard")}
      {get(PART_MAP.hands,   config.hands,   "fist")}
      {get(PART_MAP.head,    config.head,    "orb")}
      {get(PART_MAP.face,    config.face,    "pixel")}
      {PART_MAP.antenna[config.antenna]?.render(c) ?? null}
    </svg>
  )
}
