import {prisma} from "@/lib/prisma"
import {fail, ok} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"
import {outlineInputSchema, outlineOutputSchema} from "@/validations/ai"
import {isEditable, ownedCourse} from "@/lib/ownership"
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

    let course = await ownedCourse(parsedId.data, user.id)
    if (!course) return fail("Course Not Found", 404)
    if (!isEditable(course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = outlineInputSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let moduleCount = await prisma.module.count({where: {courseId: course.id}})
    if (moduleCount > 0) return fail("Course Already Has Modules", 400)

    let limit = await checkAiLimit("outline", user.id)
    if (!limit.allowed) return fail(limit.message, 429)

    let d: any = parsed.data
    let text = [
      "Topic: " + d.topic,
      "Level: " + d.level,
      "Audience: " + (d.audience || "Not Set"),
    ].join("\n")

    let result: any = await aiJson(
      "outline",
      PROMPTS.outline,
      wrapData(text),
      outlineOutputSchema,
    )

    if (result?.mismatch) return fail("Topic Is Not Clear Enough", 400)

    let modules = result?.modules || []
    if (modules.length === 0) return fail("AI Response Invalid", 502)

    return ok({modules})
  } catch (e) {
    return aiErrorResponse(e)
  }
}
