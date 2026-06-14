"use client"

import { useState, useRef } from "react"

interface PersonaData {
  ageRange: string
  interests: string[]
  location: string
  problemSolved: string
  customNotes: string
  spending: string
  shopWhere: string
  influencedBy: string
  motivation: string
  lifestyle: string
  reachHow: string
}

const AGE_RANGES = ["Under 10", "10–14", "15–19", "20–29", "30–39", "40–49", "50–59", "60+"]
const INTEREST_OPTIONS = ["Music", "Sports", "Gaming", "Art", "Fashion", "Food", "Tech", "Outdoors", "Animals", "Reading", "Movies", "Crafts", "Travel", "Fitness"]
const SPENDING_OPTIONS = ["Under $10", "$10–$25", "$25–$50", "$50–$100", "$100+"]
const SHOP_WHERE_OPTIONS = ["Online (website)", "Instagram / TikTok", "Local market", "School canteen", "Shopping centre", "Friend recommendation"]
const INFLUENCED_BY_OPTIONS = ["Friends", "Social media influencers", "Parents", "Teachers / coaches", "Online ads", "Celebrities"]

const DEMO_ANSWERS: Partial<Record<keyof PersonaData, string>> = {
  location: "Local schools and community markets, plus online via Instagram and Etsy — mainly students and young adults in the surrounding area.",
  problemSolved: "Students want a quiet, satisfying fidget toy they can use in class without disturbing others. Our 3D printed designs are silent, colourful, and fully customisable — unlike boring mass-produced toys.",
  motivation: "They want something that feels unique and personal. Being able to pick colours and designs makes them feel like they own something nobody else has. It's also a conversation starter.",
  lifestyle: "Mostly students aged 10–19 who spend time on TikTok and YouTube after school, attend class daily, and love collecting cool accessories or personalised items that reflect their personality.",
  reachHow: "Short TikTok and Instagram Reels showing the 3D printing process and the finished product. School markets and local craft fairs for in-person sales. Word of mouth from happy customers showing off their fidgets to friends.",
}

interface Props {
  initialData?: Partial<PersonaData>
  readOnly?: boolean
  teacherMode?: boolean
}

