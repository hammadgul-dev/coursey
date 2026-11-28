import {createHash} from "crypto"
import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {verifySchema} from "@/validations/auth"
import {checkRate} from "@/lib/ratelimit"

export async function POST(req: Request) {
  try {
    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = verifySchema.safeParse(body)
    if (!parsed.success)
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)

    let ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      "unknown"
    let limit = await checkRate("rl:verify:ip:" + ip, 20, 3600)
    if (!limit.allowed) return fail(limit.message, 429)

    let tokenHash = createHash("sha256").update(parsed.data.token).digest("hex")

    let record = await prisma.emailVerificationToken.findUnique({
      where: {tokenHash},
      select: {id: true, userId: true, usedAt: true, expiresAt: true},
    })

    if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
      return fail("Invalid Or Expired Link", 400)
    }

    let done = await prisma.$transaction(async (tx: any) => {
      let used = await tx.emailVerificationToken.updateMany({
        where: {id: record.id, usedAt: null, expiresAt: {gt: new Date()}},
        data: {usedAt: new Date()},
      })
      if (used.count === 0) return false

      await tx.user.update({
        where: {id: record.userId},
        data: {emailVerified: new Date()},
        select: {id: true},
      })
      await tx.emailVerificationToken.updateMany({
        where: {userId: record.userId, usedAt: null},
        data: {usedAt: new Date()},
      })
      return true
    })

    if (!done) return fail("Invalid Or Expired Link", 400)

    return ok({verified: true})
  } catch (e) {
    return serverError()
  }
}
