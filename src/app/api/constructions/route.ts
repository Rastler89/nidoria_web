import { apiFetch } from "@/lib/api-client";
import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
    const cookieStore = cookies()
    const token = (await cookieStore).get('auth_token')?.value

    try {
        const res = await apiFetch("constructions", {
            headers: {
                "Authorization": `Bearer ${token ?? ""}`,
            },
        })

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch constructions" }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = cookies()
    const token = (await cookieStore).get('auth_token')?.value

    try {
        const { constructionId } = await req.json()

        const res = await apiFetch("constructions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ constructionId }),
        })

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to update construction" }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
