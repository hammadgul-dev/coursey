import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {forgotSchema} from "@/validations/auth"
import {checkRate} from "@/lib/ratelimit"
import {sendVerification} from "@/lib/verify"

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

    let ipLimit = await checkRate("rl:resend:ip:" + ip, 10, 3600)
    if (!ipLimit.allowed) return fail(ipLimit.message, 429)

    let emailLimit = await checkRate("rl:resend:email:" + email, 3, 3600)
    if (!emailLimit.allowed) return fail(emailLimit.message, 429)

    let user = await prisma.user.findUnique({
      where: {email},
      select: {id: true, banned: true, emailVerified: true},
    })

    if (user && !user.banned && !user.emailVerified) {
      await sendVerification(user.id, email)
    }

    return ok({
      sent: true,
      message: "If The Account Exists, A Verification Email Has Been Sent",
    })
  } catch (e) {
    return serverError()
  }
}
