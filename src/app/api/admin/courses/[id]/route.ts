import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"

export async function GET(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    let {error} = await requireRole(["ADMIN"])
    if (error) return error

    let {id} = await params
    let parsedId = idSchema.safeParse(id)
    if (!parsedId.success) return fail("Invalid Id", 400)

    let course = await prisma.course.findUnique({
      where: {id: parsedId.data},
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        level: true,
        cover: true,
        learn: true,
        status: true,
        rejectionReason: true,
        submittedAt: true,
        publishedAt: true,
        instructor: {select: {id: true, name: true, headline: true, bio: true}},
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
                content: true,
                readMinutes: true,
                position: true,
                isFree: true,
                checkpoints: {
                  orderBy: {position: "asc"},
                  select: {id: true, question: true, answer: true},
                },
              },
            },
          },
        },
        adminReviews: {
          orderBy: {createdAt: "desc"},
          take: 1,
          select: {aiScore: true, aiNote: true, createdAt: true},
        },
      },
    })

    if (!course) return fail("Course Not Found", 404)
    return ok(course)
  } catch (e) {
    return serverError()
  }
}
