import PromotionExplorer from "@/components/promotions/PromotionExplorer"

export default async function PromotionsPage() {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm font-bold mb-2" style={{ color: "#F43F5E" }}>
          <span>📢</span> Session 2
        </div>
        <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>Promotions</h1>
        <p className="mt-1 font-semibold" style={{ color: "#64748B" }}>
          Discover 6 types of promotion and test your knowledge with a quick quiz!
        </p>
      </div>
      <PromotionExplorer />
    </div>
  )
}