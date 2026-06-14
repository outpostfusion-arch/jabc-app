"use client"

import { useState } from "react"

const PROMOTION_TYPES = [
  {
    type: "Social Media",
    emoji: "📱",
    description: "Post photos, videos, and stories on platforms like Instagram or TikTok to reach your audience.",
    example: "A student posts a video of their fidget toy spinning on TikTok — it goes viral!",
    cost: "Free",
    costColor: "#22C55E",
    best: "Reaching teens & young adults",
    color: "#EEF2FF",
    border: "#6366F1",
  },
  {
    type: "Flyers & Posters",
    emoji: "📋",
    description: "Print or hand-draw flyers with your product info and post them around school or the neighbourhood.",
    example: "Bright colourful posters near the gym advertising laser-cut earrings.",
    cost: "Very Low",
    costColor: "#22C55E",
    best: "Local neighbourhood, school",
    color: "#FFF7ED",
    border: "#F97316",
  },
  {
    type: "Word of Mouth",
    emoji: "🗣️",
    description: "Tell people about your business! Happy customers tell their friends, who tell their friends.",
    example: "A customer loves their earrings and recommends them to 5 friends.",
    cost: "Free",
    costColor: "#22C55E",
    best: "Building trust & loyalty",
    color: "#F0FDF4",
    border: "#22C55E",
  },
  {
    type: "Events & Demos",
    emoji: "🎪",
    description: "Set up a booth at a school fair or local market to show your product in person.",
    example: "Demonstrating the 3D printing process at the school science fair.",
    cost: "Low–Medium",
    costColor: "#F97316",
    best: "Showing off your product live",
    color: "#FDF4FF",
    border: "#A855F7",
  },
  {
    type: "Email Newsletter",
    emoji: "✉️",
    description: "Send email updates to customers who sign up, sharing new products and special deals.",
    example: "Weekly email to 50 subscribers showing new earring designs.",
    cost: "Low",
    costColor: "#22C55E",
    best: "Repeat customers",
    color: "#FFFBEB",
    border: "#FBBF24",
  },
  {
    type: "Sponsorship / Collab",
    emoji: "🤝",
    description: "Team up with another person or business to reach more customers together.",
    example: "Partner with the school art club to sell earrings at their gallery night.",
    cost: "Varies",
    costColor: "#64748B",
    best: "Reaching new audiences",
    color: "#FFF1F2",
    border: "#F43F5E",
  },
]

const QUIZ_QUESTIONS = [
  {
    q: "You have $0 and want to reach teens in your school. What's the best promotion?",
    options: ["Hire a TV ad", "Post on social media", "Mail catalogues", "Buy a billboard"],
    answer: 1,
    explanation: "Social media is free and teens are already on it — perfect!",
  },
  {
    q: "You want repeat customers who keep buying. What should you focus on?",
    options: ["Word of mouth only", "Email newsletter", "One big event", "Flyers everywhere"],
    answer: 1,
    explanation: "Email newsletters keep customers coming back with updates and deals.",
  },
  {
    q: "You're launching at the school fair next week. What promotion fits best?",
    options: ["Social media post", "TV commercial", "Events & Demos booth", "Sponsorship"],
    answer: 2,
    explanation: "An events booth lets people see and touch your product in person — perfect for a fair!",
  },
  {
    q: "A customer loves your fidget toy and tells 3 friends who each tell 3 more. What is this?",
    options: ["Email marketing", "Sponsorship", "Word of mouth", "Flyer campaign"],
    answer: 2,
    explanation: "Word of mouth spreads naturally when customers love what you make.",
  },
  {
    q: "Which promotion works best for building trust with people who don't know you yet?",
    options: ["Sending spam emails", "Paid TV ads", "Live demos at events", "Nothing"],
    answer: 2,
    explanation: "Live demos let people experience your product first-hand and builds real trust!",
  },
]

