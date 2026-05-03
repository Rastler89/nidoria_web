import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { apiFetch } from "@/lib/apiFetch"

export async function GET(req: NextRequest) {
    const cookieStore = cookies()
    const token = (await cookieStore).get('auth_token')?.value

    try {
        const res = await apiFetch("ranking", {
            headers: {
                "Authorization": `Bearer ${token ?? ""}`,
            },
        })

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch ranking" }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Ranking API Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
