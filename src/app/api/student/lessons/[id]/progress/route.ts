import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"

export async function POST(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    let {error, user} = await requireRole(["STUDENT"])
    if (error) return error

    let {id} = await params
    let parsedId = idSchema.safeParse(id)
    if (!parsedId.success) return fail("Invalid Id", 400)

    let userId = user?.id || ""

    let lesson = await prisma.lesson.findFirst({
      where: {id: parsedId.data},
      select: {
        id: true,
        module: {
          select: {
            courseId: true,
            course: {select: {status: true}},
          },
        },
      },
    })
    if (!lesson || lesson.module?.course?.status !== "PUBLISHED") {
      return fail("Lesson Not Found", 404)
    }

    let courseId = lesson.module?.courseId || ""

    let enrollment = await prisma.enrollment.findUnique({
      where: {userId_courseId: {userId, courseId}},
      select: {id: true},
    })
    if (!enrollment) return fail("You Are Not Enrolled In This Course", 403)

    await prisma.lessonProgress.upsert({
      where: {userId_lessonId: {userId, lessonId: lesson.id}},
      create: {userId, lessonId: lesson.id},
      update: {},
    })

    let total = await prisma.lesson.count({
      where: {module: {courseId}},
    })
    let done = await prisma.lessonProgress.count({
      where: {userId, lesson: {module: {courseId}}},
    })

    let courseCompleted = total > 0 && done >= total

    if (courseCompleted) {
      await prisma.enrollment.updateMany({
        where: {userId, courseId, completedAt: null},
        data: {completedAt: new Date()},
      })
    }

    return ok({
      lessonId: lesson.id,
      completed: true,
      completedLessons: done,
      totalLessons: total,
      courseCompleted,
    })
  } catch (e) {
    return serverError()
  }
}
