import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {checkpointSchema, idSchema, reorderSchema} from "@/validations/course"
import {isEditable, ownedLesson} from "@/lib/ownership"

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

    let lesson = await ownedLesson(parsedId.data, user.id)
    if (!lesson) return fail("Lesson Not Found", 404)
    if (!isEditable(lesson.module.course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = checkpointSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let count = await prisma.checkpoint.count({where: {lessonId: lesson.id}})
    if (count >= 10) return fail("Checkpoint Limit Reached", 403)

    let last = await prisma.checkpoint.aggregate({
      where: {lessonId: lesson.id},
      _max: {position: true},
    })

    let created = await prisma.checkpoint.create({
      data: {
        question: parsed.data.question,
        answer: parsed.data.answer,
        position: (last?._max?.position ?? -1) + 1,
        lessonId: lesson.id,
      },
      select: {id: true, question: true, answer: true, position: true},
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

    let lesson = await ownedLesson(parsedId.data, user.id)
    if (!lesson) return fail("Lesson Not Found", 404)
    if (!isEditable(lesson.module.course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = reorderSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let ids = parsed.data.ids
    let existing = await prisma.checkpoint.findMany({
      where: {lessonId: lesson.id},
      select: {id: true},
    })
    let valid = new Set(existing.map((c: any) => c.id))

    if (
      ids.length !== valid.size ||
      new Set(ids).size !== ids.length ||
      !ids.every((x: string) => valid.has(x))
    ) {
      return fail("Invalid Order", 400)
    }

    await prisma.$transaction(
      ids.map((x: string, i: number) =>
        prisma.checkpoint.update({where: {id: x}, data: {position: i}}),
      ),
    )

    return ok({ids})
  } catch (e) {
    return serverError()
  }
}
