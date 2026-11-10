import {prisma} from "@/lib/prisma"
import {fail, ok} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"
import {
  checkpointSuggestInputSchema,
  checkpointSuggestOutputSchema,
} from "@/validations/ai"
import {isEditable, ownedLesson} from "@/lib/ownership"
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

    let lesson = await ownedLesson(parsedId.data, user.id)
    if (!lesson) return fail("Lesson Not Found", 404)
    if (!isEditable(lesson.module.course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Edited", 403)
    }

    let body: any = await req.json().catch(() => ({}))
    let parsed = checkpointSuggestInputSchema.safeParse(body || {})
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let existing = await prisma.checkpoint.findMany({
      where: {lessonId: lesson.id},
      select: {question: true},
      orderBy: {position: "asc"},
    })
    let room = 10 - existing.length
    if (room <= 0) return fail("Checkpoint Limit Reached", 403)
    let count = Math.min(parsed.data.count, room)

    let data = await prisma.lesson.findUnique({
      where: {id: lesson.id},
      select: {
        title: true,
        content: true,
        module: {
          select: {
            title: true,
            course: {select: {title: true, level: true}},
          },
        },
      },
    })
    if (!data) return fail("Lesson Not Found", 404)

    let content = (data.content || "").trim()
    if (content.length < 100) return fail("Add Lesson Content First", 400)

    let limit = await checkAiLimit("checkpoints", user.id)
    if (!limit.allowed) return fail(limit.message, 429)

    let text = [
      "Course: " + (data.module?.course?.title || ""),
      "Level: " + (data.module?.course?.level || ""),
      "Module: " + (data.module?.title || ""),
      "Lesson: " + (data.title || ""),
      "Count: " + count,
      "Existing Questions:\n" +
        (existing.map((c: any) => "- " + c.question).join("\n") || "None"),
      "Lesson Content:\n" + content.slice(0, 12000),
    ].join("\n")

    let result = await aiJson(
      "checkpoints",
      PROMPTS.checkpoints,
      wrapData(text),
      checkpointSuggestOutputSchema,
    )

    let list = (result?.checkpoints || []).slice(0, count)
    return ok({checkpoints: list})
  } catch (e) {
    return aiErrorResponse(e)
  }
}
