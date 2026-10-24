import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema, lessonSchema, reorderSchema} from "@/validations/course"
import {isEditable, ownedModule} from "@/lib/ownership"

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

    let mod = await ownedModule(parsedId.data, user.id)
    if (!mod) return fail("Module Not Found", 404)
    if (!isEditable(mod.course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = lessonSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let count = await prisma.lesson.count({where: {moduleId: mod.id}})
    if (count >= 50) return fail("Lesson Limit Reached", 403)

    let last = await prisma.lesson.aggregate({
      where: {moduleId: mod.id},
      _max: {position: true},
    })

    let d: any = parsed.data

    let created = await prisma.lesson.create({
      data: {
        title: d.title,
        content: d.content || "",
        readMinutes: d.readMinutes || 1,
        isFree: !!d.isFree,
        position: (last?._max?.position ?? -1) + 1,
        moduleId: mod.id,
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

    let mod = await ownedModule(parsedId.data, user.id)
    if (!mod) return fail("Module Not Found", 404)
    if (!isEditable(mod.course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = reorderSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let ids = parsed.data.ids
    let existing = await prisma.lesson.findMany({
      where: {moduleId: mod.id},
      select: {id: true},
    })
    let valid = new Set(existing.map((l: any) => l.id))

    if (
      ids.length !== valid.size ||
      new Set(ids).size !== ids.length ||
      !ids.every((x: string) => valid.has(x))
    ) {
      return fail("Invalid Order", 400)
    }

    await prisma.$transaction(
      ids.map((x: string, i: number) =>
        prisma.lesson.update({where: {id: x}, data: {position: i}}),
      ),
    )

    return ok({ids})
  } catch (e) {
    return serverError()
  }
}
