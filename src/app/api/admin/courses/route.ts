import {z} from "zod"
import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"

let statuses = ["DRAFT", "PENDING", "PUBLISHED", "REJECTED", "REMOVED"] as any

let querySchema = z.object({
  status: z.enum(statuses, {message: "Invalid Status"}).optional(),
  search: z.string().trim().max(100, "Search Is Too Long").optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

export async function GET(req: Request) {
  try {
    let {error} = await requireRole(["ADMIN"])
    if (error) return error

    let url = new URL(req.url)
    let raw: any = {}
    url.searchParams.forEach((value, key) => {
      if (value.trim() !== "") raw[key] = value
    })

    let parsed = querySchema.safeParse(raw)
    if (!parsed.success) {
      return fail(parsed.error.issues?.[0]?.message || "Invalid Request", 400)
    }

    let {status, search, page, limit} = parsed.data

    let where: any = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        {title: {contains: search, mode: "insensitive"}},
        {instructor: {name: {contains: search, mode: "insensitive"}}},
      ]
    }

    let orderBy: any =
      status === "PENDING" ? {submittedAt: "asc"} : {updatedAt: "desc"}

    let [total, rows] = await Promise.all([
      prisma.course.count({where}),
      prisma.course.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          category: true,
          level: true,
          status: true,
          rejectionReason: true,
          submittedAt: true,
          publishedAt: true,
          updatedAt: true,
          instructor: {select: {id: true, name: true}},
          modules: {select: {lessons: {select: {id: true}}}},
          adminReviews: {
            orderBy: {createdAt: "desc"},
            take: 1,
            select: {aiScore: true, aiNote: true},
          },
          _count: {select: {enrollments: true}},
        },
      }),
    ])

    let courses = rows.map((c: any) => {
      let lessonsCount = 0
      for (let m of c?.modules || []) lessonsCount += m?.lessons?.length || 0
      return {
        id: c.id,
        title: c.title,
        category: c.category,
        level: c.level,
        status: c.status,
        rejectionReason: c.rejectionReason,
        submittedAt: c.submittedAt,
        publishedAt: c.publishedAt,
        updatedAt: c.updatedAt,
        instructor: c.instructor,
        lessonsCount,
        studentsCount: c?._count?.enrollments || 0,
        aiScore: c?.adminReviews?.[0]?.aiScore ?? null,
        aiNote: c?.adminReviews?.[0]?.aiNote ?? null,
      }
    })

    return ok({
      courses,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    })
  } catch (e) {
    return serverError()
  }
}
