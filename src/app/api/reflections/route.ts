import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const REFLECTION_SELECT = {
  id: true,
  whatLearned: true,
  proudOf: true,
  challenges: true,
  nextSteps: true,
  mediaUrl: true,
  mediaType: true,
  teacherFeedback: true,
  moodEmoji: true,
  skillTeamwork: true,
  skillCreativity: true,
  skillBusiness: true,
  skillLeadership: true,
  isFeatured: true,
  goalStatus: true,
  updatedAt: true,
}

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
      reflection: { select: REFLECTION_SELECT },
      brandProfile: { select: { brandName: true, tagline: true } },
    },
  })

  return NextResponse.json(students)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const {
    whatLearned, proudOf, challenges, nextSteps, mediaUrl, mediaType,
    moodEmoji, skillTeamwork, skillCreativity, skillBusiness, skillLeadership, goalStatus,
  } = await req.json()

  const data = {
    whatLearned: whatLearned ?? "",
    proudOf: proudOf ?? "",
    challenges: challenges ?? "",
    nextSteps: nextSteps ?? "",
    mediaUrl: mediaUrl ?? "",
    mediaType: mediaType ?? "",
    moodEmoji: moodEmoji ?? "",
    skillTeamwork: skillTeamwork ?? 0,
    skillCreativity: skillCreativity ?? 0,
    skillBusiness: skillBusiness ?? 0,
    skillLeadership: skillLeadership ?? 0,
    goalStatus: goalStatus ?? "not_started",
  }

  const reflection = await prisma.studentReflection.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...data },
    update: data,
  })

  // Auto-award reflection badge when all 4 core fields are filled
  const isComplete = !!(whatLearned?.trim() && proudOf?.trim() && challenges?.trim() && nextSteps?.trim())
  if (isComplete) {
    const badge = await prisma.badge.findUnique({ where: { slug: "reflection-complete" } })
    if (badge) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: session.user.id, badgeId: badge.id } },
        create: { userId: session.user.id, badgeId: badge.id },
        update: {},
      })
    }
  }

  return NextResponse.json(reflection)
}
