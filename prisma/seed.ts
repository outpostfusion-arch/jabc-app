import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Seed class sessions
  const sessions = [
    {
      id: 1,
      title: "What Is a Business?",
      description: "Explore what businesses do and plan yours using the Business Model Canvas.",
      bcCurriculumTag: "ADST 6-8: Generate potential ideas; Careers 8: Connect skills to community needs",
      sortOrder: 1,
    },
    {
      id: 2,
      title: "Target Markets & Promotions",
      description: "Discover your target customer and explore types of promotions.",
      bcCurriculumTag: "ADST 6-8: Identify user needs; Business Education 8: Marketing strategies",
      sortOrder: 2,
    },
    {
      id: 3,
      title: "Team Marketing Workshop",
      description: "Work as a team to craft marketing messaging for your business.",
      bcCurriculumTag: "ELA 6-8: Exchange ideas; ADST 6-8: Collaborative design; Careers 8: Teamwork",
      sortOrder: 3,
    },
    {
      id: 4,
      title: "Product Creation Tutorials",
      description: "Learn to make a 3D printed fidget toy and laser-cut earrings.",
      bcCurriculumTag: "ADST 6-8: Use technologies safely; Document design decisions",
      sortOrder: 4,
    },
    {
      id: 5,
      title: "Financial Basics",
      description: "Track income and expenses, and learn to price your products.",
      bcCurriculumTag: "Math 6-8: Financial literacy; Business Ed 8: Calculate costs and profit",
      sortOrder: 5,
    },
    {
      id: 6,
      title: "Final Product: Your Brand",
      description: "Create your logo, brand name, and sales pitch to complete your business plan.",
      bcCurriculumTag: "ADST 6-8: Share and reflect on design; ELA 6-8: Communicate for purpose; Careers 8",
      sortOrder: 6,
    },
  ]

  for (const session of sessions) {
    await prisma.classSession.upsert({
      where: { id: session.id },
      update: session,
      create: session,
    })
  }

  // Seed badges
  const badges = [
    { slug: "business-architect", name: "Business Architect", description: "Completed all 9 blocks of the Business Model Canvas", emoji: "🏗️", pointValue: 25 },
    { slug: "market-explorer", name: "Market Explorer", description: "Built a target market persona", emoji: "🔍", pointValue: 15 },
    { slug: "promo-master", name: "Promo Master", description: "Completed the promotions quiz", emoji: "📣", pointValue: 15 },
    { slug: "team-player", name: "Team Player", description: "Contributed to the team marketing doc", emoji: "🤝", pointValue: 15 },
    { slug: "maker", name: "Maker", description: "Watched both product tutorials and answered reflections", emoji: "⚙️", pointValue: 20 },
    { slug: "price-setter", name: "Price Setter", description: "Completed your first pricing calculation", emoji: "💡", pointValue: 15 },
    { slug: "first-profit", name: "First Profit", description: "Recorded 5 or more financial transactions", emoji: "💰", pointValue: 20 },
    { slug: "entrepreneur", name: "Entrepreneur", description: "Completed all 6 sessions!", emoji: "🚀", pointValue: 50 },
  ]

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: badge,
      create: badge,
    })
  }

  // Seed teacher account
  const teacherPassword = await bcrypt.hash("teacher123", 12)
  await prisma.user.upsert({
    where: { username: "teacher" },
    update: {},
    create: {
      username: "teacher",
      passwordHash: teacherPassword,
      displayName: "Teacher",
      role: "TEACHER",
      classCode: "CLASS2024",
    },
  })

  console.log("✅ Database seeded successfully")
  console.log("Teacher login: username=teacher, password=teacher123")
  console.log("⚠️  Change the teacher password after first login!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
