import {randomBytes, createHash} from "crypto"
import {prisma} from "@/lib/prisma"
import {sendEmail, verifyEmailHtml} from "@/lib/email"

export async function sendVerification(userId: string, email: string) {
  let token = randomBytes(32).toString("hex")
  let tokenHash = createHash("sha256").update(token).digest("hex")

  await prisma.$transaction(async (tx: any) => {
    await tx.emailVerificationToken.updateMany({
      where: {userId, usedAt: null},
      data: {usedAt: new Date()},
    })
    await tx.emailVerificationToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })
  })

  let base = process.env.NEXTAUTH_URL || "http://localhost:3000"
  let link = base + "/verify-email?token=" + token
  let sent = await sendEmail(
    email,
    "Verify Your Coursey Email",
    verifyEmailHtml(link),
  )
  if (!sent) console.error("Verify Email Failed")
  return sent
}
