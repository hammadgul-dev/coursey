import {PrismaClient} from "@prisma/client"
import bcrypt from "bcryptjs"

let prisma = new PrismaClient()

async function main() {
  let email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase()
  let password = process.env.ADMIN_PASSWORD || ""

  if (!email || !password) {
    throw new Error("Admin Email And Password Are Required In Env")
  }

  if (password.length < 8) {
    throw new Error("Admin Password Must Be At Least 8 Characters")
  }

  let passwordHash = await bcrypt.hash(password, 12)

  let admin = await prisma.user.upsert({
    where: {email},
    update: {passwordHash, role: "ADMIN", banned: false},
    create: {
      name: "Admin",
      email,
      passwordHash,
      role: "ADMIN",
    },
  })

  console.log("Admin Ready:", admin?.email)
}

main()
  .catch((e) => {
    console.error(e?.message || "Seed Failed")
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
