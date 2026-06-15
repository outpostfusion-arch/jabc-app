import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  const data: Record<string, unknown> = {}
  if (body.teacherFeedback !== undefined) data.teacherFeedback = body.teacherFeedback
  if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured

  const reflection = await prisma.studentReflection.upsert({
    where: { userId: id },
    create: { userId: id, ...data },
    update: data,
  })

  return NextResponse.json(reflection)
}
