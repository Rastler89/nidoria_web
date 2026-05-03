import { apiFetch } from "@/lib/apiFetch";
import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
    const cookieStore = cookies()
    const token = (await cookieStore).get('auth_token')?.value

    try {
        console.log('hola');
        const res = await apiFetch("investigations", {
            headers: {
                "Authorization": `Bearer ${token ?? ""}`,
            },
        })

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch investigations" }, { status: res.status })
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
        const { investigationId } = await req.json()

        const res = await apiFetch("investigations", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ investigationId }),
        })

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to start investigation" }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
