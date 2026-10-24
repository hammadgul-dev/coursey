import {prisma} from "@/lib/prisma"
import {ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"

export async function GET() {
  try {
    let {error} = await requireRole(["ADMIN"])
    if (error) return error

    let [
      students,
      instructors,
      banned,
      draft,
      pending,
      published,
      rejected,
      removed,
      enrollments,
    ] = await Promise.all([
      prisma.user.count({where: {role: "STUDENT"}}),
      prisma.user.count({where: {role: "INSTRUCTOR"}}),
      prisma.user.count({where: {banned: true}}),
      prisma.course.count({where: {status: "DRAFT"}}),
      prisma.course.count({where: {status: "PENDING"}}),
      prisma.course.count({where: {status: "PUBLISHED"}}),
      prisma.course.count({where: {status: "REJECTED"}}),
      prisma.course.count({where: {status: "REMOVED"}}),
      prisma.enrollment.count(),
    ])

    return ok({
      users: {students, instructors, banned},
      courses: {draft, pending, published, rejected, removed},
      enrollments,
    })
  } catch (e) {
    return serverError()
  }
}
