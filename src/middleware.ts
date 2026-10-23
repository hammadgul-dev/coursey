import {NextResponse} from "next/server"
import type {NextRequest} from "next/server"
import {getToken} from "next-auth/jwt"

let dashboards: Record<string, string> = {
  STUDENT: "/student-dashboard",
  INSTRUCTOR: "/instructor-dashboard",
  ADMIN: "/admin-dashboard",
}

let rules = [
  {prefix: "/student-dashboard", role: "STUDENT"},
  {prefix: "/instructor-dashboard", role: "INSTRUCTOR"},
  {prefix: "/admin-dashboard", role: "ADMIN"},
]

export async function middleware(req: NextRequest) {
  let token = await getToken({req, secret: process.env.NEXTAUTH_SECRET})
  let path = req.nextUrl.pathname || ""
  let role = (token?.role as string) || ""
  let isAuthPage = path === "/login" || path === "/signup"

  if (isAuthPage) {
    if (token && dashboards[role]) {
      return NextResponse.redirect(new URL(dashboards[role], req.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  let rule = rules.find((r) => path.startsWith(r.prefix))

  if (rule && rule.role !== role) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/student-dashboard/:path*",
    "/instructor-dashboard/:path*",
    "/admin-dashboard/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
  ],
}
