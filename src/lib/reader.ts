import {prisma} from "@/lib/prisma"

export async function getReaderData(
  courseId: string,
  lessonId: string,
  userId?: string | null,
) {
  let course: any = await prisma.course.findFirst({
    where: {id: courseId, status: "PUBLISHED"},
    select: {
      id: true,
      title: true,
      instructorId: true,
      modules: {
        orderBy: {position: "asc"},
        select: {
          id: true,
          title: true,
          lessons: {
            orderBy: {position: "asc"},
            select: {id: true, title: true, readMinutes: true, isFree: true},
          },
        },
      },
    },
  })

  if (!course) return null

  let role = ""
  let enrolled = false
  if (userId) {
    let u = await prisma.user.findUnique({
      where: {id: userId},
      select: {role: true, banned: true},
    })
    if (u?.banned) return null
    role = u?.role || ""
    let enrollment = await prisma.enrollment.findUnique({
      where: {userId_courseId: {userId, courseId: course.id}},
      select: {id: true},
    })
    enrolled = !!enrollment
  }

  let privileged = role === "ADMIN" || course.instructorId === userId
  let hasAccess = enrolled || privileged

  let flat: any[] = []
  let modules = (course.modules || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    lessons: (m.lessons || []).map((l: any) => {
      let item = {
        id: l.id,
        title: l.title,
        readMinutes: l.readMinutes,
        moduleTitle: m.title,
        locked: !(hasAccess || l.isFree),
      }
      flat.push(item)
      return item
    }),
  }))

  let index = flat.findIndex((l: any) => l.id === lessonId)
  if (index < 0) return null

  let current = flat[index]
  if (current.locked) return {denied: true}

  let lesson: any = await prisma.lesson.findUnique({
    where: {id: lessonId},
    select: {
      content: true,
      checkpoints: {
        orderBy: {position: "asc"},
        select: {id: true, question: true, answer: true},
      },
    },
  })

  let doneIds: string[] = []
  if (userId && role === "STUDENT" && enrolled) {
    let done = await prisma.lessonProgress.findMany({
      where: {userId, lessonId: {in: flat.map((l: any) => l.id)}},
      select: {lessonId: true},
    })
    doneIds = done.map((d: any) => d.lessonId)
  }

  return {
    denied: false,
    courseId: course.id,
    courseTitle: course.title,
    modules,
    flat,
    index,
    current,
    content: lesson?.content || "",
    checkpoints: lesson?.checkpoints || [],
    doneIds,
    canTrack: role === "STUDENT" && enrolled,
  }
}
