import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { isLocked } = await req.json()
  const updated = await prisma.classSession.update({
    where: { id: parseInt(params.id) },
    data: { isLocked },
  })
  return NextResponse.json(updated)
}
