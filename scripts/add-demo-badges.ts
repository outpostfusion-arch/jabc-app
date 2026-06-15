import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const [students, badges] = await Promise.all([
    prisma.user.findMany({ where: { role: "STUDENT" } }),
    prisma.badge.findMany(),
  ])

  for (const student of students) {
    // Pick 3–6 random badges per student
    const shuffled = [...badges].sort(() => Math.random() - 0.5)
    const count = 3 + Math.floor(Math.random() * 4)
    const picked = shuffled.slice(0, count)

    for (const badge of picked) {
      try {
        await prisma.userBadge.create({
          data: { userId: student.id, badgeId: badge.id },
        })
        await prisma.user.update({
          where: { id: student.id },
          data: { points: { increment: badge.pointValue } },
        })
      } catch {
        // already has badge, skip
      }
    }

    console.log(`${student.displayName}: ${picked.map((b) => b.emoji).join(" ")}`)
  }

  console.log("Done!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
