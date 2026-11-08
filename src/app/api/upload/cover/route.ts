import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {readImage} from "@/lib/image"
import {coverFolder, deleteImage, uploadImage} from "@/lib/cloudinary"
import {idSchema} from "@/validations/course"

let editable = ["DRAFT", "REJECTED"] as any

let getCourse = async (req: Request, userId: string) => {
  let url = new URL(req.url)
  let parsedId = idSchema.safeParse(url.searchParams.get("courseId") || "")
  if (!parsedId.success) return {error: fail("Invalid Id", 400), course: null}

  let course = await prisma.course.findFirst({
    where: {id: parsedId.data, instructorId: userId},
    select: {id: true, status: true},
  })
  if (!course) return {error: fail("Course Not Found", 404), course: null}

  if (!editable.includes(course.status)) {
    return {
      error: fail("Only Draft Or Rejected Courses Can Be Edited", 403),
      course: null,
    }
  }
  return {error: null, course}
}

export async function POST(req: Request) {
  try {
    let {error, user} = await requireRole(["INSTRUCTOR"])
    if (error) return error

    let found = await getCourse(req, user?.id || "")
    if (found.error || !found.course) return found.error

    let {error: imgError, buffer} = await readImage(req, 3 * 1024 * 1024)
    if (imgError || !buffer) return fail(imgError || "Invalid Request", 400)

    let result: any = await uploadImage(buffer, coverFolder, found.course.id, {
      width: 1280,
      crop: "limit",
      quality: "auto",
      fetch_format: "auto",
    })
    let url: string = result?.secure_url || ""
    if (!url) return fail("Upload Failed", 500)

    let updated = await prisma.course.updateMany({
      where: {
        id: found.course.id,
        instructorId: user?.id || "",
        status: {in: editable},
      },
      data: {cover: url},
    })
    if (updated.count === 0) return fail("Course Could Not Be Updated", 409)

    return ok({cover: url})
  } catch (e) {
    return serverError()
  }
}

export async function DELETE(req: Request) {
  try {
    let {error, user} = await requireRole(["INSTRUCTOR"])
    if (error) return error

    let found = await getCourse(req, user?.id || "")
    if (found.error || !found.course) return found.error

    await deleteImage(`${coverFolder}/${found.course.id}`)

    let updated = await prisma.course.updateMany({
      where: {
        id: found.course.id,
        instructorId: user?.id || "",
        status: {in: editable},
      },
      data: {cover: null},
    })
    if (updated.count === 0) return fail("Course Could Not Be Updated", 409)

    return ok({cover: ""})
  } catch (e) {
    return serverError()
  }
}
