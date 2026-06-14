import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function awardBadge(userId: string, slug: string) {
  const badge = await prisma.badge.findUnique({ where: { slug } })
  if (!badge) return null
  const existing = await prisma.userBadge.findUnique({ where: { userId_badgeId: { userId, badgeId: badge.id } } })
  if (existing) return null
  await prisma.userBadge.create({ data: { userId, badgeId: badge.id } })
  await prisma.user.update({ where: { id: userId }, data: { points: { increment: badge.pointValue } } })
  return { name: badge.name, emoji: badge.emoji }
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") ?? session.user.id
  if (userId !== session.user.id && session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const pricing = await prisma.pricingCalculation.findUnique({ where: { userId } })
  return NextResponse.json(pricing)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { productName, materialCost, labourCost, overheadCost, profitMarginPct, suggestedPrice } = await req.json()
  await prisma.pricingCalculation.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, productName: productName ?? "", materialCost: Number(materialCost) || 0, labourCost: Number(labourCost) || 0, overheadCost: Number(overheadCost) || 0, profitMarginPct: Number(profitMarginPct) || 20, suggestedPrice: Number(suggestedPrice) || 0 },
    update: { productName: productName ?? "", materialCost: Number(materialCost) || 0, labourCost: Number(labourCost) || 0, overheadCost: Number(overheadCost) || 0, profitMarginPct: Number(profitMarginPct) || 20, suggestedPrice: Number(suggestedPrice) || 0 },
  })
  const badge = await awardBadge(session.user.id, "price-setter")
  return NextResponse.json({ ok: true, badge })
}
