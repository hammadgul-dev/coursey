import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {checkpointUpdateSchema, idSchema} from "@/validations/course"
import {isEditable, ownedCheckpoint} from "@/lib/ownership"

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

    let checkpoint = await ownedCheckpoint(parsedId.data, user.id)
    if (!checkpoint) return fail("Checkpoint Not Found", 404)
    if (!isEditable(checkpoint.lesson.module.course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = checkpointUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let d: any = parsed.data
    let data: any = {}

    if ("question" in body) data.question = d.question
    if ("answer" in body) data.answer = d.answer

    if (Object.keys(data).length === 0) return fail("Nothing To Update", 400)

    await prisma.checkpoint.update({where: {id: checkpoint.id}, data})

    return ok({id: checkpoint.id})
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

    let checkpoint = await ownedCheckpoint(parsedId.data, user.id)
    if (!checkpoint) return fail("Checkpoint Not Found", 404)
    if (!isEditable(checkpoint.lesson.module.course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    await prisma.checkpoint.delete({where: {id: checkpoint.id}})

    return ok({id: checkpoint.id})
  } catch (e) {
    return serverError()
  }
}
