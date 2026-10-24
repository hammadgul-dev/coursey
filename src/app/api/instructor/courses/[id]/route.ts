import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {courseUpdateSchema, idSchema} from "@/validations/course"

let editable = ["DRAFT", "REJECTED"] as any

export async function GET(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    let {error, user} = await requireRole(["INSTRUCTOR"])
    if (error) return error

    let {id} = await params
    let parsedId = idSchema.safeParse(id)
    if (!parsedId.success) return fail("Invalid Id", 400)

    let course = await prisma.course.findFirst({
      where: {id: parsedId.data, instructorId: user.id},
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        level: true,
        cover: true,
        learn: true,
        status: true,
        rejectionReason: true,
        submittedAt: true,
        publishedAt: true,
        modules: {
          orderBy: {position: "asc"},
          select: {
            id: true,
            title: true,
            position: true,
            lessons: {
              orderBy: {position: "asc"},
              select: {
                id: true,
                title: true,
                content: true,
                readMinutes: true,
                position: true,
                isFree: true,
                checkpoints: {
                  orderBy: {position: "asc"},
                  select: {
                    id: true,
                    question: true,
                    answer: true,
                    position: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!course) return fail("Course Not Found", 404)
    return ok(course)
  } catch (e) {
    return serverError()
  }
}

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

    let course = await prisma.course.findFirst({
      where: {id: parsedId.data, instructorId: user.id},
      select: {id: true, status: true},
    })
    if (!course) return fail("Course Not Found", 404)

    if (!editable.includes(course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = courseUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let d: any = parsed.data
    let data: any = {}

    if ("title" in body) data.title = d.title
    if ("description" in body) data.description = d.description
    if ("category" in body) data.category = d.category
    if ("level" in body) data.level = d.level
    if ("cover" in body) data.cover = d.cover || null
    if ("learn" in body) data.learn = d.learn || []

    if (Object.keys(data).length === 0) return fail("Nothing To Update", 400)

    let result = await prisma.course.updateMany({
      where: {id: course.id, instructorId: user.id, status: {in: editable}},
      data,
    })
    if (result.count === 0) return fail("Course Could Not Be Updated", 409)

    return ok({id: course.id})
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

    let course = await prisma.course.findFirst({
      where: {id: parsedId.data, instructorId: user.id},
      select: {id: true, status: true},
    })
    if (!course) return fail("Course Not Found", 404)

    if (!editable.includes(course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Deleted", 403)
    }

    let result = await prisma.course.deleteMany({
      where: {id: course.id, instructorId: user.id, status: {in: editable}},
    })
    if (result.count === 0) return fail("Course Could Not Be Deleted", 409)

    return ok({id: course.id})
  } catch (e) {
    return serverError()
  }
}
