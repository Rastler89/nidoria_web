import { apiFetch } from "@/lib/apiFetch";
import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'

/** Bandeja de reportes paginada. */
export async function GET(req: NextRequest) {
    const token = (await cookies()).get('auth_token')?.value
    const search = req.nextUrl.searchParams.toString()

    const res = await apiFetch(`reports${search ? `?${search}` : ""}`, {
        headers: {
            "Authorization": `Bearer ${token ?? ""}`,
        },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
