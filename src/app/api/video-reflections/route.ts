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
  const reflections = await prisma.videoReflection.findMany({ where: { userId } })
  return NextResponse.json(reflections)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { videoId, promptId, answer } = await req.json()
  await prisma.videoReflection.upsert({
    where: { userId_promptId: { userId: session.user.id, promptId } },
    create: { userId: session.user.id, videoId, promptId, answer },
    update: { answer },
  })
  await prisma.user.update({ where: { id: session.user.id }, data: { points: { increment: 5 } } })
  return NextResponse.json({ ok: true })
}
