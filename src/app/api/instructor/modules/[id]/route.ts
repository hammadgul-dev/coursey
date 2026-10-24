import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema, moduleSchema} from "@/validations/course"
import {isEditable, ownedModule} from "@/lib/ownership"

export async function PATCH(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    let {error, user} = await requireRole(["INSTRUCTOR"])
    if (error) return error

    let {id} = await params
    let parsedId = idSchema.safeParse(id)
    if (!parsedId.success) return fail("Invalid Id", 400)

    let mod = await ownedModule(parsedId.data, user.id)
    if (!mod) return fail("Module Not Found", 404)
    if (!isEditable(mod.course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = moduleSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    await prisma.module.update({
      where: {id: mod.id},
      data: {title: parsed.data.title},
    })

    return ok({id: mod.id})
  } catch (e) {
    return serverError()
  }
}

export async function DELETE(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    let {error, user} = await requireRole(["INSTRUCTOR"])
    if (error) return error

    let {id} = await params
    let parsedId = idSchema.safeParse(id)
    if (!parsedId.success) return fail("Invalid Id", 400)

    let mod = await ownedModule(parsedId.data, user.id)
    if (!mod) return fail("Module Not Found", 404)
    if (!isEditable(mod.course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    await prisma.module.delete({where: {id: mod.id}})

    return ok({id: mod.id})
  } catch (e) {
    return serverError()
  }
}
