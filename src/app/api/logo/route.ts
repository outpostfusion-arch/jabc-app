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
  const logo = await prisma.logo.findUnique({ where: { userId } })
  return NextResponse.json(logo)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { fabricJson, pngDataUrl } = await req.json()
  await prisma.logo.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, fabricJson: fabricJson ?? {}, pngDataUrl: pngDataUrl ?? "" },
    update: { fabricJson: fabricJson ?? {}, pngDataUrl: pngDataUrl ?? "" },
  })
  return NextResponse.json({ ok: true })
}
