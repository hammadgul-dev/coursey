import {prisma} from "@/lib/prisma"

export async function getProfile(userId: string) {
  let u = await prisma.user.findUnique({
    where: {id: userId},
    select: {
      name: true,
      email: true,
      role: true,
      headline: true,
      bio: true,
      avatar: true,
      banned: true,
      createdAt: true,
    },
  })
  if (!u || u.banned) return null

  let avatar = u.avatar || ""
  if (!avatar && u.role === "ADMIN") avatar = "/images/profile.jpg"

  return {
    name: u.name || "",
    email: u.email || "",
    role: u.role,
    headline: u.headline || "",
    bio: u.bio || "",
    avatar,
    createdAt: u.createdAt,
  }
}
