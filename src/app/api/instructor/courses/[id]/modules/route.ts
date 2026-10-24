import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema, moduleSchema, reorderSchema} from "@/validations/course"
import {isEditable, ownedCourse} from "@/lib/ownership"

export async function POST(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    let {error, user} = await requireRole(["INSTRUCTOR"])
    if (error) return error

    let {id} = await params
    let parsedId = idSchema.safeParse(id)
    if (!parsedId.success) return fail("Invalid Id", 400)

    let course = await ownedCourse(parsedId.data, user.id)
    if (!course) return fail("Course Not Found", 404)
    if (!isEditable(course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = moduleSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let count = await prisma.module.count({where: {courseId: course.id}})
    if (count >= 30) return fail("Module Limit Reached", 403)

    let last = await prisma.module.aggregate({
      where: {courseId: course.id},
      _max: {position: true},
    })

    let created = await prisma.module.create({
      data: {
        title: parsed.data.title,
        position: (last?._max?.position ?? -1) + 1,
        courseId: course.id,
      },
      select: {id: true, title: true, position: true},
    })

    return ok(created, 201)
  } catch (e) {
    return serverError()
  }
}

export async function PUT(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    let {error, user} = await requireRole(["INSTRUCTOR"])
    if (error) return error

    let {id} = await params
    let parsedId = idSchema.safeParse(id)
    if (!parsedId.success) return fail("Invalid Id", 400)

    let course = await ownedCourse(parsedId.data, user.id)
    if (!course) return fail("Course Not Found", 404)
    if (!isEditable(course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = reorderSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let ids = parsed.data.ids
    let existing = await prisma.module.findMany({
      where: {courseId: course.id},
      select: {id: true},
    })
    let valid = new Set(existing.map((m: any) => m.id))

    if (
      ids.length !== valid.size ||
      new Set(ids).size !== ids.length ||
      !ids.every((x: string) => valid.has(x))
    ) {
      return fail("Invalid Order", 400)
    }

    await prisma.$transaction(
      ids.map((x: string, i: number) =>
        prisma.module.update({where: {id: x}, data: {position: i}}),
      ),
    )

    return ok({ids})
  } catch (e) {
    return serverError()
  }
}
