import {NextResponse} from "next/server"
import bcrypt from "bcryptjs"
import {prisma} from "@/lib/prisma"
import {signupSchema} from "@/validations/auth"

export async function POST(req: Request) {
  try {
    let body: any = await req.json().catch(() => ({}))
    let parsed: any = signupSchema.safeParse(body)

    if (!parsed?.success) {
      return NextResponse.json(
        {error: parsed?.error?.issues?.[0]?.message || "Invalid Input"},
        {status: 400},
      )
    }

    let {name, email, password, role} = parsed.data as any

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

    return NextResponse.json({user}, {status: 201})
  } catch (err: any) {
    return NextResponse.json(
      {error: "Something Went Wrong, Try Again"},
      {status: 500},
    )
  }
}
