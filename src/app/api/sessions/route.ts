import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [sessions, progress, studentCount] = await Promise.all([
    prisma.classSession.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.sessionProgress.findMany({ where: { user: { role: "STUDENT" } } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
  ])

  const result = sessions.map((s) => {
    const sp = progress.filter((p) => p.sessionId === s.id)
    const completed = sp.filter((p) => p.status === "COMPLETED").length
    const inProgress = sp.filter((p) => p.status === "IN_PROGRESS").length
    const notStarted = Math.max(0, studentCount - completed - inProgress)
    return { ...s, stats: { completed, inProgress, notStarted } }
  })

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { action, isLocked, orders } = await req.json()

  if (action === "bulk-lock") {
    await prisma.classSession.updateMany({ data: { isLocked } })
    return NextResponse.json({ ok: true })
  }

  if (action === "reorder") {
    await Promise.all(
      orders.map((o: { id: number; sortOrder: number }) =>
        prisma.classSession.update({ where: { id: o.id }, data: { sortOrder: o.sortOrder } })
      )
    )
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
