import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await params
  const { isLocked, teacherNote, dueDate, sortOrder } = await req.json()

  const data: Record<string, unknown> = {}
  if (isLocked !== undefined) data.isLocked = isLocked
  if (teacherNote !== undefined) data.teacherNote = teacherNote
  if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null
  if (sortOrder !== undefined) data.sortOrder = sortOrder

  const updated = await prisma.classSession.update({
    where: { id: parseInt(id) },
    data,
  })
  return NextResponse.json(updated)
}
