import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import FinancialTracker from "@/components/financials/FinancialTracker"

export default async function FinancialsPage() {
  const session = await auth()

  const [records, pricing] = await Promise.all([
    prisma.financialRecord.findMany({
      where: { userId: session!.user.id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.pricingCalculation.findUnique({ where: { userId: session!.user.id } }),
  ])

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm font-bold mb-2" style={{ color: "#FBBF24" }}>
          <span>💰</span> Session 5
        </div>
        <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>Financial Basics</h1>
        <p className="mt-1 font-semibold" style={{ color: "#64748B" }}>
          Learn to price your product, track income and expenses, and find out if your business is profitable!
        </p>
      </div>

      {/* Mini-lesson */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl p-4 border-2" style={{ background: "#F0FDF4", borderColor: "#22C55E" }}>
          <div className="text-2xl mb-2">📈</div>
          <div className="font-black" style={{ color: "#15803D" }}>Income</div>
          <div className="text-sm font-medium mt-1" style={{ color: "#166534" }}>Money that comes IN to your business. e.g. selling a fidget toy for $5.</div>
        </div>
        <div className="rounded-2xl p-4 border-2" style={{ background: "#FFF1F2", borderColor: "#F43F5E" }}>
          <div className="text-2xl mb-2">📉</div>
          <div className="font-black" style={{ color: "#BE123C" }}>Expense</div>
          <div className="text-sm font-medium mt-1" style={{ color: "#9F1239" }}>Money that goes OUT of your business. e.g. buying filament for $3.</div>
        </div>
        <div className="rounded-2xl p-4 border-2" style={{ background: "#FFFBEB", borderColor: "#FBBF24" }}>
          <div className="text-2xl mb-2">💡</div>
          <div className="font-black" style={{ color: "#92400E" }}>Profit</div>
          <div className="text-sm font-medium mt-1" style={{ color: "#78350F" }}>Income MINUS Expenses. If it&apos;s positive — congratulations, you made money!</div>
        </div>
      </div>

      <FinancialTracker
        initialRecords={records.map((r) => ({ id: r.id, type: r.type as "INCOME" | "EXPENSE", category: r.category, description: r.description, amount: r.amount, date: r.date.toISOString() }))}
        initialPricing={pricing ? { productName: pricing.productName, materialCost: pricing.materialCost, labourCost: pricing.labourCost, overheadCost: pricing.overheadCost, profitMarginPct: pricing.profitMarginPct, suggestedPrice: pricing.suggestedPrice } : undefined}
      />
    </div>
  )
}
