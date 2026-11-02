import bcrypt from "bcryptjs"
import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {passwordSchema} from "@/validations/profile"

export async function POST(req: Request) {
  try {
    let {error, user} = await requireRole(["STUDENT", "INSTRUCTOR", "ADMIN"])
    if (error) return error

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = passwordSchema.safeParse(body)
    if (!parsed.success)
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)

    let userId = user?.id || ""

    let account = await prisma.user.findUnique({
      where: {id: userId},
      select: {passwordHash: true},
    })
    if (!account) return fail("User Not Found", 404)

    let valid = await bcrypt.compare(
      parsed.data.currentPassword,
      account.passwordHash || "",
    )
    if (!valid) return fail("Current Password Is Incorrect", 400)

    if (parsed.data.currentPassword === parsed.data.newPassword) {
      return fail("New Password Must Be Different", 400)
    }

    let passwordHash = await bcrypt.hash(parsed.data.newPassword, 12)

    await prisma.user.update({
      where: {id: userId},
      data: {passwordHash},
      select: {id: true},
    })

    return ok({changed: true})
  } catch (e) {
    return serverError()
  }
}
