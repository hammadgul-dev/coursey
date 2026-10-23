import {getServerSession} from "next-auth"
import {authOptions} from "@/lib/auth"
import {prisma} from "@/lib/prisma"
import {fail} from "@/lib/api"

export async function getSessionUser() {
  let session: any = await getServerSession(authOptions)
  let id = session?.user?.id || ""
  if (!id) return null
  return {id: id as string}
}

export async function requireRole(roles: string[]) {
  let sessionUser = await getSessionUser()

  if (!sessionUser) {
    return {error: fail("Please Log In To Continue", 401), user: null as any}
  }

  let user = await prisma.user.findUnique({
    where: {id: sessionUser.id},
    select: {id: true, role: true, banned: true},
  })

  if (!user) {
    return {error: fail("Please Log In To Continue", 401), user: null as any}
  }

  if (user.banned) {
    return {
      error: fail("Your Account Has Been Suspended", 403),
      user: null as any,
    }
  }

  if (!(roles || []).includes(user.role)) {
    return {error: fail("You Do Not Have Permission", 403), user: null as any}
  }

  return {error: null as any, user}
}
