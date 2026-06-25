import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UNLOCKS, unlockCost } from "@/components/arrow/unlocks"

// Spend coins to unlock an item. Validates the item, checks the student can
// afford it and doesn't already own it, then deducts coins and records
// ownership atomically.
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const unlockId = body?.unlockId

  const unlock = UNLOCKS.find((u) => u.id === unlockId)
  if (!unlock) {
    return NextResponse.json({ error: "Unknown unlock" }, { status: 400 })
  }

  const cost = unlockCost(unlock.rarity)

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { points: true },
      })
      if (!user) throw new Error("NO_USER")

      const already = await tx.userUnlock.findUnique({
        where: { userId_unlockId: { userId: session.user.id, unlockId } },
      })
      if (already) throw new Error("OWNED")

      if (user.points < cost) throw new Error("BROKE")

      await tx.userUnlock.create({
        data: { userId: session.user.id, unlockId },
      })
      const updated = await tx.user.update({
        where: { id: session.user.id },
        data: { points: { decrement: cost } },
        select: { points: true },
      })

      return updated.points
    })

    return NextResponse.json({ ok: true, points: result, unlockId, cost })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ERROR"
    if (msg === "OWNED") return NextResponse.json({ error: "Already owned" }, { status: 409 })
    if (msg === "BROKE") return NextResponse.json({ error: "Not enough coins" }, { status: 402 })
    return NextResponse.json({ error: "Purchase failed" }, { status: 500 })
  }
}
