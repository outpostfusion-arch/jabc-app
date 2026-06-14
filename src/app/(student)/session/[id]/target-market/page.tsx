import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import PersonaBuilder from "@/components/target-market/PersonaBuilder"

export default async function TargetMarketPage() {
  const session = await auth()
  const profile = await prisma.targetMarketProfile.findUnique({ where: { userId: session!.user.id } })

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm font-bold mb-2" style={{ color: "#F43F5E" }}>
          <span>🎯</span> Session 2
        </div>
        <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>Target Market</h1>
        <p className="mt-1 font-semibold" style={{ color: "#64748B" }}>
          Who will buy your product? Build a profile of your perfect customer!
        </p>
      </div>

      <div className="mb-6 p-4 rounded-2xl border-2" style={{ background: "#FFF7ED", borderColor: "#FBBF24" }}>
        <div className="font-black mb-1" style={{ color: "#92400E" }}>Why does this matter?</div>
        <p className="text-sm font-medium" style={{ color: "#78350F" }}>
          Businesses focus on a specific group of customers most likely to buy. This is your target market.
          The better you understand them, the better you can design your product and marketing.
        </p>
      </div>

      <PersonaBuilder
        teacherMode={session!.user.role === "TEACHER"}
        initialData={profile ? {
          ageRange:     profile.ageRange,
          interests:    profile.interests as string[],
          location:     profile.location,
          problemSolved: profile.problemSolved,
          spending:     profile.spending,
          shopWhere:    profile.shopWhere,
          influencedBy: profile.influencedBy,
          motivation:   profile.motivation,
          lifestyle:    profile.lifestyle,
          reachHow:     profile.reachHow,
        } : undefined}
      />
    </div>
  )
}