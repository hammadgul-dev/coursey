import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema, lessonUpdateSchema} from "@/validations/course"
import {isEditable, ownedLesson} from "@/lib/ownership"

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

    let lesson = await ownedLesson(parsedId.data, user.id)
    if (!lesson) return fail("Lesson Not Found", 404)
    if (!isEditable(lesson.module.course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = lessonUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let d: any = parsed.data
    let data: any = {}

    if ("title" in body) data.title = d.title
    if ("content" in body) data.content = d.content || ""
    if ("readMinutes" in body) data.readMinutes = d.readMinutes
    if ("isFree" in body) data.isFree = !!d.isFree

    if (Object.keys(data).length === 0) return fail("Nothing To Update", 400)

    await prisma.lesson.update({where: {id: lesson.id}, data})

    return ok({id: lesson.id})
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

    let lesson = await ownedLesson(parsedId.data, user.id)
    if (!lesson) return fail("Lesson Not Found", 404)
    if (!isEditable(lesson.module.course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    await prisma.lesson.delete({where: {id: lesson.id}})

    return ok({id: lesson.id})
  } catch (e) {
    return serverError()
  }
}
