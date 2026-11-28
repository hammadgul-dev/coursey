import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import {prisma} from "@/lib/prisma"
import {isLimited, hitRate, resetRate} from "@/lib/ratelimit"

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
      async authorize(credentials: any, req: any) {
        let email = (credentials?.email || "").toLowerCase().trim()
        let password = credentials?.password || ""
        if (!email || !password) return null

        let ip =
          String(req?.headers?.["x-forwarded-for"] || "")
            .split(",")[0]
            .trim() || "unknown"
        let emailKey = "rl:login:email:" + email
        let ipKey = "rl:login:ip:" + ip

        let blocked = ""
        try {
          let byEmail = await isLimited(emailKey, 5)
          if (!byEmail.allowed) blocked = byEmail.message
          if (!blocked) {
            let byIp = await isLimited(ipKey, 20)
            if (!byIp.allowed) blocked = byIp.message
          }
        } catch (e) {
          blocked = ""
        }
        if (blocked) throw new Error(blocked)

        let fail = async () => {
          try {
            await hitRate(emailKey, 900)
            await hitRate(ipKey, 900)
          } catch (e) {}
          return null
        }

        let user: any = await prisma.user.findUnique({where: {email}})
        if (!user) return await fail()
        if (user.banned) throw new Error("Your Account Has Been Suspended")

        let valid = await bcrypt.compare(password, user.passwordHash || "")
        if (!valid) return await fail()
        if (!user.emailVerified)
          throw new Error("Please Verify Your Email First")

        try {
          await resetRate(emailKey)
        } catch (e) {}

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tokenVersion: user.tokenVersion || 0,
        } as any
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}: any) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.tokenVersion = user.tokenVersion || 0
      }
      return token
    },
    async session({session, token}: any) {
      if (session?.user) {
        session.user.id = token?.id || ""
        session.user.role = token?.role || "STUDENT"
        session.user.tokenVersion = token?.tokenVersion || 0
      }
      return session
    },
  },
}
