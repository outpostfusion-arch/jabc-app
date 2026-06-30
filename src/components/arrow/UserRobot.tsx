"use client"

import { useState, useEffect } from "react"

export interface RobotConfig {
  face: string; faceKey: string
  eyes: string; eyesKey: string
  top: string; topKey: string
  sides: string; sidesKey: string
  texture: string; textureKey: string
  mouth: string; mouthKey: string
}

interface CustomSkin { key: string; patternId: string; patternDefs: string }

const CUSTOM_SKINS: CustomSkin[] = [
  { key:"cs01", patternId:"cs01p", patternDefs:`<pattern id="cs01p" patternUnits="userSpaceOnUse" width="8" height="8"><rect width="8" height="8" fill="#111827"/><rect width="4" height="4" fill="#1f2937"/><rect x="4" y="4" width="4" height="4" fill="#1f2937"/><rect x="1" y="0" width="2" height="4" fill="#374151" opacity="0.9"/><rect x="5" y="4" width="2" height="4" fill="#374151" opacity="0.9"/><rect x="0" y="1" width="4" height="2" fill="#4b5563" opacity="0.5"/><rect x="4" y="5" width="4" height="2" fill="#4b5563" opacity="0.5"/></pattern>` },
  { key:"cs02", patternId:"cs02p", patternDefs:`<pattern id="cs02p" patternUnits="userSpaceOnUse" width="2" height="6"><rect width="2" height="1" fill="#6b7280"/><rect y="1" width="2" height="2" fill="#f3f4f6"/><rect y="3" width="2" height="2" fill="#d1d5db"/><rect y="5" width="2" height="1" fill="#9ca3af"/></pattern>` },
  { key:"cs03", patternId:"cs03p", patternDefs:`<pattern id="cs03p" patternUnits="userSpaceOnUse" width="6" height="6"><rect width="6" height="6" fill="#c0c0c0"/><rect width="3" height="3" fill="#f5f5f5"/><rect x="3" y="3" width="3" height="3" fill="#e8e8e8"/><rect x="1" y="0" width="1" height="3" fill="#a8a8a8"/><rect x="4" y="3" width="1" height="3" fill="#a8a8a8"/></pattern>` },
  { key:"cs04", patternId:"cs04p", patternDefs:`<pattern id="cs04p" patternUnits="userSpaceOnUse" width="6" height="6"><rect width="6" height="6" fill="#92400e"/><rect width="3" height="3" fill="#fcd34d"/><rect x="3" y="3" width="3" height="3" fill="#fbbf24"/><rect x="1" y="0" width="1" height="3" fill="#f59e0b"/><rect x="4" y="3" width="1" height="3" fill="#f59e0b"/><rect x="0" y="1" width="3" height="1" fill="#fde68a" opacity="0.6"/></pattern>` },
  { key:"cs05", patternId:"cs05p", patternDefs:`<pattern id="cs05p" patternUnits="userSpaceOnUse" width="24" height="24" patternTransform="rotate(45)"><rect width="12" height="24" fill="#fcd34d"/><rect x="12" width="12" height="24" fill="#1c1917"/></pattern>` },
  { key:"cs06", patternId:"cs06p", patternDefs:`<pattern id="cs06p" patternUnits="userSpaceOnUse" width="16" height="32" patternTransform="rotate(20)"><rect width="16" height="32" fill="#c2410c"/><rect x="2" width="5" height="32" fill="#1c1917" opacity="0.85"/><rect x="10" width="3" height="32" fill="#1c1917" opacity="0.85"/><rect x="6" width="2" height="32" fill="#ea580c" opacity="0.6"/></pattern>` },
  { key:"cs07", patternId:"cs07p", patternDefs:`<pattern id="cs07p" patternUnits="userSpaceOnUse" width="24" height="24"><rect width="24" height="24" fill="#365314"/><rect x="0" y="0" width="10" height="8" fill="#4d7c0f"/><rect x="8" y="6" width="12" height="8" fill="#65a30d" opacity="0.8"/><rect x="0" y="14" width="8" height="10" fill="#166534" opacity="0.9"/><rect x="14" y="0" width="10" height="10" fill="#78350f" opacity="0.5"/><rect x="16" y="14" width="8" height="10" fill="#3f6212"/></pattern>` },
  { key:"cs08", patternId:"cs08p", patternDefs:`<pattern id="cs08p" patternUnits="userSpaceOnUse" width="16" height="16"><rect width="16" height="16" fill="#1e3a8a"/><line x1="0" y1="0" x2="16" y2="0" stroke="#3b82f6" stroke-width="0.6" opacity="0.9"/><line x1="0" y1="8" x2="16" y2="8" stroke="#93c5fd" stroke-width="0.3" opacity="0.5"/><line x1="0" y1="0" x2="0" y2="16" stroke="#3b82f6" stroke-width="0.6" opacity="0.9"/><line x1="8" y1="0" x2="8" y2="16" stroke="#93c5fd" stroke-width="0.3" opacity="0.5"/></pattern>` },
  { key:"cs09", patternId:"cs09p", patternDefs:`<pattern id="cs09p" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(-35)"><rect width="20" height="20" fill="#7f1d1d"/><rect width="6" height="20" fill="#dc2626"/><rect x="6" width="4" height="20" fill="#f97316"/><rect x="10" width="3" height="20" fill="#fbbf24" opacity="0.7"/><rect x="13" width="7" height="20" fill="#b91c1c"/></pattern>` },
  { key:"cs10", patternId:"cs10p", patternDefs:`<pattern id="cs10p" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(60)"><rect width="20" height="20" fill="#3b0764"/><rect width="6" height="20" fill="#7c3aed"/><rect x="6" width="4" height="20" fill="#ec4899"/><rect x="10" width="4" height="20" fill="#a855f7"/><rect x="14" width="3" height="20" fill="#db2777" opacity="0.8"/><rect x="17" width="3" height="20" fill="#6d28d9" opacity="0.9"/></pattern>` },
  { key:"cs11", patternId:"cs11p", patternDefs:`<pattern id="cs11p" patternUnits="userSpaceOnUse" width="20" height="20"><rect width="20" height="20" fill="#7f1d1d"/><ellipse cx="5" cy="5" rx="5" ry="4" fill="#ef4444"/><ellipse cx="15" cy="3" rx="4" ry="3" fill="#f97316"/><ellipse cx="10" cy="14" rx="6" ry="5" fill="#dc2626"/><ellipse cx="2" cy="17" rx="3" ry="3" fill="#fca5a5" opacity="0.5"/><ellipse cx="18" cy="15" rx="4" ry="3" fill="#f97316" opacity="0.7"/></pattern>` },
  { key:"cs12", patternId:"cs12p", patternDefs:`<pattern id="cs12p" patternUnits="userSpaceOnUse" width="12" height="40" patternTransform="rotate(12)"><rect width="12" height="40" fill="#0c4a6e"/><rect x="5" width="2" height="40" fill="#38bdf8" opacity="0.9"/><rect x="3" y="8" width="1" height="6" fill="#7dd3fc" opacity="0.6"/><rect x="8" y="22" width="1" height="8" fill="#7dd3fc" opacity="0.5"/><rect x="2" y="30" width="1" height="5" fill="#bae6fd" opacity="0.4"/></pattern>` },
  { key:"cs13", patternId:"cs13p", patternDefs:`<pattern id="cs13p" patternUnits="userSpaceOnUse" width="20" height="20"><rect width="20" height="20" fill="#022c22"/><line x1="4" y1="0" x2="4" y2="8" stroke="#10b981" stroke-width="1"/><line x1="4" y1="8" x2="16" y2="8" stroke="#10b981" stroke-width="1"/><line x1="16" y1="8" x2="16" y2="20" stroke="#10b981" stroke-width="1"/><line x1="0" y1="14" x2="8" y2="14" stroke="#6ee7b7" stroke-width="0.5"/><circle cx="4" cy="8" r="1.5" fill="#34d399"/><circle cx="16" cy="8" r="1.5" fill="#34d399"/><circle cx="8" cy="14" r="1" fill="#6ee7b7"/></pattern>` },
  { key:"cs14", patternId:"cs14p", patternDefs:`<pattern id="cs14p" patternUnits="userSpaceOnUse" width="10" height="10"><rect width="10" height="10" fill="#052e16"/><rect x="0" y="0" width="4" height="6" fill="#16a34a" opacity="0.6"/><rect x="1" y="1" width="2" height="4" fill="#4ade80" opacity="0.4"/><rect x="5" y="3" width="4" height="5" fill="#15803d" opacity="0.7"/><rect x="6" y="4" width="2" height="3" fill="#86efac" opacity="0.3"/></pattern>` },
  { key:"cs15", patternId:"cs15p", patternDefs:`<pattern id="cs15p" patternUnits="userSpaceOnUse" width="30" height="30"><rect width="30" height="30" fill="#0f0a1e"/><circle cx="3" cy="5" r="0.7" fill="white" opacity="0.9"/><circle cx="15" cy="2" r="1" fill="white" opacity="0.8"/><circle cx="24" cy="8" r="0.5" fill="white" opacity="0.7"/><circle cx="7" cy="18" r="0.8" fill="white" opacity="0.9"/><circle cx="20" cy="20" r="1.2" fill="white" opacity="0.6"/><circle cx="28" cy="25" r="0.6" fill="white" opacity="0.8"/><circle cx="12" cy="27" r="0.5" fill="#a5b4fc" opacity="0.7"/><circle cx="22" cy="13" r="0.4" fill="#fbcfe8" opacity="0.8"/><circle cx="5" cy="28" r="0.9" fill="white" opacity="0.6"/></pattern>` },
  { key:"cs16", patternId:"cs16p", patternDefs:`<pattern id="cs16p" patternUnits="userSpaceOnUse" width="16" height="16"><rect width="16" height="16" fill="#1a0a16"/><line x1="0" y1="0" x2="16" y2="0" stroke="#f0abfc" stroke-width="0.6"/><line x1="0" y1="8" x2="16" y2="8" stroke="#e879f9" stroke-width="0.3" opacity="0.5"/><line x1="0" y1="0" x2="0" y2="16" stroke="#f0abfc" stroke-width="0.6"/><line x1="8" y1="0" x2="8" y2="16" stroke="#e879f9" stroke-width="0.3" opacity="0.5"/><circle cx="0" cy="0" r="1" fill="#f0abfc"/><circle cx="16" cy="0" r="1" fill="#f0abfc"/><circle cx="0" cy="16" r="1" fill="#f0abfc"/><circle cx="16" cy="16" r="1" fill="#f0abfc"/></pattern>` },
  { key:"cs17", patternId:"cs17p", patternDefs:`<pattern id="cs17p" patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(45)"><rect width="16" height="16" fill="#0c4a6e"/><rect width="8" height="8" fill="#0ea5e9" opacity="0.5"/><rect x="8" y="8" width="8" height="8" fill="#7dd3fc" opacity="0.4"/><rect y="0" width="8" height="4" fill="#bae6fd" opacity="0.3"/><rect x="8" y="12" width="8" height="4" fill="#e0f2fe" opacity="0.3"/></pattern>` },
  { key:"cs18", patternId:"cs18p", patternDefs:`<pattern id="cs18p" patternUnits="userSpaceOnUse" width="16" height="16"><rect width="16" height="16" fill="#7c2d12"/><rect width="5" height="5" fill="#9a3412" opacity="0.7"/><rect x="7" y="2" width="4" height="4" fill="#c2410c" opacity="0.6"/><rect x="3" y="9" width="6" height="4" fill="#ea580c" opacity="0.5"/><rect x="11" y="7" width="5" height="5" fill="#78350f" opacity="0.8"/><rect x="1" y="13" width="4" height="3" fill="#dc2626" opacity="0.4"/><rect x="9" y="11" width="3" height="5" fill="#9a3412" opacity="0.7"/></pattern>` },
  { key:"cs19", patternId:"cs19p", patternDefs:`<pattern id="cs19p" patternUnits="userSpaceOnUse" width="42" height="7"><rect width="6" height="7" fill="#ef4444"/><rect x="6" width="6" height="7" fill="#f97316"/><rect x="12" width="6" height="7" fill="#eab308"/><rect x="18" width="6" height="7" fill="#22c55e"/><rect x="24" width="6" height="7" fill="#3b82f6"/><rect x="30" width="6" height="7" fill="#8b5cf6"/><rect x="36" width="6" height="7" fill="#ec4899"/></pattern>` },
  { key:"cs20", patternId:"cs20p", patternDefs:`<pattern id="cs20p" patternUnits="userSpaceOnUse" width="8" height="8"><rect width="2" height="2" fill="#ef4444"/><rect x="2" y="0" width="2" height="2" fill="#3b82f6"/><rect x="4" y="0" width="2" height="2" fill="#22c55e"/><rect x="6" y="0" width="2" height="2" fill="#f59e0b"/><rect x="0" y="2" width="2" height="2" fill="#8b5cf6"/><rect x="2" y="2" width="2" height="2" fill="#ec4899"/><rect x="4" y="2" width="2" height="2" fill="#14b8a6"/><rect x="6" y="2" width="2" height="2" fill="#ef4444"/><rect x="0" y="4" width="2" height="2" fill="#f97316"/><rect x="2" y="4" width="2" height="2" fill="#22c55e"/><rect x="4" y="4" width="2" height="2" fill="#3b82f6"/><rect x="6" y="4" width="2" height="2" fill="#a855f7"/><rect x="0" y="6" width="2" height="2" fill="#10b981"/><rect x="2" y="6" width="2" height="2" fill="#f59e0b"/><rect x="4" y="6" width="2" height="2" fill="#ec4899"/><rect x="6" y="6" width="2" height="2" fill="#06b6d4"/></pattern>` },
]

