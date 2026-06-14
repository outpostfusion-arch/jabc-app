import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import BMCCanvas, { BMCData } from "@/components/bmc/BMCCanvas"
import FinancialTracker from "@/components/financials/FinancialTracker"
import LogoBuilder from "@/components/brand/LogoBuilder"

interface Params { params: Promise<{ id: string }> }

export default async function StudentDetailPage({ params }: Params) {
  const { id } = await params
  const session = await auth()
  if (session?.user.role !== "TEACHER") notFound()

  const [user, bmc, targetMarket, quizResult, financialRecords, pricing, logo, brand, progress, badges] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { id: true, displayName: true, username: true, avatarEmoji: true, points: true, classCode: true } }),
    prisma.businessModelCanvas.findUnique({ where: { userId: id } }),
    prisma.targetMarketProfile.findUnique({ where: { userId: id } }),
    prisma.promotionQuizResult.findFirst({ where: { userId: id }, orderBy: { completedAt: "desc" } }),
    prisma.financialRecord.findMany({ where: { userId: id }, orderBy: { createdAt: "asc" } }),
    prisma.pricingCalculation.findUnique({ where: { userId: id } }),
    prisma.logo.findUnique({ where: { userId: id } }),
    prisma.brandProfile.findUnique({ where: { userId: id } }),
    prisma.sessionProgress.findMany({ where: { userId: id } }),
    prisma.userBadge.findMany({ where: { userId: id }, include: { badge: true } }),
  ])

  if (!user) notFound()

  const progressMap = Object.fromEntries(progress.map((p) => [p.sessionId, p.status]))

  const bmcData: Partial<BMCData> | undefined = bmc ? {
    keyPartners: bmc.keyPartners as string[],
    keyActivities: bmc.keyActivities as string[],
    keyResources: bmc.keyResources as string[],
    valueProposition: bmc.valueProposition as string[],
    customerRelations: bmc.customerRelations as string[],
    channels: bmc.channels as string[],
    customerSegments: bmc.customerSegments as string[],
    costStructure: bmc.costStructure as string[],
    revenueStreams: bmc.revenueStreams as string[],
    businessName: bmc.businessName,
    tagline: bmc.tagline,
  } : undefined

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <span className="text-5xl">{user.avatarEmoji}</span>
        <div>
          <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>{user.displayName}</h1>
          <div className="text-sm font-semibold" style={{ color: "#64748B" }}>
            @{user.username} · {user.classCode} · {user.points} pts · {badges.length} badges
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {([1, 2, 3, 4, 5, 6] as const).map((id) => (
            <div key={id} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
              style={{
                background: progressMap[id] === "COMPLETED" ? "#22C55E" : progressMap[id] === "IN_PROGRESS" ? "#FBBF24" : "#E2E8F0",
                color: progressMap[id] ? "white" : "#94A3B8",
              }}>
              {id}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-black mb-3" style={{ color: "#1E293B" }}>Business Model Canvas</h2>
          {bmcData ? (
            <BMCCanvas initialData={bmcData} readOnly />
          ) : (
            <div className="p-6 rounded-2xl border text-center" style={{ background: "#F8FAFC", borderColor: "#E2E8F0", color: "#94A3B8" }}>Not started yet</div>
          )}
        </section>

        {targetMarket && (
          <section>
            <h2 className="text-xl font-black mb-3" style={{ color: "#1E293B" }}>Target Market</h2>
            <div className="p-5 rounded-2xl border" style={{ background: "white", borderColor: "#E2E8F0" }}>
              <div className="grid grid-cols-2 gap-4">
                <div><div className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>Age Range</div><div className="font-semibold" style={{ color: "#1E293B" }}>{targetMarket.ageRange}</div></div>
                <div><div className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>Location</div><div className="font-semibold" style={{ color: "#1E293B" }}>{targetMarket.location}</div></div>
                <div><div className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>Interests</div><div className="font-semibold" style={{ color: "#1E293B" }}>{(targetMarket.interests as string[]).join(", ")}</div></div>
                <div><div className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: "#94A3B8" }}>Problem Solved</div><div className="font-semibold" style={{ color: "#1E293B" }}>{targetMarket.problemSolved}</div></div>
              </div>
            </div>
          </section>
        )}

        {quizResult && (
          <section>
            <h2 className="text-xl font-black mb-3" style={{ color: "#1E293B" }}>Promotions Quiz</h2>
            <div className="p-5 rounded-2xl border" style={{ background: "white", borderColor: "#E2E8F0" }}>
              <span className="text-2xl font-black" style={{ color: "#6366F1" }}>{quizResult.score}/5</span>
              <span className="ml-2 font-semibold" style={{ color: "#64748B" }}>correct answers</span>
            </div>
          </section>
        )}

        {(financialRecords.length > 0 || pricing) && (
          <section>
            <h2 className="text-xl font-black mb-3" style={{ color: "#1E293B" }}>Financials</h2>
            <FinancialTracker
              initialRecords={financialRecords.map((r) => ({ id: r.id, type: r.type as "INCOME" | "EXPENSE", category: r.category, description: r.description, amount: r.amount, date: r.date.toISOString() }))}
              initialPricing={pricing ? { productName: pricing.productName, materialCost: pricing.materialCost, labourCost: pricing.labourCost, overheadCost: pricing.overheadCost, profitMarginPct: pricing.profitMarginPct, suggestedPrice: pricing.suggestedPrice } : undefined}
              readOnly
            />
          </section>
        )}

        {logo && (
          <section>
            <h2 className="text-xl font-black mb-3" style={{ color: "#1E293B" }}>Logo</h2>
            {logo.pngDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo.pngDataUrl} alt="Student logo" className="rounded-2xl border" style={{ maxWidth: 300, borderColor: "#E2E8F0" }} />
            ) : (
              <LogoBuilder initialFabricJson={logo.fabricJson as unknown as { version?: string; objects?: unknown[] }} readOnly />
            )}
          </section>
        )}

        {brand && (
          <section>
            <h2 className="text-xl font-black mb-3" style={{ color: "#1E293B" }}>Brand Profile</h2>
            <div className="p-5 rounded-2xl border" style={{ background: "white", borderColor: "#E2E8F0" }}>
              <div className="text-2xl font-black mb-1" style={{ color: "#1E293B" }}>{brand.brandName}</div>
              <div className="font-semibold mb-3" style={{ color: "#64748B" }}>{brand.tagline}</div>
              {(brand.colorPalette as string[]).length > 0 && (
                <div className="flex gap-2 mb-3">{(brand.colorPalette as string[]).map((c: string) => <div key={c} className="w-8 h-8 rounded-full" style={{ background: c }} />)}</div>
              )}
              <div className="font-medium" style={{ color: "#475569" }}>{brand.salesPitch}</div>
            </div>
          </section>
        )}

        {badges.length > 0 && (
          <section>
            <h2 className="text-xl font-black mb-3" style={{ color: "#1E293B" }}>Badges Earned</h2>
            <div className="flex flex-wrap gap-3">
              {badges.map((ub) => (
                <div key={ub.id} className="flex items-center gap-2 px-4 py-2 rounded-full border" style={{ background: "#FFFBEB", borderColor: "#FBBF24" }}>
                  <span>{ub.badge.emoji}</span>
                  <span className="text-sm font-black" style={{ color: "#92400E" }}>{ub.badge.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}