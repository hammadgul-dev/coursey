import {fail, ok, serverError} from "@/lib/api"
import {getSessionUser} from "@/lib/session"
import {getCourseDetail} from "@/lib/courses"
import {idSchema} from "@/validations/course"

export async function GET(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    let {id} = await params
    let parsedId = idSchema.safeParse(id)
    if (!parsedId.success) return fail("Invalid Id", 400)

    let sessionUser: any = await getSessionUser()
    let userId = typeof sessionUser === "string" ? sessionUser : sessionUser?.id

    let course = await getCourseDetail(parsedId.data, userId || null)
    if (!course) return fail("Course Not Found", 404)

    return ok(course)
  } catch (e) {
    return serverError()
  }
}
