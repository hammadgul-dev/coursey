import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {courseIdBodySchema} from "@/validations/course"

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

    let course = await prisma.course.findFirst({
      where: {id: parsed.data.courseId, status: "PUBLISHED"},
      select: {id: true},
    })
    if (!course) return fail("Course Not Found", 404)

    let existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {userId: user?.id || "", courseId: course.id},
      },
      select: {id: true},
    })
    if (existing) return fail("Already Enrolled", 409)

    try {
      await prisma.enrollment.create({
        data: {userId: user?.id || "", courseId: course.id},
      })
    } catch (e: any) {
      if (e?.code === "P2002") return fail("Already Enrolled", 409)
      throw e
    }

    return ok({courseId: course.id, enrolled: true}, 201)
  } catch (e) {
    return serverError()
  }
}
