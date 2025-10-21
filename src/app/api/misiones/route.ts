import { apiFetch } from "@/lib/apiFetch";
import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
    const cookieStore = cookies()
    const token = (await cookieStore).get('auth_token')?.value

    const res = await apiFetch("mision", {
        headers: {
            "Authorization": `Bearer ${token ?? ""}`,
        },
    })

    const data = await res.json()
    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    const cookieStore = cookies()
    const token = (await cookieStore).get('auth_token')?.value

    const { resource, amount } = await req.json()

    const res = await apiFetch("mission", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token ?? ""}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({resource: resource, amount: amount}),
    })

    const data = await res.json()
    return NextResponse.json(data)
}