"use client"

import { useState, useCallback, useRef } from "react"
import BMCBlock from "./BMCBlock"

const NAME_POOL = [
  "SpinForge", "TwistLab", "PolyTwist", "FidgetFoundry", "LayerLoop",
  "ClickCraft 3D", "GripPrint Co.", "NozzleSpin", "PrintWiggle", "SpoolSpin",
  "OrbitalFidget", "GearGrip Studio", "TactileTech 3D", "FilamentFun", "PrimeFidget",
  "SnapSpin Studio", "LoopLayer", "FidgetForge", "SpinSlab", "PrintPlay Co.",
]

const TAGLINE_STYLES = [
  {
    label: "Funny", emoji: "😄",
    pool: [
      "Warning: may cause excessive spinning.",
      "Our fidgets: 100% printed, 0% boring.",
      "Fidget so hard your friends get jealous.",
      "We print fun. You print nothing.",
      "Your thumbs called. They want this.",
      "Layer by layer, stress by stress.",
      "Made with filament and zero chill.",
      "Spinning since the printer started.",
    ],
  },
  {
    label: "Exciting", emoji: "⚡",
    pool: [
      "Spin faster. Go further. Play harder.",
      "The fidget revolution starts here.",
      "Break limits. Not fidgets.",
      "3D printed for the next level.",
      "Unleash your hands.",
      "Built for those who never sit still.",
      "Power up your palms.",
      "The future of fidget is printed.",
    ],
  },
  {
    label: "Bold", emoji: "🔥",
    pool: [
      "No stress survives our fidgets.",
      "Engineered for the relentless.",
      "Print. Dominate. Repeat.",
      "Not just a fidget. A statement.",
      "The strongest spin in 3D.",
      "Zero tolerance for boring hands.",
      "Own your fidget. Own your focus.",
      "Maximum grip. Maximum impact.",
    ],
  },
  {
    label: "Cool", emoji: "😎",
    pool: [
      "Printed different.",
      "Fidgets that actually look good.",
      "Layer up. Stand out.",
      "The fidget you'll actually show off.",
      "Custom cool, straight off the printer.",
      "3D printed street cred.",
      "Spin it like you mean it.",
      "For hands with taste.",
    ],
  },
  {
    label: "Friendly", emoji: "😊",
    pool: [
      "A fidget made just for you.",
      "Happy hands, happy you.",
      "We print smiles, one layer at a time.",
      "The fidget that feels like home.",
      "Crafted with care, played with love.",
      "Your new favourite thing to hold.",
      "Fidgets the whole family will love.",
      "Because everyone deserves a little joy.",
    ],
  },
]

function pickFive(pool: string[], exclude: string[]): string[] {
  const available = pool.filter((x) => !exclude.includes(x))
  const source = available.length >= 5 ? available : pool
  const shuffled = [...source].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 5)
}

export interface BMCData {
  keyPartners: string[]
  keyActivities: string[]
  keyResources: string[]
  valueProposition: string[]
  customerRelations: string[]
  channels: string[]
  customerSegments: string[]
  costStructure: string[]
  revenueStreams: string[]
  businessName: string
  tagline: string
}

type BlockKey = keyof Omit<BMCData, "businessName" | "tagline">

