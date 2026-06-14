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
  const brand = await prisma.brandProfile.findUnique({ where: { userId } })
  return NextResponse.json(brand)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { brandName, tagline, colorPalette, salesPitch } = await req.json()
  await prisma.brandProfile.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, brandName: brandName ?? "", tagline: tagline ?? "", colorPalette: colorPalette ?? [], salesPitch: salesPitch ?? "" },
    update: { brandName: brandName ?? "", tagline: tagline ?? "", colorPalette: colorPalette ?? [], salesPitch: salesPitch ?? "" },
  })
  let badge = null
  if (brandName && tagline && salesPitch) {
    badge = await awardBadge(session.user.id, "entrepreneur")
  }
  return NextResponse.json({ ok: true, badge })
}
