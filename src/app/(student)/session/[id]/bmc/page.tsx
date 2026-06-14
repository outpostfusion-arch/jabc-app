import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import BMCCanvas from "@/components/bmc/BMCCanvas"

export default async function BMCPage() {
  const session = await auth()
  const bmc = await prisma.businessModelCanvas.findUnique({
    where: { userId: session!.user.id },
  })

  const initialData = bmc ? {
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

  const isTeacher = session!.user.role === "TEACHER"

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm font-bold mb-2" style={{ color: "#6366F1" }}>
          <span>🏢</span> Session 1
        </div>
        <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>Business Model Canvas</h1>
        <p className="mt-1 font-semibold" style={{ color: "#64748B" }}>
          Map out your entire business on one page. Click any block to add ideas!
        </p>
      </div>

      <p className="text-xs font-semibold mb-5" style={{ color: "#94A3B8" }}>
        💡 Tap the <span style={{ color: "#F59E0B" }}>💡</span> on any block to flip it and see a lemonade stand example.
        {isTeacher && <span style={{ color: "#6366F1" }}> · ✏️ tap the pencil to add a demo point one at a time.</span>}
      </p>

      <BMCCanvas initialData={initialData} teacherMode={isTeacher} />
    </div>
  )
}

