import {z} from "zod"
import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"

let roles = ["STUDENT", "INSTRUCTOR"] as any

let querySchema = z.object({
  role: z.enum(roles, {message: "Invalid Role"}).optional(),
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

    let {role, search, page, limit} = parsed.data

    let where: any = {role: {not: "ADMIN"}}
    if (role) where.role = role
    if (search) {
      where.OR = [
        {name: {contains: search, mode: "insensitive"}},
        {email: {contains: search, mode: "insensitive"}},
      ]
    }

    let [total, rows] = await Promise.all([
      prisma.user.count({where}),
      prisma.user.findMany({
        where,
        orderBy: {createdAt: "desc"},
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          headline: true,
          banned: true,
          createdAt: true,
          _count: {select: {courses: true, enrollments: true}},
        },
      }),
    ])

    let users = rows.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      headline: u.headline,
      banned: u.banned,
      createdAt: u.createdAt,
      coursesCount: u?._count?.courses || 0,
      enrollmentsCount: u?._count?.enrollments || 0,
    }))

    return ok({
      users,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    })
  } catch (e) {
    return serverError()
  }
}
