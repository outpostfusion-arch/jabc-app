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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const doc = await prisma.marketingDoc.findUnique({ where: { teamId: params.id } })
  return NextResponse.json(doc ?? { teamId: params.id, slogan: "", keyMessages: ["", "", ""], toneOfVoice: "", version: 0 })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { slogan, keyMessages, toneOfVoice, version } = await req.json()

  const existing = await prisma.marketingDoc.findUnique({ where: { teamId: params.id } })
  if (existing && existing.version !== version) {
    return NextResponse.json({ error: "Version conflict", current: existing }, { status: 409 })
  }

  const doc = await prisma.marketingDoc.upsert({
    where: { teamId: params.id },
    create: { teamId: params.id, slogan: slogan ?? "", keyMessages: keyMessages ?? [], toneOfVoice: toneOfVoice ?? "", version: 1 },
    update: { slogan: slogan ?? "", keyMessages: keyMessages ?? [], toneOfVoice: toneOfVoice ?? "", version: (existing?.version ?? 0) + 1 },
  })
  const badge = await awardBadge(session.user.id, "team-player")
  return NextResponse.json({ ok: true, version: doc.version, badge })
}
