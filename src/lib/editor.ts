import {prisma} from "@/lib/prisma"
import {idSchema} from "@/validations/course"

export async function getEditorData(userId: string, id: string) {
  let user = await prisma.user.findUnique({
    where: {id: userId},
    select: {role: true, banned: true},
  })
  if (!user || user.banned || user.role !== "INSTRUCTOR") {
    return {state: "denied", course: null}
  }
  if (!id) return {state: "new", course: null}

  let parsedId = idSchema.safeParse(id)
  if (!parsedId.success) return {state: "missing", course: null}

  let course = await prisma.course.findFirst({
    where: {id: parsedId.data, instructorId: userId},
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      level: true,
      cover: true,
      learn: true,
      status: true,
      rejectionReason: true,
      modules: {
        orderBy: {position: "asc"},
        select: {
          id: true,
          title: true,
          lessons: {
            orderBy: {position: "asc"},
            select: {
              id: true,
              title: true,
              content: true,
              readMinutes: true,
              checkpoints: {
                orderBy: {position: "asc"},
                select: {id: true, question: true, answer: true},
              },
            },
          },
        },
      },
    },
  })
  if (!course) return {state: "missing", course: null}

  return {state: "ok", course}
}
