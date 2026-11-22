import {randomBytes, createHash} from "crypto"
import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {forgotSchema} from "@/validations/auth"
import {checkRate} from "@/lib/ratelimit"
import {sendEmail, resetEmailHtml} from "@/lib/email"

export async function POST(req: Request) {
  try {
    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = forgotSchema.safeParse(body)
    if (!parsed.success)
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)

    let email = parsed.data.email
    let ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      "unknown"

    let ipLimit = await checkRate("rl:forgot:ip:" + ip, 10, 3600)
    if (!ipLimit.allowed) return fail(ipLimit.message, 429)

    let emailLimit = await checkRate("rl:forgot:email:" + email, 3, 3600)
    if (!emailLimit.allowed) return fail(emailLimit.message, 429)

    let user = await prisma.user.findUnique({
      where: {email},
      select: {id: true, banned: true},
    })

    if (user && !user.banned) {
      let token = randomBytes(32).toString("hex")
      let tokenHash = createHash("sha256").update(token).digest("hex")

      await prisma.$transaction(async (tx: any) => {
        await tx.passwordResetToken.updateMany({
          where: {userId: user.id, usedAt: null},
          data: {usedAt: new Date()},
        })
        await tx.passwordResetToken.create({
          data: {
            userId: user.id,
            tokenHash,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          },
        })
      })

      let base = process.env.NEXTAUTH_URL || "http://localhost:3000"
      let link = base + "/reset-password?token=" + token
      let sent = await sendEmail(
        email,
        "Reset Your Coursey Password",
        resetEmailHtml(link),
      )
      if (!sent) console.error("Reset Email Failed")
    }

    return ok({
      sent: true,
      message: "If The Email Exists, A Reset Link Has Been Sent",
    })
  } catch (e) {
    return serverError()
  }
}
