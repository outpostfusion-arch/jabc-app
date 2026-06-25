import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Returns the current student's coin balance and the unlocks they own.
export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [user, owned] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true },
    }),
    prisma.userUnlock.findMany({
      where: { userId: session.user.id },
      select: { unlockId: true },
    }),
  ])

  return NextResponse.json({
    points: user?.points ?? 0,
    owned: owned.map((u) => u.unlockId),
  })
}
