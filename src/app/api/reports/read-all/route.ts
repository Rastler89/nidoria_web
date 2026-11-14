import { apiFetch } from "@/lib/apiFetch";
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

/** Marca todos los reportes como leídos. */
export async function POST() {
    const token = (await cookies()).get('auth_token')?.value

    const res = await apiFetch("reports/read-all", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token ?? ""}`,
            'Content-Type': 'application/json',
        },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
