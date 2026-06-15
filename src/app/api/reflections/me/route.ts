import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [reflection, brand] = await Promise.all([
    prisma.studentReflection.findUnique({ where: { userId: session.user.id } }),
    prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
      select: { brandName: true, tagline: true },
    }),
  ])

  return NextResponse.json({ reflection, brand })
}
