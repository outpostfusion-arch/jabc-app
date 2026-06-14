import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const [user, bmc, targetMarket, quizResult, financialRecords, pricing, logo, brand, progress, badges, team] = await Promise.all([
    prisma.user.findUnique({ where: { id: params.id }, select: { id: true, displayName: true, username: true, avatarEmoji: true, points: true, classCode: true } }),
    prisma.businessModelCanvas.findUnique({ where: { userId: params.id } }),
    prisma.targetMarketProfile.findUnique({ where: { userId: params.id } }),
    prisma.promotionQuizResult.findFirst({ where: { userId: params.id }, orderBy: { createdAt: "desc" } }),
    prisma.financialRecord.findMany({ where: { userId: params.id }, orderBy: { createdAt: "asc" } }),
    prisma.pricingCalculation.findUnique({ where: { userId: params.id } }),
    prisma.logo.findUnique({ where: { userId: params.id } }),
    prisma.brandProfile.findUnique({ where: { userId: params.id } }),
    prisma.sessionProgress.findMany({ where: { userId: params.id } }),
    prisma.userBadge.findMany({ where: { userId: params.id }, include: { badge: true } }),
    prisma.teamMember.findFirst({ where: { userId: params.id }, include: { team: true } }),
  ])

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ user, bmc, targetMarket, quizResult, financialRecords, pricing, logo, brand, progress, badges, team })
}
