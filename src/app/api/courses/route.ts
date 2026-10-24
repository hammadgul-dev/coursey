import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {courseQuerySchema} from "@/validations/course"

function totalRead(course: any) {
  let total = 0
  for (let m of course?.modules || []) {
    for (let l of m?.lessons || []) {
      total += l?.readMinutes || 0
    }
  }
  return total
}

export async function GET(req: Request) {
  try {
    let url = new URL(req.url)
    let raw: any = {}
    url.searchParams.forEach((value, key) => {
      if (value.trim() !== "") raw[key] = value
    })

    let parsed = courseQuerySchema.safeParse(raw)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let {search, category, level, maxRead, page, limit} = parsed.data

    let where: any = {status: "PUBLISHED"}

    if (search) {
      where.OR = [
        {title: {contains: search, mode: "insensitive"}},
        {description: {contains: search, mode: "insensitive"}},
      ]
    }
    if (category) where.category = {equals: category, mode: "insensitive"}
    if (level) where.level = level

    if (maxRead) {
      let candidates = await prisma.course.findMany({
        where,
        select: {
          id: true,
          modules: {select: {lessons: {select: {readMinutes: true}}}},
        },
      })
      let ids = candidates
        .filter((c: any) => totalRead(c) <= maxRead)
        .map((c: any) => c.id)
      where.id = {in: ids}
    }

    let [total, rows] = await Promise.all([
      prisma.course.count({where}),
      prisma.course.findMany({
        where,
        orderBy: {publishedAt: "desc"},
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          level: true,
          cover: true,
          publishedAt: true,
          instructor: {
            select: {id: true, name: true, headline: true, avatar: true},
          },
          modules: {select: {lessons: {select: {readMinutes: true}}}},
          _count: {select: {enrollments: true}},
        },
      }),
    ])

    let ratings: any = []
    let ids = rows.map((r: any) => r.id)
    if (ids.length) {
      ratings = await prisma.review.groupBy({
        by: ["courseId"],
        where: {courseId: {in: ids}},
        orderBy: {courseId: "asc"},
        _avg: {rating: true},
        _count: {rating: true},
      })
    }

    let ratingMap: any = {}
    for (let r of ratings) {
      ratingMap[r.courseId] = {
        avg: Math.round((r?._avg?.rating || 0) * 10) / 10,
        count: r?._count?.rating || 0,
      }
    }

    let courses = rows.map((c: any) => {
      let lessonsCount = 0
      for (let m of c?.modules || []) lessonsCount += m?.lessons?.length || 0

      return {
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        level: c.level,
        cover: c.cover,
        publishedAt: c.publishedAt,
        instructor: c.instructor,
        rating: ratingMap[c.id]?.avg || 0,
        reviewsCount: ratingMap[c.id]?.count || 0,
        studentsCount: c?._count?.enrollments || 0,
        lessonsCount,
        totalReadMinutes: totalRead(c),
      }
    })

    return ok({
      courses,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    })
  } catch (e) {
    return serverError()
  }
}
