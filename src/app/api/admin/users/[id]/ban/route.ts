import {z} from "zod"
import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"

let banSchema = z.object({
  banned: z.boolean({message: "Banned Must Be True Or False"}),
})

export async function POST(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    let {error, user} = await requireRole(["ADMIN"])
    if (error) return error

    let {id} = await params
    let parsedId = idSchema.safeParse(id)
    if (!parsedId.success) return fail("Invalid Id", 400)

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = banSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let target = await prisma.user.findUnique({
      where: {id: parsedId.data},
      select: {id: true, role: true},
    })
    if (!target) return fail("User Not Found", 404)

    if (target.role === "ADMIN" || target.id === user.id) {
      return fail("Admin Cannot Be Banned", 403)
    }

    await prisma.user.update({
      where: {id: target.id},
      data: {banned: parsed.data.banned},
    })

    return ok({id: target.id, banned: parsed.data.banned})
  } catch (e) {
    return serverError()
  }
}
