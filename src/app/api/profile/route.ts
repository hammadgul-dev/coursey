import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {profileSchema} from "@/validations/profile"

let select = {
  id: true,
  name: true,
  email: true,
  role: true,
  headline: true,
  bio: true,
  avatar: true,
  createdAt: true,
}

export async function GET() {
  try {
    let {error, user} = await requireRole(["STUDENT", "INSTRUCTOR", "ADMIN"])
    if (error) return error

    let profile = await prisma.user.findUnique({
      where: {id: user?.id || ""},
      select,
    })
    if (!profile) return fail("User Not Found", 404)

    return ok(profile)
  } catch (e) {
    return serverError()
  }
}

export async function PATCH(req: Request) {
  try {
    let {error, user} = await requireRole(["STUDENT", "INSTRUCTOR", "ADMIN"])
    if (error) return error

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = profileSchema.safeParse(body)
    if (!parsed.success)
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)

    let data: any = {}

    if (parsed.data.name !== undefined) data.name = parsed.data.name
    if (parsed.data.bio !== undefined) data.bio = parsed.data.bio || null
    if (parsed.data.headline !== undefined) {
      if (user?.role !== "INSTRUCTOR")
        return fail("Only Instructors Can Set A Headline", 403)
      data.headline = parsed.data.headline || null
    }

    if (Object.keys(data).length === 0) return fail("Nothing To Update", 400)

    let profile = await prisma.user.update({
      where: {id: user?.id || ""},
      data,
      select,
    })

    return ok(profile)
  } catch (e) {
    return serverError()
  }
}
