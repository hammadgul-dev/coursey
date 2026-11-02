import {prisma} from "@/lib/prisma"
import {ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"

let DAY = 86400000

function dayKey(time: number) {
  return new Date(time).toISOString().slice(0, 10)
}

export async function GET() {
  try {
    let {error, user} = await requireRole(["STUDENT"])
    if (error) return error

    let userId = user?.id || ""

    let [enrolledCount, completedCourses, lessonsDone, progressRows] =
      await Promise.all([
        prisma.enrollment.count({
          where: {userId, course: {status: "PUBLISHED"}},
        }),
        prisma.enrollment.count({
          where: {
            userId,
            completedAt: {not: null},
            course: {status: "PUBLISHED"},
          },
        }),
        prisma.lessonProgress.count({where: {userId}}),
        prisma.lessonProgress.findMany({
          where: {userId},
          orderBy: {completedAt: "desc"},
          take: 2000,
          select: {completedAt: true},
        }),
      ])

    let days: any = {}
    for (let row of progressRows || []) {
      if (!row?.completedAt) continue
      days[dayKey(new Date(row.completedAt).getTime())] = true
    }

    let now = Date.now()
    let activeToday = !!days[dayKey(now)]
    let cursor = activeToday ? now : now - DAY
    let streak = 0

    while (days[dayKey(cursor)]) {
      streak += 1
      cursor -= DAY
    }

    return ok({
      enrolledCount,
      completedCourses,
      lessonsDone,
      streak,
      activeToday,
    })
  } catch (e) {
    return serverError()
  }
}
