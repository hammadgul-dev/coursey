import {prisma} from "@/lib/prisma"

export function isEditable(status: string) {
  return status === "DRAFT" || status === "REJECTED"
}

export async function ownedCourse(id: string, userId: string) {
  return prisma.course.findFirst({
    where: {id, instructorId: userId},
    select: {id: true, status: true},
  })
}

export async function ownedModule(id: string, userId: string) {
  return prisma.module.findFirst({
    where: {id, course: {instructorId: userId}},
    select: {id: true, course: {select: {id: true, status: true}}},
  })
}

export async function ownedLesson(id: string, userId: string) {
  return prisma.lesson.findFirst({
    where: {id, module: {course: {instructorId: userId}}},
    select: {
      id: true,
      module: {select: {course: {select: {id: true, status: true}}}},
    },
  })
}

export async function ownedCheckpoint(id: string, userId: string) {
  return prisma.checkpoint.findFirst({
    where: {id, lesson: {module: {course: {instructorId: userId}}}},
    select: {
      id: true,
      lesson: {
        select: {
          module: {select: {course: {select: {id: true, status: true}}}},
        },
      },
    },
  })
}
