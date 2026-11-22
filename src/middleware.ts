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

async function sessionValid(req: NextRequest) {
  try {
    let res = await fetch(new URL("/api/session-check", req.url), {
      headers: {cookie: req.headers.get("cookie") || ""},
      cache: "no-store",
    })
    let data: any = await res.json().catch(() => null)
    return !!data?.valid
  } catch {
    return true
  }
}

export async function middleware(req: NextRequest) {
  let token = await getToken({req, secret: process.env.NEXTAUTH_SECRET})
  let path = req.nextUrl.pathname || ""
  let role = (token?.role as string) || ""
  let isAuthPage =
    path === "/login" ||
    path === "/signup" ||
    path === "/forgot-password" ||
    path === "/reset-password"

  if (isAuthPage) {
    if (token && dashboards[role]) {
      let valid = await sessionValid(req)
      if (valid) {
        return NextResponse.redirect(new URL(dashboards[role], req.url))
      }
      let res = NextResponse.next()
      res.cookies.delete("next-auth.session-token")
      res.cookies.delete("__Secure-next-auth.session-token")
      return res
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
    "/forgot-password",
    "/reset-password",
  ],
}
