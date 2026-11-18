import {createHash} from "crypto"
import {prisma} from "@/lib/prisma"
import {fail, ok} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"
import {quizOutputSchema} from "@/validations/ai"
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
        id: true,
        title: true,
        content: true,
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

    let enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: lesson.module.course.id,
        },
      },
      select: {id: true},
    })
    if (!enrollment) return fail("You Are Not Enrolled In This Course", 403)

    let progress = await prisma.lessonProgress.findUnique({
      where: {userId_lessonId: {userId: user.id, lessonId: lesson.id}},
      select: {id: true},
    })
    if (!progress) return fail("Complete This Lesson First", 403)

    let content = (lesson.content || "").trim()
    if (content.length < 200)
      return fail("This Lesson Has Too Little Content", 400)

    let contentHash = createHash("sha256")
      .update(`${lesson.title || ""}\n${content}`)
      .digest("hex")

    let saved: any = await prisma.lessonQuiz.findUnique({
      where: {lessonId: lesson.id},
      select: {data: true, contentHash: true},
    })
    if (saved && saved.contentHash === contentHash) {
      let parsed = quizOutputSchema.safeParse(saved.data)
      if (parsed.success) {
        return ok({questions: parsed.data.questions, cached: true})
      }
    }

    let limit = await checkAiLimit("quiz", user.id)
    if (!limit.allowed) return fail(limit.message, 429)

    let data: any = await aiJson(
      "quiz",
      PROMPTS.quiz,
      wrapData(
        `Course: ${lesson.module.course.title || ""}\nLesson: ${lesson.title || ""}\nContent:\n${content.slice(0, 8000)}`,
      ),
      quizOutputSchema,
    )

    await prisma.lessonQuiz.upsert({
      where: {lessonId: lesson.id},
      create: {lessonId: lesson.id, data: data as any, contentHash},
      update: {data: data as any, contentHash},
    })

    return ok({questions: data?.questions || [], cached: false})
  } catch (e) {
    return aiErrorResponse(e)
  }
}
