import {prisma} from "@/lib/prisma"
import {fail, ok} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"
import {coverOutputSchema} from "@/validations/ai"
import {checkAiLimit} from "@/lib/ratelimit"
import {aiJson, aiErrorResponse} from "@/lib/ai"
import {PROMPTS, wrapData} from "@/lib/aiPrompts"

let editable = ["DRAFT", "REJECTED"]

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
      where: {id: parsedId.data, instructorId: user?.id || ""},
      select: {title: true, category: true, level: true, status: true},
    })
    if (!course) return fail("Course Not Found", 404)
    if (!editable.includes(course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let title = (course.title || "").trim()
    if (title.length < 3) return fail("Add Course Title First", 400)

    let limit = await checkAiLimit("cover", user?.id || "")
    if (!limit.allowed) return fail(limit.message, 429)

    let text = `Title: ${title}\nCategory: ${course.category || ""}\nLevel: ${course.level || ""}`
    let out: any = await aiJson(
      "cover",
      PROMPTS.cover,
      wrapData(text),
      coverOutputSchema,
    )

    let short = String(out?.short || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 30)
      .trim()
    if (!short) short = title.slice(0, 30).trim()

    let palette = Math.round(Number(out?.palette))
    if (!Number.isFinite(palette)) palette = 0
    palette = Math.min(5, Math.max(0, palette))

    return ok({short, palette})
  } catch (e) {
    return aiErrorResponse(e)
  }
}
