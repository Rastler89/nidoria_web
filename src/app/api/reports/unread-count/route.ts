import { apiFetch } from "@/lib/apiFetch";
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

/** Contador de reportes sin leer (badge del buzón). */
export async function GET() {
    const token = (await cookies()).get('auth_token')?.value

    const res = await apiFetch("reports/unread-count", {
        headers: {
            "Authorization": `Bearer ${token ?? ""}`,
        },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
