import {prisma} from "@/lib/prisma"
import {fail, ok} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"
import {reviewOutputSchema} from "@/validations/ai"
import {checkAiLimit} from "@/lib/ratelimit"
import {aiJson, aiErrorResponse} from "@/lib/ai"
import {PROMPTS, wrapData} from "@/lib/aiPrompts"

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
            lessons: {
              orderBy: {position: "asc"},
              select: {title: true, content: true},
            },
          },
        },
      },
    })
    if (!course) return fail("Course Not Found", 404)

    if (!editable.includes(course.status)) {
      return fail("Only Draft Or Rejected Courses Can Be Reviewed", 403)
    }

    let modules: any[] = course.modules || []
    let lessonCount = 0
    let totalChars = 0
    for (let m of modules) {
      for (let l of m?.lessons || []) {
        lessonCount++
        totalChars += (l?.content || "").trim().length
      }
    }

    if (modules.length < 1 || lessonCount < 1) {
      return fail("Add At Least One Module And Lesson First", 400)
    }
    if (totalChars < 200) return fail("Add Lesson Content First", 400)

    let limit = await checkAiLimit("review", user.id)
    if (!limit.allowed) return fail(limit.message, 429)

    let per = Math.max(
      150,
      Math.min(700, Math.floor(10000 / Math.max(1, lessonCount))),
    )

    let lines: string[] = []
    lines.push(`Title: ${course.title || ""}`)
    lines.push(`Category: ${course.category || ""}`)
    lines.push(`Level: ${course.level || ""}`)
    lines.push(`Description: ${(course.description || "").slice(0, 1500)}`)
    lines.push("Learning Points:")
    for (let p of course.learn || []) lines.push(`- ${p}`)
    lines.push("Curriculum:")

    let shown = 0
    let hidden = 0
    for (let m of modules) {
      lines.push(`Module: ${m?.title || ""}`)
      for (let l of m?.lessons || []) {
        if (shown >= 60) {
          hidden++
          continue
        }
        shown++
        let text = (l?.content || "").trim()
        let words = text ? text.split(/\s+/).length : 0
        lines.push(`- Lesson: ${l?.title || ""} (${words} words)`)
        if (text) {
          lines.push(`  Start: ${text.replace(/\s+/g, " ").slice(0, per)}`)
        }
      }
    }
    if (hidden > 0) lines.push(`${hidden} more lessons not shown`)

    let data: any = await aiJson(
      "review",
      PROMPTS.review,
      wrapData(lines.join("\n")),
      reviewOutputSchema,
    )

    return ok({
      review: {
        score: Math.round(data?.score || 0),
        summary: data?.summary || "",
        strengths: (data?.strengths || []).slice(0, 5),
        issues: (data?.issues || []).slice(0, 6),
        suggestions: (data?.suggestions || []).slice(0, 6),
      },
    })
  } catch (e) {
    return aiErrorResponse(e)
  }
}