const BLOCK_CONFIG: {
  key: BlockKey; label: string; hint: string; emoji: string
  color: string; border: string; shadow: string
  example: string[]; demo: string[]
}[] = [
  {
    key: "keyPartners", label: "Key Partners", emoji: "🤝",
    hint: "Who helps you run your business? (suppliers, collaborators)",
    color: "linear-gradient(135deg,#EDE9FE,#C4B5FD)", border: "#A78BFA", shadow: "rgba(139,92,246,0.28)",
    example: ["Grocery store (lemons)", "Sugar supplier", "Cup manufacturer"],
    demo: ["3D filament suppliers (PLA & TPU)", "Local makerspaces for bulk printing", "Online marketplaces (Etsy, Amazon)"],
  },
  {
    key: "keyActivities", label: "Key Activities", emoji: "⚡",
    hint: "What do you DO each day?",
    color: "linear-gradient(135deg,#FEF3C7,#FDE68A)", border: "#FCD34D", shadow: "rgba(251,191,36,0.30)",
    example: ["Squeezing lemons", "Mixing lemonade", "Selling at the stand"],
    demo: ["Designing new fidget models in CAD", "3D printing & quality checking parts", "Packaging and shipping orders"],
  },
  {
    key: "keyResources", label: "Key Resources", emoji: "🔧",
    hint: "What do you NEED? (tools, materials, money, people)",
    color: "linear-gradient(135deg,#D1FAE5,#6EE7B7)", border: "#34D399", shadow: "rgba(52,211,153,0.28)",
    example: ["Lemons & sugar", "Pitcher & cups", "Table & sign", "Ice & water"],
    demo: ["FDM 3D printers (Bambu Lab X1)", "PLA & TPU filament rolls", "CAD design software (Fusion 360)"],
  },
  {
    key: "valueProposition", label: "Value Proposition", emoji: "💎",
    hint: "Why should customers choose YOU?",
    color: "linear-gradient(135deg,#E0E7FF,#A5B4FC)", border: "#6366F1", shadow: "rgba(99,102,241,0.30)",
    example: ["Fresh cold lemonade", "Affordable — only $1", "Fun summer treat", "Made with real lemons"],
    demo: ["Customizable fidgets — any colour or shape", "Affordable price point ($8–$15)", "Locally made with fast turnaround"],
  },
  {
    key: "customerRelations", label: "Customer Relationships", emoji: "❤️",
    hint: "How do you connect with customers? (friendly service, follow-ups)",
    color: "linear-gradient(135deg,#FFE4E6,#FECDD3)", border: "#FB7185", shadow: "rgba(251,113,133,0.28)",
    example: ["Friendly smile & chat", "Free sample to try", "Remember regular customers"],
    demo: ["Custom orders via Instagram DMs", "Loyalty discount for repeat buyers", "Unboxing tutorials on TikTok"],
  },
  {
    key: "channels", label: "Channels", emoji: "📣",
    hint: "How do customers find and buy from you?",
    color: "linear-gradient(135deg,#FEF9C3,#FDE047)", border: "#FACC15", shadow: "rgba(250,204,21,0.30)",
    example: ["Roadside stand", "Word of mouth", "Flyers in the neighbourhood"],
    demo: ["Etsy shop for online sales", "School market days & craft fairs", "Instagram & TikTok marketing"],
  },
  {
    key: "customerSegments", label: "Customer Segments", emoji: "👥",
    hint: "Who are your customers? Describe them!",
    color: "linear-gradient(135deg,#E0F2FE,#7DD3FC)", border: "#38BDF8", shadow: "rgba(56,189,248,0.28)",
    example: ["Neighbours out for a walk", "Kids playing outside", "People driving by on hot days"],
    demo: ["Students ages 10–18 needing focus tools", "Parents buying gifts for kids", "Teachers looking for classroom tools"],
  },
  {
    key: "costStructure", label: "Cost Structure", emoji: "💸",
    hint: "What does it cost to run your business?",
    color: "linear-gradient(135deg,#FFEDD5,#FED7AA)", border: "#FB923C", shadow: "rgba(251,146,60,0.28)",
    example: ["Lemons & sugar (~$3)", "Cups & napkins (~$2)", "Poster board for sign (~$1)"],
    demo: ["Filament ~$25/kg (1 spool/week)", "Electricity for running 3D printers", "Packaging & shipping supplies"],
  },
  {
    key: "revenueStreams", label: "Revenue Streams", emoji: "💰",
    hint: "How does your business make money?",
    color: "linear-gradient(135deg,#DCFCE7,#86EFAC)", border: "#4ADE80", shadow: "rgba(74,222,128,0.28)",
    example: ["Small cup — $1", "Large cup — $2", "Lemonade bundle (3 cups) — $2.50"],
    demo: ["Single fidgets sold for $8–$15", "Custom colour orders — $18–$25", "Bundle packs of 3 for $35"],
  },
]

interface Props {
  initialData?: Partial<BMCData>
  readOnly?: boolean
  teacherMode?: boolean
}

const EMPTY: BMCData = {
  keyPartners: [], keyActivities: [], keyResources: [],
  valueProposition: [], customerRelations: [], channels: [],
  customerSegments: [], costStructure: [], revenueStreams: [],
  businessName: "", tagline: "",
}

