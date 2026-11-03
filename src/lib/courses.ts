import {prisma} from "@/lib/prisma"

function totalRead(course: any) {
  let total = 0
  for (let m of course?.modules || []) {
    for (let l of m?.lessons || []) {
      total += l?.readMinutes || 0
    }
  }
  return total
}

export async function getCourses(params: any) {
  let search = params?.search
  let category = params?.category
  let level = params?.level
  let maxRead = params?.maxRead
  let page = params?.page || 1
  let limit = params?.limit || 12

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
    let matched = candidates
      .filter((c: any) => totalRead(c) <= maxRead)
      .map((c: any) => c.id)
    where.id = {in: matched}
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

  return {
    courses,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}

export async function getCourseDetail(id: string, userId?: string | null) {
  let course: any = await prisma.course.findFirst({
    where: {id, status: "PUBLISHED"},
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      level: true,
      cover: true,
      learn: true,
      publishedAt: true,
      instructor: {
        select: {
          id: true,
          name: true,
          headline: true,
          bio: true,
          avatar: true,
        },
      },
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
              readMinutes: true,
              position: true,
              isFree: true,
              content: true,
              checkpoints: {
                orderBy: {position: "asc"},
                select: {id: true, question: true, answer: true},
              },
            },
          },
        },
      },
      reviews: {
        orderBy: {createdAt: "desc"},
        take: 10,
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: {select: {name: true, avatar: true}},
        },
      },
      _count: {select: {enrollments: true}},
    },
  })

  if (!course) return null

  let enrolled = false
  if (userId) {
    let enrollment = await prisma.enrollment.findUnique({
      where: {userId_courseId: {userId, courseId: course.id}},
      select: {id: true},
    })
    enrolled = !!enrollment
  }

  let lessonsCount = 0
  let totalReadMinutes = 0

  let modules = (course.modules || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    position: m.position,
    lessons: (m.lessons || []).map((l: any) => {
      lessonsCount += 1
      totalReadMinutes += l?.readMinutes || 0
      let canRead = enrolled || !!l.isFree
      return {
        id: l.id,
        title: l.title,
        readMinutes: l.readMinutes,
        position: l.position,
        isFree: l.isFree,
        locked: !canRead,
        content: canRead ? l.content : "",
        checkpoints: canRead ? l.checkpoints || [] : [],
      }
    }),
  }))

  let ratingAgg = await prisma.review.aggregate({
    where: {courseId: course.id},
    _avg: {rating: true},
    _count: {rating: true},
  })

  return {
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    cover: course.cover,
    learn: course.learn || [],
    publishedAt: course.publishedAt,
    instructor: course.instructor,
    modules,
    reviews: course.reviews || [],
    rating: Math.round((ratingAgg?._avg?.rating || 0) * 10) / 10,
    reviewsCount: ratingAgg?._count?.rating || 0,
    studentsCount: course?._count?.enrollments || 0,
    lessonsCount,
    totalReadMinutes,
    isEnrolled: enrolled,
  }
}

export async function getCategories() {
  let rows: any = []
  rows = await prisma.course.groupBy({
    by: ["category"],
    where: {status: "PUBLISHED"},
    orderBy: {category: "asc"},
    _count: {_all: true},
  })
  return rows
    .filter((r: any) => r?.category)
    .map((r: any) => ({label: r.category, count: r?._count?._all || 0}))
}
