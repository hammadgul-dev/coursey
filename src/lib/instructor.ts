import {prisma} from "@/lib/prisma"

function fmt(d: any) {
  if (!d) return ""
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

function codeOf(title: string) {
  let letters = (title || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w: string) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 3)
  return letters || "CS"
}

export async function getInstructorDashboard(userId: string) {
  let u = await prisma.user.findUnique({
    where: {id: userId},
    select: {name: true, role: true, banned: true},
  })
  if (!u || u.banned || u.role !== "INSTRUCTOR") return null

  let rows = await prisma.course.findMany({
    where: {instructorId: userId},
    orderBy: {id: "desc"},
    take: 50,
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      rejectionReason: true,
      submittedAt: true,
      publishedAt: true,
      _count: {select: {enrollments: true}},
      modules: {
        select: {
          lessons: {select: {_count: {select: {checkpoints: true}}}},
        },
      },
    },
  })

  let courses = (rows || []).map((c: any) => {
    let lessons = 0
    let checkpoints = 0
    for (let m of c.modules || []) {
      for (let l of m?.lessons || []) {
        lessons += 1
        checkpoints += l?._count?.checkpoints || 0
      }
    }

    let status = String(c.status || "DRAFT").toLowerCase()
    let updated = "Not Submitted"
    if (status === "published")
      updated = `Published ${fmt(c.publishedAt)}`.trim()
    if (status === "pending") updated = `Submitted ${fmt(c.submittedAt)}`.trim()
    if (status === "rejected")
      updated = `Submitted ${fmt(c.submittedAt)}`.trim()
    if (status === "removed") updated = "Removed By Admin"

    let students = "—"
    if (status === "published") students = String(c?._count?.enrollments || 0)

    let meta = `${lessons} Text Lessons`
    if (checkpoints > 0) meta = `${meta} • ${checkpoints} Checkpoints`

    return {
      id: c.id,
      code: codeOf(c.title),
      title: c.title || "Untitled Course",
      category: c.category || "Uncategorized",
      meta,
      status,
      students,
      updated,
      feedback: c.rejectionReason || "",
    }
  })

  let count = (s: string) => courses.filter((c: any) => c.status === s).length

  let [enrolled, rating] = await Promise.all([
    prisma.enrollment.findMany({
      where: {course: {instructorId: userId, status: "PUBLISHED"}},
      distinct: ["userId"],
      select: {userId: true},
    }),
    prisma.review.aggregate({
      where: {course: {instructorId: userId, status: "PUBLISHED"}},
      _avg: {rating: true},
      _count: {_all: true},
    }),
  ])

  let avg = rating?._avg?.rating || 0

  return {
    name: u.name || "Instructor",
    stats: {
      total: courses.length,
      published: count("published"),
      pending: count("pending"),
      totalStudents: enrolled?.length || 0,
      avgRating: Math.round(avg * 10) / 10,
      reviewsCount: rating?._count?._all || 0,
    },
    courses,
  }
}
