import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ROBOTS } from "@/components/arrow/robots"

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const robotId = body?.robotId

  if (typeof robotId !== "string" || !ROBOTS.some((r) => r.id === robotId)) {
    return NextResponse.json({ error: "Invalid robot" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { robotId },
  })

  return NextResponse.json({ ok: true, robotId })
}
