import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {courseSchema, courseUpdateSchema} from "@/validations/course"

let createSchema = courseUpdateSchema.extend({title: courseSchema.shape.title})

export async function GET() {
  try {
    let {error, user} = await requireRole(["INSTRUCTOR"])
    if (error) return error

    let rows = await prisma.course.findMany({
      where: {instructorId: user.id},
      orderBy: {updatedAt: "desc"},
      select: {
        id: true,
        title: true,
        category: true,
        level: true,
        cover: true,
        status: true,
        rejectionReason: true,
        submittedAt: true,
        publishedAt: true,
        updatedAt: true,
        modules: {select: {lessons: {select: {id: true}}}},
        _count: {select: {enrollments: true}},
      },
    })

    let courses = rows.map((c: any) => {
      let lessonsCount = 0
      for (let m of c?.modules || []) lessonsCount += m?.lessons?.length || 0
      return {
        id: c.id,
        title: c.title,
        category: c.category,
        level: c.level,
        cover: c.cover,
        status: c.status,
        rejectionReason: c.rejectionReason,
        submittedAt: c.submittedAt,
        publishedAt: c.publishedAt,
        updatedAt: c.updatedAt,
        lessonsCount,
        studentsCount: c?._count?.enrollments || 0,
      }
    })

    return ok({courses})
  } catch (e) {
    return serverError()
  }
}

export async function POST(req: Request) {
  try {
    let {error, user} = await requireRole(["INSTRUCTOR"])
    if (error) return error

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let count = await prisma.course.count({where: {instructorId: user.id}})
    if (count >= 50) return fail("Course Limit Reached", 403)

    let d: any = parsed.data

    let course = await prisma.course.create({
      data: {
        title: d.title,
        description: d.description || "",
        category: d.category || "",
        level: d.level || "BEGINNER",
        cover: d.cover || null,
        learn: d.learn || [],
        instructorId: user.id,
      },
      select: {id: true, title: true, status: true},
    })

    return ok(course, 201)
  } catch (e) {
    return serverError()
  }
}
