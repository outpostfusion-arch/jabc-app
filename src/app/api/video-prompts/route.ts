import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { videoId, timestampSeconds, promptText, sortOrder } = await req.json()
  const prompt = await prisma.videoPrompt.create({
    data: { videoId, timestampSeconds: Number(timestampSeconds), promptText, sortOrder: sortOrder ?? 0 },
  })
  return NextResponse.json(prompt)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  await prisma.videoPrompt.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
