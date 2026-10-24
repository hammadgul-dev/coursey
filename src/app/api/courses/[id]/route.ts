import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {getSessionUser} from "@/lib/session"
import {idSchema} from "@/validations/course"

export async function GET(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    let {id} = await params
    let parsedId = idSchema.safeParse(id)
    if (!parsedId.success) return fail("Invalid Id", 400)

    let course: any = await prisma.course.findFirst({
      where: {id: parsedId.data, status: "PUBLISHED"},
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

    if (!course) return fail("Course Not Found", 404)

    let sessionUser = await getSessionUser()
    let enrolled = false
    if (sessionUser?.id) {
      let enrollment = await prisma.enrollment.findUnique({
        where: {userId_courseId: {userId: sessionUser.id, courseId: course.id}},
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

    return ok({
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
    })
  } catch (e) {
    return serverError()
  }
}
