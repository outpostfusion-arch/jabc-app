import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const messages = await prisma.teamMessage.findMany({
    where: { teamId: id },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { displayName: true, avatarEmoji: true } } },
    take: 100,
  })
  return NextResponse.json(messages)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 })
  const message = await prisma.teamMessage.create({
    data: { teamId: id, userId: session.user.id, content: content.trim() },
    include: { user: { select: { displayName: true, avatarEmoji: true } } },
  })
  return NextResponse.json(message)
}
