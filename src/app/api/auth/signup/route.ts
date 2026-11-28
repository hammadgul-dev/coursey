import {NextResponse} from "next/server"
import bcrypt from "bcryptjs"
import {prisma} from "@/lib/prisma"
import {signupSchema} from "@/validations/auth"
import {hasMailServer} from "@/lib/email"
import {sendVerification} from "@/lib/verify"
import {checkRate} from "@/lib/ratelimit"

export async function POST(req: Request) {
  try {
    let ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      "unknown"
    let limit = await checkRate("rl:signup:ip:" + ip, 5, 3600)
    if (!limit.allowed) {
      return NextResponse.json({error: limit.message}, {status: 429})
    }

    let body: any = await req.json().catch(() => ({}))
    let parsed: any = signupSchema.safeParse(body)

    if (!parsed?.success) {
      return NextResponse.json(
        {error: parsed?.error?.issues?.[0]?.message || "Invalid Input"},
        {status: 400},
      )
    }

    let {name, email, password, role} = parsed.data as any

    let validDomain = await hasMailServer(email)
    if (!validDomain) {
      return NextResponse.json(
        {error: "Enter A Valid Email Address"},
        {status: 400},
      )
    }

    let exists = await prisma.user.findUnique({where: {email}})
    if (exists) {
      return NextResponse.json(
        {error: "Email Already Registered"},
        {status: 409},
      )
    }

    let passwordHash = await bcrypt.hash(password, 12)

    let user = await prisma.user.create({
      data: {name, email, passwordHash, role},
      select: {id: true, role: true},
    })

    await sendVerification(user.id, email).catch(() => false)

    return NextResponse.json({user, verifyRequired: true}, {status: 201})
  } catch (err: any) {
    return NextResponse.json(
      {error: "Something Went Wrong, Try Again"},
      {status: 500},
    )
  }
}
