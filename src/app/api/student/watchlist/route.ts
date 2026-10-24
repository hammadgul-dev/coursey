import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {courseIdBodySchema} from "@/validations/course"

export async function GET() {
  try {
    let {error, user} = await requireRole(["STUDENT"])
    if (error) return error

    let userId = user?.id || ""

    let items = await prisma.watchlist.findMany({
      where: {userId, course: {status: "PUBLISHED"}},
      orderBy: {createdAt: "desc"},
      take: 50,
      select: {
        createdAt: true,
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            level: true,
            cover: true,
            instructor: {select: {id: true, name: true}},
            modules: {
              select: {lessons: {select: {readMinutes: true}}},
            },
          },
        },
      },
    })

    let courseIds = items.map((i) => i.course?.id || "")

    let ratings: any = []
    if (courseIds.length > 0) {
      ratings = await prisma.review.groupBy({
        by: ["courseId"],
        where: {courseId: {in: courseIds}},
        _avg: {rating: true},
        _count: {rating: true},
      })
    }

    let ratingMap: any = {}
    for (let r of ratings || []) {
      ratingMap[r.courseId] = {
        rating: Math.round((r._avg?.rating || 0) * 10) / 10,
        reviewsCount: r._count?.rating || 0,
      }
    }

    let courses = items.map((i) => {
      let c: any = i.course
      let lessons = (c?.modules || []).flatMap((m: any) => m?.lessons || [])
      return {
        id: c?.id,
        title: c?.title,
        description: c?.description,
        category: c?.category,
        level: c?.level,
        cover: c?.cover,
        instructor: c?.instructor,
        rating: ratingMap[c?.id]?.rating || 0,
        reviewsCount: ratingMap[c?.id]?.reviewsCount || 0,
        lessonsCount: lessons.length,
        totalReadMinutes: lessons.reduce(
          (sum: number, l: any) => sum + (l?.readMinutes || 0),
          0,
        ),
        addedAt: i.createdAt,
      }
    })

    return ok({courses})
  } catch (e) {
    return serverError()
  }
}

export async function POST(req: Request) {
  try {
    let {error, user} = await requireRole(["STUDENT"])
    if (error) return error

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = courseIdBodySchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let userId = user?.id || ""

    let course = await prisma.course.findFirst({
      where: {id: parsed.data.courseId, status: "PUBLISHED"},
      select: {id: true},
    })
    if (!course) return fail("Course Not Found", 404)

    let existing = await prisma.watchlist.findUnique({
      where: {userId_courseId: {userId, courseId: course.id}},
      select: {courseId: true},
    })
    if (existing) return fail("Already In Watchlist", 409)

    try {
      await prisma.watchlist.create({data: {userId, courseId: course.id}})
    } catch (e: any) {
      if (e?.code === "P2002") return fail("Already In Watchlist", 409)
      throw e
    }

    return ok({courseId: course.id, saved: true}, 201)
  } catch (e) {
    return serverError()
  }
}

export async function DELETE(req: Request) {
  try {
    let {error, user} = await requireRole(["STUDENT"])
    if (error) return error

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = courseIdBodySchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let result = await prisma.watchlist.deleteMany({
      where: {userId: user?.id || "", courseId: parsed.data.courseId},
    })
    if (result.count === 0) return fail("Not In Watchlist", 404)

    return ok({courseId: parsed.data.courseId, saved: false})
  } catch (e) {
    return serverError()
  }
}