const CUSTOM_TOP_SVGS: Record<string, string> = {
  ctop_star:      `<line x1="91" y1="44" x2="91" y2="28" stroke="#9CA3AF" stroke-width="3"/><polygon points="91,4 94,12 103,12 96,18 98,26 91,21 84,26 86,18 79,12 88,12" fill="#FCD34D" stroke="#D97706" stroke-width="1"/>`,
  ctop_crown:     `<path d="M66,44 L66,28 L78,36 L91,8 L104,36 L116,28 L116,44 Z" fill="#FCD34D" stroke="#D97706" stroke-width="1.5"/><rect x="66" y="41" width="50" height="4" rx="1" fill="#E5A012"/>`,
  ctop_lightning: `<path d="M88,6 L78,22 L89,22 L82,44 L104,18 L93,18 L100,6 Z" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/>`,
  ctop_satellite: `<line x1="91" y1="44" x2="91" y2="30" stroke="#6B7280" stroke-width="3"/><path d="M67,26 Q81,8 107,16 Q99,34 67,26 Z" fill="#D1D5DB" stroke="#6B7280" stroke-width="1.5"/><circle cx="75" cy="12" r="4" fill="#60A5FA"/><circle cx="91" cy="30" r="2" fill="#374151"/>`,
  ctop_wifi:      `<circle cx="91" cy="44" r="5" fill="#2563EB"/><path d="M79,39 Q91,27 103,39" fill="none" stroke="#60A5FA" stroke-width="3.5" stroke-linecap="round"/><path d="M69,32 Q91,14 113,32" fill="none" stroke="#93C5FD" stroke-width="3" stroke-linecap="round" opacity="0.8"/><path d="M59,25 Q91,1 123,25" fill="none" stroke="#BFDBFE" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>`,
  ctop_propeller: `<line x1="91" y1="44" x2="91" y2="30" stroke="#6B7280" stroke-width="3"/><ellipse cx="91" cy="8" rx="5" ry="10" fill="#60A5FA" opacity="0.9"/><ellipse cx="101" cy="18" rx="10" ry="5" fill="#34D399" opacity="0.9"/><ellipse cx="91" cy="28" rx="5" ry="10" fill="#60A5FA" opacity="0.9"/><ellipse cx="81" cy="18" rx="10" ry="5" fill="#34D399" opacity="0.9"/><circle cx="91" cy="18" r="5" fill="#4B5563" stroke="#9CA3AF" stroke-width="2"/>`,
  ctop_eyestalk:  `<line x1="91" y1="44" x2="91" y2="30" stroke="#6B7280" stroke-width="3"/><ellipse cx="91" cy="18" rx="14" ry="11" fill="white" stroke="#374151" stroke-width="2"/><circle cx="91" cy="18" r="8" fill="#4338CA"/><circle cx="91" cy="18" r="4" fill="#1E1B4B"/><circle cx="95" cy="14" r="2.5" fill="white"/>`,
  ctop_halo:      `<line x1="91" y1="44" x2="91" y2="28" stroke="#D1D5DB" stroke-width="2.5" opacity="0.8"/><ellipse cx="91" cy="16" rx="24" ry="8" fill="rgba(252,211,77,0.1)"/><ellipse cx="91" cy="16" rx="24" ry="8" fill="none" stroke="#FCD34D" stroke-width="5" opacity="0.95"/><ellipse cx="91" cy="16" rx="24" ry="8" fill="none" stroke="white" stroke-width="2" opacity="0.6"/>`,
}

