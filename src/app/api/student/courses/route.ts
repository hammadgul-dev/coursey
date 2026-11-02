import {prisma} from "@/lib/prisma"
import {ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"

export async function GET() {
  try {
    let {error, user} = await requireRole(["STUDENT"])
    if (error) return error

    let userId = user?.id || ""

    let enrollments = await prisma.enrollment.findMany({
      where: {userId, course: {status: "PUBLISHED"}},
      orderBy: {createdAt: "desc"},
      take: 50,
      select: {
        createdAt: true,
        completedAt: true,
        course: {
          select: {
            id: true,
            title: true,
            category: true,
            level: true,
            cover: true,
            instructor: {select: {id: true, name: true}},
            modules: {
              orderBy: {position: "asc"},
              select: {
                lessons: {
                  orderBy: {position: "asc"},
                  select: {id: true, readMinutes: true},
                },
              },
            },
          },
        },
      },
    })

    let courseIds: string[] = enrollments.map((e) => e.course.id)

    let progressRows: any = []
    if (courseIds.length > 0) {
      progressRows = await prisma.lessonProgress.findMany({
        where: {userId, lesson: {module: {courseId: {in: courseIds}}}},
        select: {
          lessonId: true,
          completedAt: true,
          lesson: {select: {module: {select: {courseId: true}}}},
        },
      })
    }

    let doneIds: any = {}
    let lastActivity: any = {}

    for (let row of progressRows || []) {
      let courseId = row?.lesson?.module?.courseId || ""
      if (!courseId) continue
      if (!doneIds[courseId]) doneIds[courseId] = {}
      doneIds[courseId][row.lessonId] = true
      let time = row?.completedAt ? new Date(row.completedAt).getTime() : 0
      if (time > (lastActivity[courseId] || 0)) lastActivity[courseId] = time
    }

    let courses = enrollments.map((e) => {
      let lessons: any = []
      for (let m of e.course.modules || []) {
        for (let l of m.lessons || []) lessons.push(l)
      }

      let done = doneIds[e.course.id] || {}
      let totalLessons = lessons.length
      let completedLessons = lessons.filter((l: any) => done[l.id]).length
      let totalReadMinutes = lessons.reduce(
        (sum: number, l: any) => sum + (l.readMinutes || 0),
        0,
      )
      let nextLesson = lessons.find((l: any) => !done[l.id])
      let last = lastActivity[e.course.id] || 0

      return {
        id: e.course.id,
        title: e.course.title,
        category: e.course.category,
        level: e.course.level,
        cover: e.course.cover,
        instructor: e.course.instructor,
        totalLessons,
        completedLessons,
        progress:
          totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0,
        totalReadMinutes,
        nextLessonId: nextLesson?.id || null,
        lastActivity: last ? new Date(last).toISOString() : null,
        enrolledAt: e.createdAt,
        completedAt: e.completedAt,
      }
    })

    return ok({courses})
  } catch (e) {
    return serverError()
  }
}
