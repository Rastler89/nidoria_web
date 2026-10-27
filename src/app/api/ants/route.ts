import { apiFetch } from "@/lib/apiFetch";
import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
    const cookieStore = cookies()
    const token = (await cookieStore).get('auth_token')?.value

    try {
        const res = await apiFetch("units", {
            headers: {
                "Authorization": `Bearer ${token ?? ""}`,
            },
        })

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch units" }, { status: res.status })
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
        const { antId, quantity } = await req.json()

        const res = await apiFetch("units", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ antId, quantity }),
        })

        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            return NextResponse.json(
                { error: data.message || "No se pudo iniciar el reclutamiento" },
                { status: res.status },
            )
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}