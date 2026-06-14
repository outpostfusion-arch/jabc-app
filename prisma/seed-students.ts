import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const students = [
  { displayName: "Aiden Park",     username: "aiden_p",   avatar: "fox"      },
  { displayName: "Bella Torres",   username: "bella_t",   avatar: "panda"    },
  { displayName: "Carlos Nguyen",  username: "carlos_n",  avatar: "lion"     },
  { displayName: "Daisy Kim",      username: "daisy_k",   avatar: "bunny"    },
  { displayName: "Ethan Okafor",   username: "ethan_o",   avatar: "bear"     },
  { displayName: "Fiona Patel",    username: "fiona_p",   avatar: "owl"      },
  { displayName: "George Mensah",  username: "george_m",  avatar: "tiger"    },
  { displayName: "Hana Suzuki",    username: "hana_s",    avatar: "deer"     },
  { displayName: "Ivan Rosario",   username: "ivan_r",    avatar: "penguin"  },
  { displayName: "Jade Williamson",username: "jade_w",    avatar: "axolotl"  },
]

async function main() {
  const password = await bcrypt.hash("student123", 10)

  for (const s of students) {
    await prisma.user.upsert({
      where: { username: s.username },
      update: {},
      create: {
        username: s.username,
        passwordHash: password,
        displayName: s.displayName,
        role: "STUDENT",
        classCode: "CLASS2024",
        avatarEmoji: s.avatar,
      },
    })
    console.log(`✅ ${s.displayName} (${s.username})`)
  }

  console.log("\nAll 10 students created. Password for all: student123")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
