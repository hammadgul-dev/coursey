import {prisma} from "@/lib/prisma"
import {fail, ok} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"
import {summaryOutputSchema} from "@/validations/ai"
import {checkAiLimit} from "@/lib/ratelimit"
import {aiJson, aiErrorResponse} from "@/lib/ai"
import {PROMPTS, wrapData} from "@/lib/aiPrompts"

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

    let lesson: any = await prisma.lesson.findUnique({
      where: {id: parsedId.data},
      select: {
        title: true,
        content: true,
        isFree: true,
        module: {
          select: {
            course: {select: {id: true, title: true, status: true}},
          },
        },
      },
    })
    if (!lesson || lesson?.module?.course?.status !== "PUBLISHED") {
      return fail("Lesson Not Found", 404)
    }

    if (!lesson.isFree) {
      let enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: lesson.module.course.id,
          },
        },
        select: {id: true},
      })
      if (!enrollment) return fail("Enroll In This Course First", 403)
    }

    let content = (lesson.content || "").trim()
    if (content.length < 200)
      return fail("This Lesson Has Too Little Content", 400)

    let limit = await checkAiLimit("summary", user.id)
    if (!limit.allowed) return fail(limit.message, 429)

    let data: any = await aiJson(
      "summary",
      PROMPTS.summary,
      wrapData(
        `Course: ${lesson.module.course.title || ""}\nLesson: ${lesson.title || ""}\nContent:\n${content.slice(0, 8000)}`,
      ),
      summaryOutputSchema,
    )

    return ok({points: (data?.points || []).slice(0, 8)})
  } catch (e) {
    return aiErrorResponse(e)
  }
}