export default function PersonaBuilder({ initialData, readOnly = false, teacherMode = false }: Props) {
  const [data, setData] = useState<PersonaData>({
    ageRange:     initialData?.ageRange     ?? "",
    interests:    initialData?.interests    ?? [],
    location:     initialData?.location     ?? "",
    problemSolved: initialData?.problemSolved ?? "",
    customNotes:  initialData?.customNotes  ?? "",
    spending:     initialData?.spending     ?? "",
    shopWhere:    initialData?.shopWhere    ?? "",
    influencedBy: initialData?.influencedBy ?? "",
    motivation:   initialData?.motivation   ?? "",
    lifestyle:    initialData?.lifestyle    ?? "",
    reachHow:     initialData?.reachHow     ?? "",
  })
  const [step, setStep] = useState(0)
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle")
  const [badge, setBadge] = useState<{ name: string; emoji: string } | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function save(updated: PersonaData) {
    if (readOnly) return
    setSaveState("saving")
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const res = await fetch("/api/target-market", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
      setSaveState("saved")
      if (res.ok) {
        const json = await res.json()
        if (json.badge) setBadge(json.badge)
      }
    }, 800)
  }

  function update(field: keyof PersonaData, value: string | string[]) {
    const updated = { ...data, [field]: value }
    setData(updated)
    save(updated)
  }

  function toggleInterest(interest: string) {
    const updated = data.interests.includes(interest)
      ? data.interests.filter((i) => i !== interest)
      : [...data.interests, interest]
    update("interests", updated)
  }

  function fillDemo(field: keyof PersonaData) {
    const val = DEMO_ANSWERS[field]
    if (val) update(field, val)
  }

  function PencilBtn({ field }: { field: keyof PersonaData }) {
    if (readOnly || !teacherMode) return null
    return (
      <button
        onClick={() => fillDemo(field)}
        title="Fill demo answer"
        className="ml-auto flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl transition-all hover:opacity-80"
        style={{ background: "#FFF7ED", color: "#F97316", border: "1px solid #FED7AA" }}
      >
        ✏️ Demo
      </button>
    )
  }

  function ChipGroup({
    options,
    selected,
    field,
    multi = false,
  }: {
    options: string[]
    selected: string | string[]
    field: keyof PersonaData
    multi?: boolean
  }) {
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = multi
            ? (selected as string[]).includes(opt)
            : selected === opt
          return (
            <button
              key={opt}
              disabled={readOnly}
              onClick={() => {
                if (multi) {
                  const arr = selected as string[]
                  update(field, isSelected ? arr.filter((x) => x !== opt) : [...arr, opt])
                } else {
                  update(field, opt)
                }
              }}
              className="py-2 px-4 rounded-full text-sm font-bold border-2 transition-all"
              style={{
                borderColor: isSelected ? "#F97316" : "#E2E8F0",
                background:  isSelected ? "#FFF7ED" : "white",
                color:        isSelected ? "#C2410C" : "#475569",
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    )
  }

  function OpenField({
    field,
    placeholder,
  }: {
    field: keyof PersonaData
    placeholder: string
  }) {
    return (
      <div>
        <div className="flex items-center mb-2">
          <PencilBtn field={field} />
        </div>
        <textarea
          disabled={readOnly}
          value={data[field] as string}
          onChange={(e) => update(field, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium resize-none focus:outline-none"
          style={{ borderColor: "#E2E8F0", color: "#1E293B", minHeight: "100px" }}
        />
      </div>
    )
  }

  const steps = [
    {
      title: "How old are they?",
      emoji: "🎂",
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AGE_RANGES.map((range) => (
            <button
              key={range}
              disabled={readOnly}
              onClick={() => update("ageRange", range)}
              className="py-3 px-4 rounded-2xl text-sm font-bold border-2 transition-all"
              style={{
                borderColor: data.ageRange === range ? "#F97316" : "#E2E8F0",
                background:  data.ageRange === range ? "#FFF7ED" : "white",
                color:        data.ageRange === range ? "#C2410C" : "#475569",
              }}
            >
              {range}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "What are they interested in?",
      emoji: "❤️",
      content: <ChipGroup options={INTEREST_OPTIONS} selected={data.interests} field="interests" multi />,
    },
    {
      title: "Where are they?",
      emoji: "📍",
      content: <OpenField field="location" placeholder="e.g. Local neighbourhood, school area, downtown, online..." />,
    },
    {
      title: "What problem do you solve for them?",
      emoji: "💡",
      content: <OpenField field="problemSolved" placeholder="e.g. They want a fun fidget toy but can't find one they like..." />,
    },
    {
      title: "How much would they spend?",
      emoji: "💸",
      content: <ChipGroup options={SPENDING_OPTIONS} selected={data.spending} field="spending" />,
    },
    {
      title: "Where do they shop?",
      emoji: "🛍️",
      content: <ChipGroup options={SHOP_WHERE_OPTIONS} selected={data.shopWhere} field="shopWhere" />,
    },
    {
      title: "Who influences their buying decisions?",
      emoji: "👥",
      content: <ChipGroup options={INFLUENCED_BY_OPTIONS} selected={data.influencedBy} field="influencedBy" />,
    },
    {
      title: "What motivates them to buy?",
      emoji: "🌟",
      content: <OpenField field="motivation" placeholder="e.g. They want something unique, they love collecting, peer pressure from friends..." />,
    },
    {
      title: "Describe their typical day",
      emoji: "🏃",
      content: <OpenField field="lifestyle" placeholder="e.g. Goes to school, plays sport after, scrolls TikTok in the evening..." />,
    },
    {
      title: "How will you reach them?",
      emoji: "📣",
      content: <OpenField field="reachHow" placeholder="e.g. Instagram Reels, school markets, word of mouth, Etsy shop..." />,
    },
  ]

  return (
    <div className="space-y-5">
      {/* Step indicators */}
      <div className="flex items-center gap-1 flex-wrap">
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} className="flex items-center gap-1">
            <div
              className="w-8 h-8 rounded-full text-sm font-black flex items-center justify-center transition-all"
              style={{
                background: i <= step ? "#F97316" : "#F1F5F9",
                color: i <= step ? "white" : "#94A3B8",
              }}
            >
              {i < step ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="w-4 h-0.5" style={{ background: i < step ? "#F97316" : "#E2E8F0" }} />
            )}
          </button>
        ))}
        <span className="ml-3 text-xs font-bold" style={{ color: saveState === "saved" ? "#22C55E" : "#94A3B8" }}>
          {saveState === "saved" ? "✓ Saved" : saveState === "saving" ? "Saving..." : ""}
        </span>
      </div>

      {/* Step card */}
      <div className="rounded-3xl border p-6" style={{ background: "white", borderColor: "#E2E8F0" }}>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">{steps[step].emoji}</span>
          <h2 className="text-xl font-black" style={{ color: "#1E293B" }}>{steps[step].title}</h2>
          <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full" style={{ background: "#FFF7ED", color: "#F97316" }}>
            {step + 1} / {steps.length}
          </span>
        </div>
        {steps[step].content}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="px-5 py-2.5 rounded-2xl font-bold text-sm" style={{ background: "#F1F5F9", color: "#64748B" }}>
            ← Back
          </button>
        )}
        {step < steps.length - 1 && (
          <button onClick={() => setStep(step + 1)} className="px-5 py-2.5 rounded-2xl font-bold text-sm text-white" style={{ background: "#F97316" }}>
            Next →
          </button>
        )}
      </div>

      {/* Summary card */}
      {(data.ageRange || data.interests.length > 0 || data.problemSolved) && (
        <div className="rounded-3xl p-6 border-2" style={{ background: "#FFF7ED", borderColor: "#F97316" }}>
          <div className="font-black text-lg mb-3" style={{ color: "#C2410C" }}>Your Customer Persona 🧑</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {data.ageRange      && <Detail label="Age"                value={data.ageRange} />}
            {data.interests.length > 0 && <Detail label="Interests"  value={data.interests.join(", ")} />}
            {data.location      && <Detail label="Location"           value={data.location} />}
            {data.problemSolved && <Detail label="Problem solved"     value={data.problemSolved} />}
            {data.spending      && <Detail label="Spending"           value={data.spending} />}
            {data.shopWhere     && <Detail label="Shops at"           value={data.shopWhere} />}
            {data.influencedBy  && <Detail label="Influenced by"      value={data.influencedBy} />}
            {data.motivation    && <Detail label="Motivation"         value={data.motivation} />}
            {data.lifestyle     && <Detail label="Lifestyle"          value={data.lifestyle} />}
            {data.reachHow      && <Detail label="How to reach"       value={data.reachHow} />}
          </div>
        </div>
      )}

      {badge && (
        <div className="fixed bottom-6 right-6 z-50 p-5 rounded-3xl shadow-2xl" style={{ background: "linear-gradient(135deg, #F97316, #EF4444)" }}>
          <div className="text-4xl text-center mb-2">{badge.emoji}</div>
          <div className="text-white font-black text-center">Badge Earned!</div>
          <div className="text-white/80 text-center font-semibold mt-1">{badge.name}</div>
          <button onClick={() => setBadge(null)} className="mt-3 w-full text-center text-sm text-white/60 font-bold">Dismiss</button>
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: "#F97316" }}>{label}</div>
      <div className="font-semibold" style={{ color: "#1E293B" }}>{value}</div>
    </div>
  )
}
