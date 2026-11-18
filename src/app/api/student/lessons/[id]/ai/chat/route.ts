import {prisma} from "@/lib/prisma"
import {fail} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"
import {chatInputSchema} from "@/validations/ai"
import {checkAiLimit} from "@/lib/ratelimit"
import {aiStream, aiErrorResponse} from "@/lib/ai"
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

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)
    let parsed = chatInputSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let lesson: any = await prisma.lesson.findUnique({
      where: {id: parsedId.data},
      select: {
        title: true,
        content: true,
        isFree: true,
        module: {
          select: {
            title: true,
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
    if (content.length < 50) return fail("This Lesson Has No Content", 400)

    let limit = await checkAiLimit("chat", user.id)
    if (!limit.allowed) return fail(limit.message, 429)

    let system =
      PROMPTS.chat +
      "\n\n" +
      wrapData(
        `Course: ${lesson.module.course.title || ""}\nLesson: ${lesson.title || ""}\nContent:\n${content.slice(0, 8000)}`,
      )

    let messages: any[] = []
    for (let h of parsed.data.history || []) {
      messages.push({role: h.role, content: h.content})
    }
    messages.push({role: "user", content: parsed.data.question})

    let stream = await aiStream("chat", system, messages)

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    })
  } catch (e) {
    return aiErrorResponse(e)
  }
}
