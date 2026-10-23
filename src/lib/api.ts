import {NextResponse} from "next/server"

export function fail(message: string, status: number = 400) {
  return NextResponse.json({error: message || "Something Went Wrong"}, {status})
}

export function ok(data: any, status: number = 200) {
  return NextResponse.json(data ?? {}, {status})
}

export function serverError() {
  return fail("Something Went Wrong, Try Again", 500)
}
