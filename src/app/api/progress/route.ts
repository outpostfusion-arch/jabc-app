import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") ?? session.user.id
  if (userId !== session.user.id && session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const progress = await prisma.sessionProgress.findMany({ where: { userId } })
  return NextResponse.json(progress)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { sessionId, status } = await req.json()
  const sid = parseInt(sessionId)

  // Was this session already completed? If so, don't award coins again.
  const existing = await prisma.sessionProgress.findUnique({
    where: { userId_sessionId: { userId: session.user.id, sessionId: sid } },
    select: { status: true },
  })
  const newlyCompleted = status === "COMPLETED" && existing?.status !== "COMPLETED"

  const progress = await prisma.sessionProgress.upsert({
    where: { userId_sessionId: { userId: session.user.id, sessionId: sid } },
    create: { userId: session.user.id, sessionId: sid, status, completedAt: status === "COMPLETED" ? new Date() : null },
    update: { status, completedAt: status === "COMPLETED" ? new Date() : undefined },
  })
  if (newlyCompleted) {
    await prisma.user.update({ where: { id: session.user.id }, data: { points: { increment: 25 } } })
  }
  return NextResponse.json(progress)
}
