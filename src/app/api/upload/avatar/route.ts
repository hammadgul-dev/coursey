import {prisma} from "@/lib/prisma"
import {fail, ok, serverError} from "@/lib/api"
import {requireRole} from "@/lib/session"
import {readImage} from "@/lib/image"
import {deleteImage, uploadImage} from "@/lib/cloudinary"

let folder = "coursey/coursey-image"

export async function POST(req: Request) {
  try {
    let {error, user} = await requireRole(["STUDENT", "INSTRUCTOR", "ADMIN"])
    if (error) return error

    let userId = user?.id || ""
    if (!userId) return fail("Unauthorized", 401)

    let {error: imgError, buffer} = await readImage(req, 2 * 1024 * 1024)
    if (imgError || !buffer) return fail(imgError || "Invalid Request", 400)

    let result: any = await uploadImage(buffer, folder, userId, {
      width: 256,
      height: 256,
      crop: "fill",
      gravity: "face",
      quality: "auto",
    })
    let url: string = result?.secure_url || ""
    if (!url) return fail("Upload Failed", 500)

    await prisma.user.update({where: {id: userId}, data: {avatar: url}})

    return ok({avatar: url})
  } catch (e) {
    return serverError()
  }
}

export async function DELETE() {
  try {
    let {error, user} = await requireRole(["STUDENT", "INSTRUCTOR", "ADMIN"])
    if (error) return error

    let userId = user?.id || ""
    if (!userId) return fail("Unauthorized", 401)

    await deleteImage(`${folder}/${userId}`)
    await prisma.user.update({where: {id: userId}, data: {avatar: null}})

    return ok({avatar: ""})
  } catch (e) {
    return serverError()
  }
}
