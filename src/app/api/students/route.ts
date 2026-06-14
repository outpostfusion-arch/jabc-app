import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const SingleSchema = z.object({
  displayName: z.string().min(1).max(50),
  username: z.string().min(2).max(20).regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only"),
  password: z.string().min(4).max(100),
  classCode: z.string().optional(),
  avatarEmoji: z.string().optional(),
})

const BulkSchema = z.object({
  bulk: z.array(z.object({ name: z.string(), username: z.string(), password: z.string() })),
  classCode: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { displayName: "asc" },
    select: { id: true, username: true, displayName: true, avatarEmoji: true, points: true, classCode: true, createdAt: true },
  })

  return NextResponse.json(students)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  // Bulk create
  if (body.bulk) {
    const parsed = BulkSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 })

    const created = await Promise.all(
      parsed.data.bulk.map(async (s) => {
        const passwordHash = await bcrypt.hash(s.password, 10)
        return prisma.user.upsert({
          where: { username: s.username },
          update: {},
          create: {
            username: s.username,
            passwordHash,
            displayName: s.name,
            role: "STUDENT",
            classCode: parsed.data.classCode,
            createdBy: session.user.id,
          },
        })
      })
    )
    return NextResponse.json({ created: created.length })
  }

  // Single create
  const parsed = SingleSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { username: parsed.data.username } })
  if (existing) {
    return NextResponse.json({ error: "Username already taken. Try a different one." }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10)
  const user = await prisma.user.create({
    data: {
      username: parsed.data.username,
      passwordHash,
      displayName: parsed.data.displayName,
      role: "STUDENT",
      classCode: parsed.data.classCode,
      avatarEmoji: parsed.data.avatarEmoji ?? "🧑",
      createdBy: session.user.id,
    },
  })

  return NextResponse.json({ id: user.id }, { status: 201 })
}
