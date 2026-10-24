import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {idSchema, rejectSchema} from "@/validations/course"

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

    let body: any = await req.json().catch(() => null)
    if (!body) return fail("Invalid Request", 400)

    let parsed = rejectSchema.safeParse(body)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let result = await prisma.course.updateMany({
      where: {id: parsedId.data, status: "PENDING"},
      data: {status: "REJECTED", rejectionReason: parsed.data.reason},
    })

    if (result.count === 0) {
      return fail("Only Pending Courses Can Be Rejected", 409)
    }

    return ok({id: parsedId.data, status: "REJECTED"})
  } catch (e) {
    return serverError()
  }
}