const svgCache = new Map<string, string>()

async function fetchSvgText(url: string): Promise<string> {
  if (svgCache.has(url)) return svgCache.get(url)!
  const res = await fetch(url)
  const text = await res.text()
  svgCache.set(url, text)
  return text
}

function buildRobotUrl(cfg: RobotConfig): string {
  const noTop = cfg.top === "none" || cfg.top.startsWith("ctop_")
  const topParam = noTop ? "&topProbability=0" : `&top[]=${cfg.top}`
  return (
    `https://api.dicebear.com/9.x/bottts/svg?seed=${cfg.textureKey}&colorful=true` +
    `&face[]=${cfg.face}&eyes[]=${cfg.eyes}${topParam}` +
    `&sides[]=${cfg.sides}&mouth[]=${cfg.mouth}&textureProbability=0`
  )
}

function patchSvg(svgText: string, skin: CustomSkin): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, "image/svg+xml")
  const svg = doc.documentElement
  let defs = svg.querySelector("defs")
  if (!defs) {
    defs = doc.createElementNS("http://www.w3.org/2000/svg", "defs")
    svg.prepend(defs)
  }
  const range = doc.createRange()
  range.selectNode(defs)
  defs.appendChild(range.createContextualFragment(skin.patternDefs))
  svg.querySelectorAll("path").forEach(p => {
    if ((p.getAttribute("d") ?? "").trimStart().startsWith("M-")) {
      p.setAttribute("fill", `url(#${skin.patternId})`)
    }
  })
  return new XMLSerializer().serializeToString(doc)
}

