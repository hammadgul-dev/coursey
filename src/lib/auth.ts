import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import {prisma} from "@/lib/prisma"

export let authOptions: any = {
  session: {strategy: "jwt", maxAge: 60 * 60 * 24 * 7},
  pages: {signIn: "/login"},
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials: any) {
        let email = (credentials?.email || "").toLowerCase().trim()
        let password = credentials?.password || ""
        if (!email || !password) return null

        let user: any = await prisma.user.findUnique({where: {email}})
        if (!user) return null
        if (user.banned) throw new Error("Your Account Has Been Suspended")

        let valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        } as any
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}: any) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({session, token}: any) {
      if (session?.user) {
        session.user.id = token?.id || ""
        session.user.role = token?.role || "STUDENT"
      }
      return session
    },
  },
}
