import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("sessionId")
  const videos = await prisma.video.findMany({
    where: sessionId ? { sessionId: parseInt(sessionId) } : undefined,
    orderBy: { sortOrder: "asc" },
    include: { prompts: { orderBy: { sortOrder: "asc" } } },
  })
  return NextResponse.json(videos)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { title, description, filePath, sessionId, sortOrder, mimeType, sizeBytes } = await req.json()
  const video = await prisma.video.create({
    data: { title, description: description ?? "", filePath, mimeType: mimeType ?? "video/mp4", sizeBytes: sizeBytes ?? 0, sessionId: parseInt(sessionId), sortOrder: sortOrder ?? 0, uploadedBy: session.user.id },
  })
  return NextResponse.json(video)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  await prisma.video.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
