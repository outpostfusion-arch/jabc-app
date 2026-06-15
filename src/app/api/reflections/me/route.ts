import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [reflection, brand] = await Promise.all([
    prisma.studentReflection.findUnique({
      where: { userId: session.user.id },
      select: {
        whatLearned: true,
        marketInsight: true,
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
      },
    }),
    prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
      select: { brandName: true, tagline: true },
    }),
  ])

  return NextResponse.json({ reflection, brand })
}
