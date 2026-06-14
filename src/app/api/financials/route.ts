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
  const records = await prisma.financialRecord.findMany({ where: { userId }, orderBy: { createdAt: "asc" } })
  return NextResponse.json(records)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { type, category, description, amount, date } = await req.json()
  const record = await prisma.financialRecord.create({
    data: { userId: session.user.id, type, category, description: description ?? "", amount: Number(amount) || 0, date: date ? new Date(date) : new Date() },
  })
  await prisma.user.update({ where: { id: session.user.id }, data: { points: { increment: 3 } } })
  const count = await prisma.financialRecord.count({ where: { userId: session.user.id } })
  let badge = null
  if (count >= 5) badge = await awardBadge(session.user.id, "first-profit")
  return NextResponse.json({ id: record.id, badge })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, type, category, description, amount, date } = await req.json()
  await prisma.financialRecord.update({
    where: { id, userId: session.user.id },
    data: { type, category, description, amount: Number(amount) || 0, date: date ? new Date(date) : undefined },
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  await prisma.financialRecord.delete({ where: { id, userId: session.user.id } })
  return NextResponse.json({ ok: true })
}