export default function PromotionExplorer() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [quizDone, setQuizDone] = useState(false)
  const [badge, setBadge] = useState<{ name: string; emoji: string } | null>(null)

  function handleAnswer(idx: number) {
    if (selected !== null) return
    setSelected(idx)
  }

  async function nextQuestion() {
    const newAnswers = [...answers, selected!]
    setAnswers(newAnswers)
    setSelected(null)
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setQuizDone(true)
      const score = newAnswers.filter((a, i) => a === QUIZ_QUESTIONS[i].answer).length
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: newAnswers, score }),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.badge) setBadge(json.badge)
      }
    }
  }

  const score = quizDone ? answers.filter((a, i) => a === QUIZ_QUESTIONS[i].answer).length : 0

  return (
    <div className="space-y-8">
      {/* Promotion Cards */}
      <div>
        <h2 className="text-xl font-black mb-4" style={{ color: "#1E293B" }}>Flip each card to learn! 👇</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROMOTION_TYPES.map((p, i) => (
            <div
              key={i}
              className="relative cursor-pointer select-none"
              style={{ minHeight: "160px", perspective: "1000px" }}
              onClick={() => setFlipped({ ...flipped, [i]: !flipped[i] })}
            >
              <div
                className="relative w-full h-full transition-all duration-500 rounded-3xl border-2"
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped[i] ? "rotateY(180deg)" : "rotateY(0deg)",
                  minHeight: "160px",
                  borderColor: p.border,
                  background: p.color,
                }}
              >
                {/* Front */}
                <div className="absolute inset-0 p-5 flex flex-col" style={{ backfaceVisibility: "hidden" }}>
                  <div className="text-3xl mb-2">{p.emoji}</div>
                  <div className="font-black text-lg mb-1" style={{ color: "#1E293B" }}>{p.type}</div>
                  <div className="text-xs font-bold mt-auto" style={{ color: "#94A3B8" }}>Tap to flip and learn →</div>
                </div>
                {/* Back */}
                <div className="absolute inset-0 p-4 flex flex-col" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "white", borderRadius: "inherit" }}>
                  <div className="font-black text-sm mb-1" style={{ color: p.border }}>{p.type}</div>
                  <p className="text-xs font-medium mb-2" style={{ color: "#475569" }}>{p.description}</p>
                  <div className="text-xs p-2 rounded-xl mb-2" style={{ background: "#F8FAFC" }}>
                    <span className="font-black" style={{ color: "#1E293B" }}>Example: </span>
                    <span style={{ color: "#64748B" }}>{p.example}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-auto text-xs">
                    <span className="font-bold px-2 py-0.5 rounded-full" style={{ background: "#F0FDF4", color: p.costColor }}>💲 {p.cost}</span>
                    <span className="font-medium" style={{ color: "#94A3B8" }}>Best for: {p.best}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div className="rounded-3xl border-2 p-6" style={{ borderColor: "#FBBF24", background: "#FFFBEB" }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🧠</span>
          <h2 className="text-xl font-black" style={{ color: "#92400E" }}>Quick Quiz</h2>
        </div>

        {!quizStarted && !quizDone && (
          <div>
            <p className="font-semibold mb-4" style={{ color: "#78350F" }}>
              5 quick questions to test what you know about promotions. Ready?
            </p>
            <button onClick={() => setQuizStarted(true)} className="px-6 py-3 rounded-2xl text-white font-bold" style={{ background: "#FBBF24" }}>
              Start Quiz →
            </button>
          </div>
        )}

        {quizStarted && !quizDone && (
          <div>
            <div className="text-xs font-bold mb-3" style={{ color: "#D97706" }}>
              Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
            </div>
            <p className="text-base font-bold mb-4" style={{ color: "#1E293B" }}>{QUIZ_QUESTIONS[currentQ].q}</p>
            <div className="space-y-2 mb-4">
              {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => {
                let bg = "white"
                let border = "#E2E8F0"
                let textColor = "#475569"
                if (selected !== null) {
                  if (i === QUIZ_QUESTIONS[currentQ].answer) { bg = "#F0FDF4"; border = "#22C55E"; textColor = "#15803D" }
                  else if (i === selected) { bg = "#FFF1F2"; border = "#F43F5E"; textColor = "#BE123C" }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="w-full text-left px-4 py-3 rounded-2xl border-2 font-semibold text-sm transition-all"
                    style={{ background: bg, borderColor: border, color: textColor }}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                )
              })}
            </div>
            {selected !== null && (
              <div>
                <div className="p-3 rounded-xl mb-3 text-sm font-semibold" style={{ background: selected === QUIZ_QUESTIONS[currentQ].answer ? "#F0FDF4" : "#FFF1F2", color: selected === QUIZ_QUESTIONS[currentQ].answer ? "#15803D" : "#BE123C" }}>
                  {selected === QUIZ_QUESTIONS[currentQ].answer ? "✅ Correct! " : "❌ Not quite. "}
                  {QUIZ_QUESTIONS[currentQ].explanation}
                </div>
                <button onClick={nextQuestion} className="px-5 py-2.5 rounded-2xl text-white font-bold text-sm" style={{ background: "#FBBF24" }}>
                  {currentQ < QUIZ_QUESTIONS.length - 1 ? "Next →" : "See Results →"}
                </button>
              </div>
            )}
          </div>
        )}

        {quizDone && (
          <div className="text-center">
            <div className="text-5xl mb-3">{score >= 4 ? "🏆" : score >= 3 ? "🎉" : "📚"}</div>
            <div className="text-3xl font-black mb-1" style={{ color: "#92400E" }}>{score}/{QUIZ_QUESTIONS.length}</div>
            <div className="font-bold mb-2" style={{ color: "#78350F" }}>
              {score === 5 ? "Perfect score! You're a promotion expert!" : score >= 3 ? "Great job! You know your promotions!" : "Keep learning — you'll get there!"}
            </div>
            <button onClick={() => { setQuizStarted(false); setQuizDone(false); setCurrentQ(0); setAnswers([]); setSelected(null) }} className="mt-3 px-5 py-2 rounded-2xl font-bold text-sm" style={{ background: "#FEF3C7", color: "#92400E" }}>
              Try Again
            </button>
          </div>
        )}
      </div>

      {badge && (
        <div className="fixed bottom-6 right-6 z-50 p-5 rounded-3xl shadow-2xl" style={{ background: "linear-gradient(135deg, #FBBF24, #F97316)" }}>
          <div className="text-4xl text-center mb-2">{badge.emoji}</div>
          <div className="text-white font-black text-center">Badge Earned!</div>
          <div className="text-white/80 text-center font-semibold mt-1">{badge.name}</div>
          <button onClick={() => setBadge(null)} className="mt-3 w-full text-center text-sm text-white/60 font-bold">Dismiss</button>
        </div>
      )}
    </div>
  )
}
