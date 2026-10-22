import {PrismaClient} from "@prisma/client"

let globalForPrisma = globalThis as any

export let prisma: PrismaClient = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
