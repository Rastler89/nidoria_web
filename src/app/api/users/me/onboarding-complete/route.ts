import { NextRequest, NextResponse } from "next/server"
import { serverApiUrl } from "@/lib/api-server-host"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  const res = await fetch(serverApiUrl("users/me/onboarding-complete"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({}),
  })

  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}
