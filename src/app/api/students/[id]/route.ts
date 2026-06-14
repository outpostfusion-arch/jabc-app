import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const [user, bmc, targetMarket, quizResult, financialRecords, pricing, logo, brand, progress, badges, team] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { id: true, displayName: true, username: true, avatarEmoji: true, points: true, classCode: true } }),
    prisma.businessModelCanvas.findUnique({ where: { userId: id } }),
    prisma.targetMarketProfile.findUnique({ where: { userId: id } }),
    prisma.promotionQuizResult.findFirst({ where: { userId: id }, orderBy: { createdAt: "desc" } }),
    prisma.financialRecord.findMany({ where: { userId: id }, orderBy: { createdAt: "asc" } }),
    prisma.pricingCalculation.findUnique({ where: { userId: id } }),
    prisma.logo.findUnique({ where: { userId: id } }),
    prisma.brandProfile.findUnique({ where: { userId: id } }),
    prisma.sessionProgress.findMany({ where: { userId: id } }),
    prisma.userBadge.findMany({ where: { userId: id }, include: { badge: true } }),
    prisma.teamMember.findFirst({ where: { userId: id }, include: { team: true } }),
  ])

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ user, bmc, targetMarket, quizResult, financialRecords, pricing, logo, brand, progress, badges, team })
}