export default function BMCCanvas({ initialData, readOnly = false, teacherMode = false }: Props) {
  const [data, setData] = useState<BMCData>({ ...EMPTY, ...initialData })
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [badge, setBadge] = useState<{ name: string; emoji: string } | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [nameSuggestions, setNameSuggestions] = useState<string[]>([])
  const [taglineSuggestions, setTaglineSuggestions] = useState<string[]>([])
  const [activeStyle, setActiveStyle] = useState<string | null>(null)
  const lastNames = useRef<string[]>([])
  const lastTaglinesByStyle = useRef<Record<string, string[]>>({})

  function generateNames() {
    const picks = pickFive(NAME_POOL, lastNames.current)
    lastNames.current = picks
    setNameSuggestions(picks)
  }

  function generateTaglines(styleLabel: string) {
    const style = TAGLINE_STYLES.find((s) => s.label === styleLabel)!
    const prev = lastTaglinesByStyle.current[styleLabel] ?? []
    const picks = pickFive(style.pool, prev)
    lastTaglinesByStyle.current[styleLabel] = picks
    setActiveStyle(styleLabel)
    setTaglineSuggestions(picks)
  }

  const save = useCallback(async (updated: BMCData) => {
    if (readOnly) return
    setSaveState("saving")
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/bmc", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        })
        if (res.ok) {
          const json = await res.json()
          setSaveState("saved")
          if (json.badge) setBadge(json.badge)
        } else {
          setSaveState("error")
        }
      } catch {
        setSaveState("error")
      }
    }, 600)
  }, [readOnly])

  function updateBlock(key: BlockKey, items: string[]) {
    const updated = { ...data, [key]: items }
    setData(updated)
    save(updated)
  }

  function updateMeta(field: "businessName" | "tagline", value: string) {
    const updated = { ...data, [field]: value }
    setData(updated)
    save(updated)
  }

  const filledCount = BLOCK_CONFIG.filter((b) => data[b.key].length > 0).length

  return (
    <div>
      {/* Business name + tagline */}
      <div className="mb-5 p-5 rounded-3xl border" style={{ background: "white", borderColor: "#E2E8F0" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Business Name */}
          <div>
            <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: "#94A3B8" }}>Business Name</label>
            <input
              value={data.businessName}
              onChange={(e) => updateMeta("businessName", e.target.value)}
              disabled={readOnly}
              placeholder="What do you sell?"
              className="w-full px-4 py-2.5 rounded-xl border-2 font-bold text-sm focus:outline-none"
              style={{ borderColor: data.businessName ? "#6366F1" : "#E2E8F0", color: "#1E293B" }}
            />
            {!readOnly && (
              <div className="mt-2">
                <button
                  onClick={() => generateNames()}
                  className="px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}
                >
                  ✨ Generate Names
                </button>
                {nameSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {nameSuggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { updateMeta("businessName", s); setNameSuggestions([]) }}
                        className="px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105"
                        style={{ background: "#EEF2FF", color: "#4F46E5", border: "1.5px solid #C7D2FE" }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-black mb-1.5 uppercase tracking-wide" style={{ color: "#94A3B8" }}>Tagline</label>
            <input
              value={data.tagline}
              onChange={(e) => updateMeta("tagline", e.target.value)}
              disabled={readOnly}
              placeholder="Your catchy slogan..."
              className="w-full px-4 py-2.5 rounded-xl border-2 font-medium text-sm focus:outline-none"
              style={{ borderColor: data.tagline ? "#6366F1" : "#E2E8F0", color: "#1E293B" }}
            />
            {!readOnly && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1.5">
                  {TAGLINE_STYLES.map((style) => (
                    <button
                      key={style.label}
                      onClick={() => generateTaglines(style.label)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                      style={{
                        background: activeStyle === style.label ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : "#F1F5F9",
                        color: activeStyle === style.label ? "white" : "#475569",
                      }}
                    >
                      {style.emoji} {style.label}
                    </button>
                  ))}
                </div>
                {taglineSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {taglineSuggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { updateMeta("tagline", s); setTaglineSuggestions([]); setActiveStyle(null) }}
                        className="px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105"
                        style={{ background: "#EEF2FF", color: "#4F46E5", border: "1.5px solid #C7D2FE" }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(filledCount / 9) * 100}%`, background: "linear-gradient(90deg, #6366F1, #8B5CF6)" }}
          />
        </div>
        <span className="text-xs font-bold whitespace-nowrap" style={{ color: "#6366F1" }}>{filledCount}/9 blocks filled</span>

        {/* Save indicator */}
        <span className="text-xs font-semibold" style={{ color: saveState === "saved" ? "#22C55E" : saveState === "saving" ? "#94A3B8" : saveState === "error" ? "#F43F5E" : "transparent" }}>
          {saveState === "saving" ? "Saving..." : saveState === "saved" ? "✓ Saved" : saveState === "error" ? "⚠ Save failed" : "·"}
        </span>
      </div>

      {/* BMC Grid — uniform 3×3 */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {BLOCK_CONFIG.map((block) => (
          <BMCBlock
            key={block.key}
            config={block}
            items={data[block.key]}
            onChange={(v) => updateBlock(block.key, v)}
            example={block.example}
            demo={block.demo}
            teacherMode={teacherMode}
            readOnly={readOnly}
          />
        ))}
      </div>

      {/* Badge notification */}
      {badge && (
        <div className="fixed bottom-6 right-6 z-50 p-5 rounded-3xl shadow-2xl max-w-xs" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
          <div className="text-4xl text-center mb-2">{badge.emoji}</div>
          <div className="text-white font-black text-center text-lg">Badge Earned!</div>
          <div className="text-white/80 text-center font-semibold mt-1">{badge.name}</div>
          <button onClick={() => setBadge(null)} className="mt-3 w-full text-center text-sm text-white/60 font-bold">Dismiss</button>
        </div>
      )}
    </div>
  )
}
