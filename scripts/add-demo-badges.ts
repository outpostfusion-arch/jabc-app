import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// Badges earned when each session is completed
const SESSION_BADGES: Record<number, string[]> = {
  1: ["business-architect"],
  2: ["market-explorer", "promo-master"],
  3: ["team-player"],
  4: ["maker"],
  5: ["price-setter", "first-profit"],
  6: ["entrepreneur"],
}

// Tiers: [completed sessions, in-progress session or null]
const TIERS: [number, number | null][] = [
  [0, null],      // nothing started
  [0, 1],         // S1 in progress
  [1, null],      // S1 done
  [1, 2],         // S1 done, S2 in progress
  [2, 3],         // S1-S2 done, S3 in progress
  [2, 3],         // S1-S2 done, S3 in progress
  [3, 4],         // S1-S3 done, S4 in progress
  [4, 5],         // S1-S4 done, S5 in progress
  [4, 5],         // S1-S4 done, S5 in progress
  [5, 6],         // S1-S5 done, S6 in progress
  [6, null],      // all done!
]

async function main() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { displayName: "asc" },
  })

  const badges = await prisma.badge.findMany()
  const badgeMap = Object.fromEntries(badges.map((b) => [b.slug, b]))

  // Shuffle tiers so assignment is random
  const shuffledTiers = [...TIERS].sort(() => Math.random() - 0.5)

  for (let i = 0; i < students.length; i++) {
    const student = students[i]
    const [completedCount, inProgressSession] = shuffledTiers[i % shuffledTiers.length]

    // Clear existing data
    await prisma.sessionProgress.deleteMany({ where: { userId: student.id } })
    await prisma.userBadge.deleteMany({ where: { userId: student.id } })
    await prisma.user.update({ where: { id: student.id }, data: { points: 0 } })

    // Set session progress
    for (let s = 1; s <= 6; s++) {
      let status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" = "NOT_STARTED"
      if (s <= completedCount) status = "COMPLETED"
      else if (s === inProgressSession) status = "IN_PROGRESS"

      await prisma.sessionProgress.create({
        data: { userId: student.id, sessionId: s, status },
      })
    }

    // Award badges for completed sessions
    let totalPoints = 0
    for (let s = 1; s <= completedCount; s++) {
      const slugs = SESSION_BADGES[s] ?? []
      for (const slug of slugs) {
        const badge = badgeMap[slug]
        if (!badge) continue
        await prisma.userBadge.create({ data: { userId: student.id, badgeId: badge.id } })
        totalPoints += badge.pointValue
      }
    }

    await prisma.user.update({ where: { id: student.id }, data: { points: totalPoints } })

    const sessionLabel = inProgressSession
      ? `S1-S${completedCount} done, S${inProgressSession} in progress`
      : completedCount === 0 ? "not started" : `S1-S${completedCount} done`
    console.log(`${student.displayName}: ${sessionLabel} (${totalPoints} pts)`)
  }

  console.log("\nDone!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
