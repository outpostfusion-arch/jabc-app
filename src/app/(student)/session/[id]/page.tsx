import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"

const SESSION_META = [
  { id: 1, emoji: "🏢", color: "#6366F1", title: "What Is a Business?", subtitle: "Business Model Canvas", description: "Explore what makes a business work by filling in your very own Business Model Canvas.", bcTag: "ADST 6-8 • Careers 8", tools: [{ label: "Business Model Canvas", href: "bmc" }] },
  { id: 2, emoji: "🎯", color: "#F43F5E", title: "Who Is Your Customer?", subtitle: "Target Markets & Promotions", description: "Build a profile of your ideal customer and learn how businesses promote to them.", bcTag: "ADST 6-8 • Business Ed 8", tools: [{ label: "Persona Builder", href: "target-market" }, { label: "Promotion Explorer", href: "promotions" }] },
  { id: 3, emoji: "🤝", color: "#22C55E", title: "Team Marketing Workshop", subtitle: "Collaborative Marketing", description: "Work with your team to create a marketing plan with a slogan, key messages, and a tone of voice.", bcTag: "ELA 6-8 • Careers 8 • ADST 6-8", tools: [{ label: "Team Workspace", href: "team-workspace" }] },
  { id: 4, emoji: "⚙️", color: "#A855F7", title: "Product Creation Tutorials", subtitle: "Making Your Product", description: "Watch tutorials on how to make your 3D printed fidget toy and laser-cut earrings.", bcTag: "ADST 6-8", tools: [{ label: "Video Tutorials", href: "tutorials" }] },
  { id: 5, emoji: "💰", color: "#FBBF24", title: "Financial Basics", subtitle: "Pricing & Profit", description: "Learn about income, expenses, and profit. Use the pricing calculator to set a fair price.", bcTag: "Math 6-8 • Business Ed 8", tools: [{ label: "Financial Tracker", href: "financials" }] },
  { id: 6, emoji: "🎨", color: "#EC4899", title: "Brand & Final Pitch", subtitle: "Your Business Identity", description: "Design your logo, name your brand, choose your colours, and create a sales pitch!", bcTag: "ADST 6-8 • ELA 6-8 • Careers 8", tools: [{ label: "Brand Studio", href: "brand" }] },
]

export default async function SessionLandingPage({ params }: { params: { id: string } }) {
  const sessionNum = parseInt(params.id)
  const meta = SESSION_META.find((s) => s.id === sessionNum)
  if (!meta) notFound()

  const authSession = await auth()
  const classSession = await prisma.classSession.findUnique({ where: { id: sessionNum } })
  if (!classSession || classSession.isLocked) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-black" style={{ color: "#1E293B" }}>Session Locked</h2>
        <p className="mt-2 font-semibold" style={{ color: "#64748B" }}>Your teacher hasn&apos;t unlocked this session yet. Check back soon!</p>
      </div>
    )
  }

  const progress = await prisma.sessionProgress.findUnique({
    where: { userId_sessionId: { userId: authSession!.user.id, sessionId: sessionNum } },
  })

  return (
    <div>
      <div className="mb-8">
        <div className="text-6xl mb-4">{meta.emoji}</div>
        <div className="text-sm font-bold mb-2" style={{ color: meta.color }}>Session {meta.id} — {meta.bcTag}</div>
        <h1 className="text-4xl font-black mb-2" style={{ color: "#1E293B" }}>{meta.title}</h1>
        <p className="text-xl font-semibold mb-1" style={{ color: meta.color }}>{meta.subtitle}</p>
        <p className="font-medium" style={{ color: "#64748B" }}>{meta.description}</p>
      </div>

      {progress?.status === "COMPLETED" && (
        <div className="mb-6 p-4 rounded-2xl flex items-center gap-3" style={{ background: "#F0FDF4", border: "2px solid #22C55E" }}>
          <span className="text-2xl">✅</span>
          <div>
            <div className="font-black" style={{ color: "#15803D" }}>Session Complete!</div>
            <div className="text-sm font-medium" style={{ color: "#166534" }}>You&apos;ve already finished this session. You can revisit your work below.</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {meta.tools.map((tool) => (
          <Link key={tool.href} href={`/session/${params.id}/${tool.href}`} className="group block rounded-3xl border-2 p-6 transition-all hover:shadow-lg" style={{ background: "white", borderColor: "#E2E8F0" }}>
            <div className="text-3xl mb-3">{meta.emoji}</div>
            <div className="font-black text-lg mb-1" style={{ color: "#1E293B" }}>{tool.label}</div>
            <div className="text-sm font-medium" style={{ color: "#64748B" }}>Click to open →</div>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <Link href="/dashboard" className="text-sm font-bold" style={{ color: "#6366F1" }}>
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
