import {prisma} from "@/lib/prisma"
import {ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"

export async function GET() {
  try {
    let {error, user} = await requireRole(["INSTRUCTOR"])
    if (error) return error

    let userId = user?.id || ""

    let grouped: any = []
    grouped = await prisma.course.groupBy({
      by: ["status"],
      where: {instructorId: userId},
      _count: {_all: true},
    })

    let courses: any = {
      draft: 0,
      pending: 0,
      published: 0,
      rejected: 0,
      removed: 0,
    }
    for (let row of grouped || []) {
      let key = String(row?.status || "").toLowerCase()
      if (key in courses) courses[key] = row?._count?._all || 0
    }

    let [students, rating] = await Promise.all([
      prisma.enrollment.findMany({
        where: {course: {instructorId: userId, status: "PUBLISHED"}},
        distinct: ["userId"],
        select: {userId: true},
      }),
      prisma.review.aggregate({
        where: {course: {instructorId: userId, status: "PUBLISHED"}},
        _avg: {rating: true},
        _count: {_all: true},
      }),
    ])

    let avg = rating?._avg?.rating || 0

    return ok({
      courses,
      totalStudents: students?.length || 0,
      avgRating: Math.round(avg * 10) / 10,
      reviewsCount: rating?._count?._all || 0,
    })
  } catch (e) {
    return serverError()
  }
}
