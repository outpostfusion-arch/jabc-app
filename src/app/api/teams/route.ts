import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const classCode = searchParams.get("classCode")
  const teams = await prisma.team.findMany({
    where: classCode ? { classCode } : undefined,
    include: {
      members: { include: { user: { select: { id: true, displayName: true, avatarEmoji: true, classCode: true } } } },
    },
  })
  return NextResponse.json(teams)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { name, classCode } = await req.json()
  const team = await prisma.team.create({ data: { name, classCode: classCode ?? "" } })
  return NextResponse.json(team)
}