function patchTopSvg(svgText: string, topElements: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, "image/svg+xml")
  const svg = doc.documentElement
  const range = doc.createRange()
  range.selectNode(svg)
  svg.appendChild(range.createContextualFragment(topElements))
  return new XMLSerializer().serializeToString(doc)
}

export default function UserRobot({ config, size = 120 }: { config: RobotConfig; size?: number }) {
  const [src, setSrc] = useState("")

  useEffect(() => {
    const skin = CUSTOM_SKINS.find(s => s.key === config.textureKey)
    if (!skin) return
    const topSvg = config.top.startsWith("ctop_") ? CUSTOM_TOP_SVGS[config.top] : undefined
    let cancelled = false
    fetchSvgText(buildRobotUrl(config))
      .then(svgText => {
        if (cancelled) return
        let patched = patchSvg(svgText, skin)
        if (topSvg) patched = patchTopSvg(patched, topSvg)
        setSrc(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(patched)}`)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [config])

  if (!src) return <div style={{ width: size, height: size }} />

  return (
    <>
      <style>{`
        @keyframes user-robot-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        .user-robot-float {
          animation: user-robot-float 3s ease-in-out infinite;
          display: block;
        }
      `}</style>
      <img
        src={src}
        alt="Your robot"
        width={size}
        height={size}
        className="user-robot-float"
        style={{ filter: "drop-shadow(0 8px 20px rgba(99,102,241,0.5))" }}
      />
    </>
  )
}
