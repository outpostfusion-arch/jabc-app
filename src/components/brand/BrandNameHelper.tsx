"use client"

import { useState } from "react"

function generateNames(keywords: string[]): string[] {
  const words = keywords.map((k) => k.trim().toLowerCase()).filter(Boolean)
  if (words.length === 0) return []

  const results: string[] = []
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  // Portmanteau: blend first half of word1 + second half of word2
  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words.length; j++) {
      if (i !== j) {
        const a = words[i].slice(0, Math.ceil(words[i].length / 2))
        const b = words[j].slice(Math.floor(words[j].length / 2))
        results.push(cap(a + b))
      }
    }
  }

  // Adjective + Noun combos
  const adjectives = ["Bright", "Bold", "Spark", "Swift", "Peak", "Nova", "Glow", "Flux", "Rise", "Keen"]
  for (const word of words) {
    for (const adj of adjectives.slice(0, 3)) {
      results.push(`${adj} ${cap(word)}`)
    }
  }

  // Acronym
  if (words.length >= 2) {
    const acronym = words.map((w) => w[0].toUpperCase()).join("")
    results.push(acronym + "Co")
    results.push(acronym + "Labs")
  }

  // Word + suffix
  const suffixes = ["Hub", "Studio", "Works", "Co", "Lab", "Box", "Craft"]
  for (const word of words.slice(0, 2)) {
    for (const suffix of suffixes.slice(0, 3)) {
      results.push(cap(word) + suffix)
    }
  }

  return [...new Set(results)].slice(0, 12)
}

interface Props {
  onSelect?: (name: string) => void
}

export default function BrandNameHelper({ onSelect }: Props) {
  const [keywords, setKeywords] = useState(["", "", ""])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [chosen, setChosen] = useState<string | null>(null)

  function generate() {
    setSuggestions(generateNames(keywords))
  }

  function pick(name: string) {
    setChosen(name)
    onSelect?.(name)
  }

  return (
    <div className="rounded-3xl border p-5" style={{ background: "white", borderColor: "#E2E8F0" }}>
      <h3 className="font-black text-lg mb-1" style={{ color: "#1E293B" }}>✨ Brand Name Helper</h3>
      <p className="text-sm mb-4 font-medium" style={{ color: "#64748B" }}>Enter 3 words that describe your brand — we&apos;ll mix them into name ideas!</p>

      <div className="flex gap-2 mb-3 flex-wrap">
        {keywords.map((k, i) => (
          <input
            key={i}
            value={k}
            onChange={(e) => {
              const next = [...keywords]
              next[i] = e.target.value
              setKeywords(next)
            }}
            placeholder={["e.g. fast", "e.g. green", "e.g. craft"][i]}
            className="flex-1 min-w-[100px] px-3 py-2 rounded-xl border text-sm font-medium focus:outline-none"
            style={{ borderColor: "#E2E8F0", color: "#1E293B" }}
          />
        ))}
        <button onClick={generate} className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "#6366F1" }}>
          Generate
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestions.map((name) => (
            <button
              key={name}
              onClick={() => pick(name)}
              className="px-3 py-1.5 rounded-full text-sm font-bold border-2 transition-all"
              style={{
                borderColor: chosen === name ? "#6366F1" : "#E2E8F0",
                background: chosen === name ? "#EEF2FF" : "white",
                color: chosen === name ? "#4338CA" : "#475569",
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {chosen && (
        <div className="mt-3 p-3 rounded-2xl flex items-center gap-2" style={{ background: "#EEF2FF" }}>
          <span className="text-lg">🎉</span>
          <span className="font-black" style={{ color: "#4338CA" }}>Selected: {chosen}</span>
        </div>
      )}
    </div>
  )
}
