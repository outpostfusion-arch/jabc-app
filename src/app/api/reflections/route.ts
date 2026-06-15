import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { displayName: "asc" },
    select: {
      id: true,
      displayName: true,
      username: true,
      avatarEmoji: true,
      reflection: true,
      brandProfile: { select: { brandName: true, tagline: true } },
    },
  })

  return NextResponse.json(students)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { whatLearned, proudOf, challenges, nextSteps, mediaUrl, mediaType } = await req.json()

  const reflection = await prisma.studentReflection.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      whatLearned: whatLearned ?? "",
      proudOf: proudOf ?? "",
      challenges: challenges ?? "",
      nextSteps: nextSteps ?? "",
      mediaUrl: mediaUrl ?? "",
      mediaType: mediaType ?? "",
    },
    update: {
      whatLearned: whatLearned ?? "",
      proudOf: proudOf ?? "",
      challenges: challenges ?? "",
      nextSteps: nextSteps ?? "",
      mediaUrl: mediaUrl ?? "",
      mediaType: mediaType ?? "",
    },
  })

  return NextResponse.json(reflection)
}
