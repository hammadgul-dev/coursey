import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema} from "@/validations/course"

export async function POST(
  req: Request,
  {params}: {params: Promise<{id: string}>},
) {
  try {
    let {error} = await requireRole(["ADMIN"])
    if (error) return error

    let {id} = await params
    let parsedId = idSchema.safeParse(id)
    if (!parsedId.success) return fail("Invalid Id", 400)

    let result = await prisma.course.updateMany({
      where: {id: parsedId.data, status: "PENDING"},
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        rejectionReason: null,
      },
    })

    if (result.count === 0) {
      return fail("Only Pending Courses Can Be Published", 409)
    }

    return ok({id: parsedId.data, status: "PUBLISHED"})
  } catch (e) {
    return serverError()
  }
}
