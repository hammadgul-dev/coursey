import {prisma} from "@/lib/prisma"

export async function getAdminStats() {
  let [
    students,
    instructors,
    banned,
    draft,
    pending,
    published,
    rejected,
    removed,
  ] = await Promise.all([
    prisma.user.count({where: {role: "STUDENT"}}),
    prisma.user.count({where: {role: "INSTRUCTOR"}}),
    prisma.user.count({where: {banned: true}}),
    prisma.course.count({where: {status: "DRAFT"}}),
    prisma.course.count({where: {status: "PENDING"}}),
    prisma.course.count({where: {status: "PUBLISHED"}}),
    prisma.course.count({where: {status: "REJECTED"}}),
    prisma.course.count({where: {status: "REMOVED"}}),
  ])

  return {
    users: {students, instructors, banned},
    courses: {draft, pending, published, rejected, removed},
  }
}
