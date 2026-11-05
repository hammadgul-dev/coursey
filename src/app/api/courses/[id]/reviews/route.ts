import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema, reviewSchema} from "@/validations/course"
import {reviewsQuerySchema} from "@/validations/review"
import {getReviewsPage} from "@/lib/reviews"

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

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = reviewSchema.safeParse(body)
    if (!parsed.success)
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)

    let userId = user?.id || ""

    let course = await prisma.course.findFirst({
      where: {id: parsedId.data, status: "PUBLISHED"},
      select: {id: true},
    })
    if (!course) return fail("Course Not Found", 404)

    let enrollment = await prisma.enrollment.findUnique({
      where: {userId_courseId: {userId, courseId: course.id}},
      select: {id: true},
    })
    if (!enrollment) return fail("Enroll In This Course To Leave A Review", 403)

    let comment = parsed.data.comment?.trim() || null

    let review = await prisma.review.upsert({
      where: {userId_courseId: {userId, courseId: course.id}},
      update: {rating: parsed.data.rating, comment},
      create: {
        userId,
        courseId: course.id,
        rating: parsed.data.rating,
        comment,
      },
      select: {id: true, rating: true, comment: true, createdAt: true},
    })

    return ok(review)
  } catch (e) {
    return serverError()
  }
}

export async function GET(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    let {id} = await params
    let parsedId = idSchema.safeParse(id)
    if (!parsedId.success) return fail("Invalid Id", 400)

    let url = new URL(req.url)
    let raw: any = {}
    let p = url.searchParams.get("page")
    if (p) raw.page = p
    let parsed = reviewsQuerySchema.safeParse(raw)
    if (!parsed.success)
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)

    let course = await prisma.course.findFirst({
      where: {id: parsedId.data, status: "PUBLISHED"},
      select: {id: true},
    })
    if (!course) return fail("Course Not Found", 404)

    let data = await getReviewsPage(course.id, parsed.data.page)
    return ok(data)
  } catch (e) {
    return serverError()
  }
}
