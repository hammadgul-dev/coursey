import {prisma} from "@/lib/prisma"
import {fail, ok} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"
import {draftOutputSchema} from "@/validations/ai"
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

    let data = await prisma.lesson.findUnique({
      where: {id: lesson.id},
      select: {
        title: true,
        module: {
          select: {
            title: true,
            course: {
              select: {
                title: true,
                level: true,
                category: true,
                modules: {
                  orderBy: {position: "asc"},
                  select: {
                    title: true,
                    lessons: {
                      orderBy: {position: "asc"},
                      select: {title: true},
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    if (!data) return fail("Lesson Not Found", 404)

    let lessonTitle = (data.title || "").trim()
    if (lessonTitle.length < 3 || lessonTitle === "New Lesson") {
      return fail("Add Lesson Title First", 400)
    }

    let limit = await checkAiLimit("draft", user.id)
    if (!limit.allowed) return fail(limit.message, 429)

    let course: any = data.module?.course
    let outline = (course?.modules || [])
      .map(
        (m: any) =>
          "- " +
          m.title +
          ": " +
          (m.lessons || []).map((l: any) => l.title).join(", "),
      )
      .join("\n")

    let text = [
      "Course: " + (course?.title || ""),
      "Category: " + (course?.category || ""),
      "Level: " + (course?.level || ""),
      "Module: " + (data.module?.title || ""),
      "Lesson: " + lessonTitle,
      "Course Outline:\n" + (outline || "None"),
    ].join("\n")

    let result: any = await aiJson(
      "draft",
      PROMPTS.draft,
      wrapData(text),
      draftOutputSchema,
    )

    if (result?.mismatch) {
      return fail("Lesson Title Does Not Match This Course", 400)
    }

    let content = (result?.content || "").trim()
    if (content.length < 100) return fail("AI Response Invalid", 502)

    return ok({content})
  } catch (e) {
    return aiErrorResponse(e)
  }
}
