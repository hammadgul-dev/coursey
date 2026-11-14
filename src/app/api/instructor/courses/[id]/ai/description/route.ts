import {prisma} from "@/lib/prisma"
import {fail, ok} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"
import {descriptionOutputSchema} from "@/validations/ai"
import {isEditable} from "@/lib/ownership"
import {checkAiLimit} from "@/lib/ratelimit"
import {aiJson, aiErrorResponse} from "@/lib/ai"
import {PROMPTS, wrapData} from "@/lib/aiPrompts"

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

    let course = await prisma.course.findFirst({
      where: {id: parsedId.data, instructorId: user.id},
      select: {title: true, category: true, level: true, status: true},
    })
    if (!course) return fail("Course Not Found", 404)
    if (!isEditable(course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let title = (course.title || "").trim()
    if (title.length < 5) return fail("Add Course Title First", 400)

    let limit = await checkAiLimit("description", user.id)
    if (!limit.allowed) return fail(limit.message, 429)

    let text = [
      "Course Title: " + title.slice(0, 120),
      "Category: " + (course.category || "Not Set"),
      "Level: " + (course.level || ""),
    ].join("\n")

    let result: any = await aiJson(
      "description",
      PROMPTS.description,
      wrapData(text),
      descriptionOutputSchema,
    )

    if (result?.mismatch) return fail("Course Title Is Not Clear Enough", 400)

    let description = (result?.description || "").trim()
    if (description.length < 20) return fail("AI Response Invalid", 502)

    return ok({description})
  } catch (e) {
    return aiErrorResponse(e)
  }
}
