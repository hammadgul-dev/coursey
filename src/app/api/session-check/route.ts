import {NextResponse} from "next/server"
import {getSessionUser} from "@/lib/session"

export async function GET() {
  try {
    let user = await getSessionUser()
    return NextResponse.json(
      {valid: !!user},
      {headers: {"Cache-Control": "no-store"}},
    )
  } catch (e) {
    return NextResponse.json({valid: true})
  }
}
