"use client"

import { useState, useRef } from "react"

interface Record {
  id: string
  type: "INCOME" | "EXPENSE"
  category: string
  description: string
  amount: number
  date: string
}

interface Pricing {
  productName: string
  materialCost: number
  labourCost: number
  overheadCost: number
  profitMarginPct: number
  suggestedPrice: number
}

const CATEGORIES = {
  INCOME: ["Sales", "Grant", "Donation", "Other Income"],
  EXPENSE: ["Materials", "Labour", "Equipment", "Marketing", "Other Expense"],
}

interface Props {
  initialRecords?: Record[]
  initialPricing?: Partial<Pricing>
  readOnly?: boolean
}

export default function FinancialTracker({ initialRecords = [], initialPricing, readOnly = false }: Props) {
  const [records, setRecords] = useState<Record[]>(initialRecords)
  const [pricing, setPricing] = useState<Pricing>({
    productName: initialPricing?.productName ?? "",
    materialCost: initialPricing?.materialCost ?? 0,
    labourCost: initialPricing?.labourCost ?? 0,
    overheadCost: initialPricing?.overheadCost ?? 0,
    profitMarginPct: initialPricing?.profitMarginPct ?? 20,
    suggestedPrice: initialPricing?.suggestedPrice ?? 0,
  })
  const [badge, setBadge] = useState<{ name: string; emoji: string } | null>(null)
  const priceSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalIncome = records.filter((r) => r.type === "INCOME").reduce((s, r) => s + r.amount, 0)
  const totalExpense = records.filter((r) => r.type === "EXPENSE").reduce((s, r) => s + r.amount, 0)
  const netProfit = totalIncome - totalExpense

  const cost = pricing.materialCost + pricing.labourCost + pricing.overheadCost
  const computedPrice = cost > 0 ? cost * (1 + pricing.profitMarginPct / 100) : 0

  async function addRecord() {
    const newRecord = {
      type: "INCOME" as const,
      category: "Sales",
      description: "",
      amount: 0,
      date: new Date().toISOString(),
    }
    const res = await fetch("/api/financials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecord),
    })
    if (res.ok) {
      const data = await res.json()
      const newRecords = [...records, { ...newRecord, id: data.id }]
      setRecords(newRecords)
      if (data.badge) setBadge(data.badge)
    }
  }

  async function deleteRecord(id: string) {
    await fetch(`/api/financials?id=${id}`, { method: "DELETE" })
    setRecords(records.filter((r) => r.id !== id))
  }

  async function updateRecord(id: string, field: keyof Record, value: string | number) {
    const updated = records.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    setRecords(updated)
    const record = updated.find((r) => r.id === id)
    if (!record) return
    await fetch("/api/financials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...record }),
    })
  }

  function updatePricing(field: keyof Pricing, value: string | number) {
    const updated = { ...pricing, [field]: value }
    const newCost = updated.materialCost + updated.labourCost + updated.overheadCost
    updated.suggestedPrice = newCost > 0 ? Number((newCost * (1 + updated.profitMarginPct / 100)).toFixed(2)) : 0
    setPricing(updated)

    if (priceSaveTimer.current) clearTimeout(priceSaveTimer.current)
    priceSaveTimer.current = setTimeout(async () => {
      const res = await fetch("/api/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.badge) setBadge(json.badge)
      }
    }, 800)
  }

  return (
    <div className="space-y-6">
      {/* Profit/Loss Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl p-4 text-center border" style={{ background: "#F0FDF4", borderColor: "#22C55E" }}>
          <div className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: "#15803D" }}>Income</div>
          <div className="text-2xl font-black" style={{ color: "#15803D" }}>CA${totalIncome.toFixed(2)}</div>
        </div>
        <div className="rounded-2xl p-4 text-center border" style={{ background: "#FFF1F2", borderColor: "#F43F5E" }}>
          <div className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: "#BE123C" }}>Expenses</div>
          <div className="text-2xl font-black" style={{ color: "#BE123C" }}>CA${totalExpense.toFixed(2)}</div>
        </div>
        <div className="rounded-2xl p-4 text-center border" style={{ background: netProfit >= 0 ? "#F0FDF4" : "#FFF1F2", borderColor: netProfit >= 0 ? "#22C55E" : "#F43F5E" }}>
          <div className="text-xs font-black uppercase tracking-wide mb-1" style={{ color: netProfit >= 0 ? "#15803D" : "#BE123C" }}>Net Profit</div>
          <div className="text-2xl font-black" style={{ color: netProfit >= 0 ? "#15803D" : "#BE123C" }}>
            {netProfit >= 0 ? "+" : ""}CA${netProfit.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Pricing Calculator */}
      <div className="rounded-3xl border p-5" style={{ background: "white", borderColor: "#E2E8F0" }}>
        <h3 className="font-black text-lg mb-4" style={{ color: "#1E293B" }}>💡 Pricing Calculator</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wide block mb-1" style={{ color: "#94A3B8" }}>Product Name</label>
            <input value={pricing.productName} onChange={(e) => updatePricing("productName", e.target.value)} disabled={readOnly} placeholder="e.g. Fidget Toy" className="w-full px-3 py-2 rounded-xl border text-sm font-medium focus:outline-none" style={{ borderColor: "#E2E8F0", color: "#1E293B" }} />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-wide block mb-1" style={{ color: "#94A3B8" }}>Material Cost (CA$)</label>
            <input type="number" min={0} step={0.01} value={pricing.materialCost} onChange={(e) => updatePricing("materialCost", parseFloat(e.target.value) || 0)} disabled={readOnly} className="w-full px-3 py-2 rounded-xl border text-sm font-medium focus:outline-none" style={{ borderColor: "#E2E8F0", color: "#1E293B" }} />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-wide block mb-1" style={{ color: "#94A3B8" }}>Labour Cost (CA$)</label>
            <input type="number" min={0} step={0.01} value={pricing.labourCost} onChange={(e) => updatePricing("labourCost", parseFloat(e.target.value) || 0)} disabled={readOnly} className="w-full px-3 py-2 rounded-xl border text-sm font-medium focus:outline-none" style={{ borderColor: "#E2E8F0", color: "#1E293B" }} />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-wide block mb-1" style={{ color: "#94A3B8" }}>Overhead Cost (CA$)</label>
            <input type="number" min={0} step={0.01} value={pricing.overheadCost} onChange={(e) => updatePricing("overheadCost", parseFloat(e.target.value) || 0)} disabled={readOnly} className="w-full px-3 py-2 rounded-xl border text-sm font-medium focus:outline-none" style={{ borderColor: "#E2E8F0", color: "#1E293B" }} />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-xs font-black uppercase tracking-wide block mb-1" style={{ color: "#94A3B8" }}>Profit Margin: {pricing.profitMarginPct}%</label>
          <input type="range" min={0} max={200} value={pricing.profitMarginPct} onChange={(e) => updatePricing("profitMarginPct", parseInt(e.target.value))} disabled={readOnly} className="w-full accent-indigo-500" />
        </div>
        <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "#EEF2FF" }}>
          <div>
            <div className="text-xs font-bold" style={{ color: "#6366F1" }}>Total Cost</div>
            <div className="font-black text-lg" style={{ color: "#4338CA" }}>CA${cost.toFixed(2)}</div>
          </div>
          <div className="text-2xl">→</div>
          <div>
            <div className="text-xs font-bold" style={{ color: "#6366F1" }}>Suggested Price</div>
            <div className="font-black text-2xl" style={{ color: "#4338CA" }}>CA${computedPrice.toFixed(2)}</div>
          </div>
          <div className="ml-auto text-sm font-semibold" style={{ color: "#6366F1" }}>
            {cost > 0 && `10 units = CA$${(computedPrice * 10).toFixed(2)} revenue`}
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-3xl border overflow-hidden" style={{ background: "white", borderColor: "#E2E8F0" }}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "#E2E8F0" }}>
          <h3 className="font-black text-lg" style={{ color: "#1E293B" }}>📊 Transactions</h3>
          {!readOnly && (
            <button onClick={addRecord} className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "#6366F1" }}>
              + Add Row
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: "#F8FAFC" }}>
              <tr>
                <th className="text-left px-4 py-3 font-bold" style={{ color: "#64748B" }}>Type</th>
                <th className="text-left px-4 py-3 font-bold" style={{ color: "#64748B" }}>Category</th>
                <th className="text-left px-4 py-3 font-bold" style={{ color: "#64748B" }}>Description</th>
                <th className="text-right px-4 py-3 font-bold" style={{ color: "#64748B" }}>Amount (CA$)</th>
                {!readOnly && <th className="w-10" />}
              </tr>
            </thead>
            <tbody>
              {records.map((record, idx) => (
                <tr key={record.id} style={{ borderTop: idx > 0 ? "1px solid #F1F5F9" : undefined }}>
                  <td className="px-4 py-2">
                    {readOnly ? (
                      <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: record.type === "INCOME" ? "#F0FDF4" : "#FFF1F2", color: record.type === "INCOME" ? "#15803D" : "#BE123C" }}>{record.type}</span>
                    ) : (
                      <select value={record.type} onChange={(e) => updateRecord(record.id, "type", e.target.value as "INCOME" | "EXPENSE")} className="px-2 py-1 rounded-lg border text-xs font-bold focus:outline-none" style={{ borderColor: "#E2E8F0", color: record.type === "INCOME" ? "#15803D" : "#BE123C", background: record.type === "INCOME" ? "#F0FDF4" : "#FFF1F2" }}>
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {readOnly ? (
                      <span className="font-medium" style={{ color: "#475569" }}>{record.category}</span>
                    ) : (
                      <select value={record.category} onChange={(e) => updateRecord(record.id, "category", e.target.value)} className="px-2 py-1 rounded-lg border text-xs font-medium focus:outline-none" style={{ borderColor: "#E2E8F0", color: "#475569" }}>
                        {CATEGORIES[record.type].map((c) => <option key={c}>{c}</option>)}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {readOnly ? (
                      <span style={{ color: "#1E293B" }}>{record.description}</span>
                    ) : (
                      <input value={record.description} onChange={(e) => updateRecord(record.id, "description", e.target.value)} placeholder="What is this for?" className="w-full px-2 py-1 rounded-lg border text-xs font-medium focus:outline-none" style={{ borderColor: "#E2E8F0", color: "#1E293B" }} />
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {readOnly ? (
                      <span className="font-bold" style={{ color: record.type === "INCOME" ? "#15803D" : "#BE123C" }}>${record.amount.toFixed(2)}</span>
                    ) : (
                      <input type="number" min={0} step={0.01} value={record.amount} onChange={(e) => updateRecord(record.id, "amount", parseFloat(e.target.value) || 0)} className="w-24 px-2 py-1 rounded-lg border text-xs font-bold text-right focus:outline-none" style={{ borderColor: "#E2E8F0", color: record.type === "INCOME" ? "#15803D" : "#BE123C" }} />
                    )}
                  </td>
                  {!readOnly && (
                    <td className="px-2 py-2">
                      <button onClick={() => deleteRecord(record.id)} className="w-7 h-7 rounded-lg text-xs flex items-center justify-center" style={{ background: "#FFF1F2", color: "#F43F5E" }}>✕</button>
                    </td>
                  )}
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={readOnly ? 4 : 5} className="text-center py-8" style={{ color: "#94A3B8" }}>
                    No transactions yet. Click &quot;+ Add Row&quot; to start!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {badge && (
        <div className="fixed bottom-6 right-6 z-50 p-5 rounded-3xl shadow-2xl" style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}>
          <div className="text-4xl text-center mb-2">{badge.emoji}</div>
          <div className="text-white font-black text-center">Badge Earned!</div>
          <div className="text-white/80 text-center font-semibold mt-1">{badge.name}</div>
          <button onClick={() => setBadge(null)} className="mt-3 w-full text-center text-sm text-white/60 font-bold">Dismiss</button>
        </div>
      )}
    </div>
  )
}
