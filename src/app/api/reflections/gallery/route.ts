import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      reflection: { isFeatured: true },
    },
    orderBy: { displayName: "asc" },
    select: {
      id: true,
      displayName: true,
      avatarEmoji: true,
      reflection: {
        select: {
          moodEmoji: true,
          whatLearned: true,
          proudOf: true,
          skillTeamwork: true,
          skillCreativity: true,
          skillBusiness: true,
          skillLeadership: true,
          goalStatus: true,
          updatedAt: true,
        },
      },
      brandProfile: { select: { brandName: true, tagline: true } },
    },
  })

  return NextResponse.json(students)
}
