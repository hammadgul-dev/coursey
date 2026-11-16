import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"
import {outlineApplySchema} from "@/validations/ai"
import {isEditable, ownedCourse} from "@/lib/ownership"

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

    let course = await ownedCourse(parsedId.data, user.id)
    if (!course) return fail("Course Not Found", 404)
    if (!isEditable(course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = outlineApplySchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let modules: any[] = parsed.data.modules

    let applied = await prisma.$transaction(
      async (tx: any) => {
        let allowed = await tx.course.count({
          where: {
            id: course.id,
            instructorId: user.id,
            status: {in: ["DRAFT", "REJECTED"]},
          },
        })
        if (allowed === 0) return false

        let existing = await tx.module.count({where: {courseId: course.id}})
        if (existing > 0) return false

        for (let i = 0; i < modules.length; i++) {
          let m = modules[i]
          await tx.module.create({
            data: {
              title: m.title,
              position: i,
              courseId: course.id,
              lessons: {
                create: (m.lessons || []).map((l: any, j: number) => ({
                  title: l.title,
                  content: l.description,
                  readMinutes: 1,
                  position: j,
                })),
              },
            },
          })
        }
        return true
      },
      {maxWait: 10000, timeout: 30000},
    )

    if (!applied) return fail("Course Already Has Modules", 409)

    return ok({id: course.id}, 201)
  } catch (e) {
    return serverError()
  }
}
