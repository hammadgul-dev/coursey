import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"

let editable = ["DRAFT", "REJECTED"] as any

export async function POST(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    let {error, user} = await requireRole(["INSTRUCTOR"])
    if (error) return error

    let {id} = await params
    let parsedId = idSchema.safeParse(id)
    if (!parsedId.success) return fail("Invalid Id", 400)

    let course: any = await prisma.course.findFirst({
      where: {id: parsedId.data, instructorId: user.id},
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        level: true,
        learn: true,
        status: true,
        modules: {
          orderBy: {position: "asc"},
          select: {
            title: true,
            lessons: {select: {title: true, content: true}},
          },
        },
      },
    })
    if (!course) return fail("Course Not Found", 404)

    if (!editable.includes(course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Submitted", 403)
    }

    if ((course.title || "").trim().length < 3) {
      return fail("Course Title Is Required", 400)
    }
    if ((course.description || "").trim().length < 20) {
      return fail("Description Must Be At Least 20 Characters", 400)
    }
    if (!(course.category || "").trim())
      return fail("Category Is Required", 400)
    if ((course.learn || []).length < 1) {
      return fail("Add At Least One Learning Point", 400)
    }
    if ((course.modules || []).length < 1) {
      return fail("Add At Least One Module", 400)
    }

    for (let m of course.modules || []) {
      if ((m?.lessons || []).length < 1) {
        return fail(`Module ${m.title} Needs At Least One Lesson`, 400)
      }
      for (let l of m?.lessons || []) {
        if (!(l?.content || "").trim()) {
          return fail(`Lesson ${l.title} Needs Content`, 400)
        }
      }
    }

    let result = await prisma.course.updateMany({
      where: {id: course.id, instructorId: user.id, status: {in: editable}},
      data: {status: "PENDING", submittedAt: new Date(), rejectionReason: null},
    })
    if (result.count === 0) return fail("Course Could Not Be Submitted", 409)

    return ok({id: course.id, status: "PENDING"})
  } catch (e) {
    return serverError()
  }
}
