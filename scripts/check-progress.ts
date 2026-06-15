import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })

async function main() {
  const data = await prisma.sessionProgress.findMany({
    where: { user: { role: "STUDENT" } },
    include: { user: { select: { displayName: true } } },
    orderBy: [{ userId: "asc" }, { sessionId: "asc" }],
  })
  for (const d of data) {
    console.log(`${d.user.displayName.padEnd(20)} S${d.sessionId} ${d.status}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
