import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const BMCSchema = z.object({
  keyPartners: z.array(z.string()).optional(),
  keyActivities: z.array(z.string()).optional(),
  keyResources: z.array(z.string()).optional(),
  valueProposition: z.array(z.string()).optional(),
  customerRelations: z.array(z.string()).optional(),
  channels: z.array(z.string()).optional(),
  customerSegments: z.array(z.string()).optional(),
  costStructure: z.array(z.string()).optional(),
  revenueStreams: z.array(z.string()).optional(),
  businessName: z.string().max(100).optional(),
  tagline: z.string().max(200).optional(),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const userId = session.user.role === "TEACHER" ? (searchParams.get("userId") ?? session.user.id) : session.user.id

  const bmc = await prisma.businessModelCanvas.findUnique({ where: { userId } })
  return NextResponse.json(bmc ?? {})
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "STUDENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = BMCSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 })

  const bmc = await prisma.businessModelCanvas.upsert({
    where: { userId: session.user.id },
    update: parsed.data,
    create: { userId: session.user.id, ...parsed.data },
  })

  // Check if all 9 blocks are filled → award badge
  const allFilled = [
    bmc.keyPartners, bmc.keyActivities, bmc.keyResources,
    bmc.valueProposition, bmc.customerRelations, bmc.channels,
    bmc.customerSegments, bmc.costStructure, bmc.revenueStreams,
  ].every((block) => (block as string[]).length > 0)

  let badge = null
  if (allFilled) {
    badge = await awardBadge(session.user.id, "business-architect")
  }

  return NextResponse.json({ bmc, badge })
}

async function awardBadge(userId: string, slug: string) {
  const badgeRecord = await prisma.badge.findUnique({ where: { slug } })
  if (!badgeRecord) return null

  const existing = await prisma.userBadge.findUnique({ where: { userId_badgeId: { userId, badgeId: badgeRecord.id } } })
  if (existing) return null

  await prisma.userBadge.create({ data: { userId, badgeId: badgeRecord.id } })
  await prisma.user.update({ where: { id: userId }, data: { points: { increment: badgeRecord.pointValue } } })

  return badgeRecord
}
