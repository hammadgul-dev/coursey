import {fail, ok, serverError} from "@/lib/api"
import {getCourses} from "@/lib/courses"
import {courseQuerySchema} from "@/validations/course"

export async function GET(req: Request) {
  try {
    let url = new URL(req.url)
    let raw: any = {}
    url.searchParams.forEach((value, key) => {
      if (value.trim() !== "") raw[key] = value
    })

    let parsed = courseQuerySchema.safeParse(raw)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let data = await getCourses(parsed.data)
    return ok(data)
  } catch (e) {
    return serverError()
  }
}
