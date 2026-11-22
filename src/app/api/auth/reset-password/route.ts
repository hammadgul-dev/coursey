import {createHash} from "crypto"
import bcrypt from "bcryptjs"
import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {resetSchema} from "@/validations/auth"
import {checkRate} from "@/lib/ratelimit"

export async function POST(req: Request) {
  try {
    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = resetSchema.safeParse(body)
    if (!parsed.success)
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)

    let ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      "unknown"
    let limit = await checkRate("rl:reset:ip:" + ip, 10, 3600)
    if (!limit.allowed) return fail(limit.message, 429)

    let tokenHash = createHash("sha256").update(parsed.data.token).digest("hex")

    let record = await prisma.passwordResetToken.findUnique({
      where: {tokenHash},
      select: {id: true, userId: true, usedAt: true, expiresAt: true},
    })

    if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
      return fail("Invalid Or Expired Link", 400)
    }

    let passwordHash = await bcrypt.hash(parsed.data.password, 12)

    let done = await prisma.$transaction(async (tx: any) => {
      let used = await tx.passwordResetToken.updateMany({
        where: {id: record.id, usedAt: null, expiresAt: {gt: new Date()}},
        data: {usedAt: new Date()},
      })
      if (used.count === 0) return false

      await tx.user.update({
        where: {id: record.userId},
        data: {passwordHash, tokenVersion: {increment: 1}},
        select: {id: true},
      })
      await tx.passwordResetToken.updateMany({
        where: {userId: record.userId, usedAt: null},
        data: {usedAt: new Date()},
      })
      return true
    })

    if (!done) return fail("Invalid Or Expired Link", 400)

    return ok({reset: true})
  } catch (e) {
    return serverError()
  }
}
