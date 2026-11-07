import {prisma} from "@/lib/prisma"
import {getSessionUser} from "@/lib/session"

export async function getNavUser() {
  let sessionUser: any = await getSessionUser()
  let userId: string | null = sessionUser?.id || null
  if (!userId) return null

  let u = await prisma.user.findUnique({
    where: {id: userId},
    select: {name: true, avatar: true, banned: true, role: true},
  })
  if (!u || u.banned) return null

  let avatar = u.avatar || ""
  if (!avatar && u.role === "ADMIN") avatar = "/images/profile.jpg"

  return {name: u.name || "User", avatar}
}
