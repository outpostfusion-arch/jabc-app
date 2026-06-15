import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const badge = await prisma.badge.upsert({
    where: { slug: "reflection-complete" },
    create: {
      slug: "reflection-complete",
      name: "Reflection Complete",
      description: "Submitted a full program reflection",
      emoji: "📝",
      pointValue: 15,
    },
    update: {
      name: "Reflection Complete",
      description: "Submitted a full program reflection",
      emoji: "📝",
      pointValue: 15,
    },
  })
  console.log("Badge upserted:", badge.slug, badge.emoji)
}

main().catch(console.error).finally(() => prisma.$disconnect())
