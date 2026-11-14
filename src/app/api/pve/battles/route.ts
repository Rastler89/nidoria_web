import { apiFetch } from "@/lib/apiFetch";
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

/** Batallas PvE del jugador, pendientes y resueltas. */
export async function GET() {
    const token = (await cookies()).get('auth_token')?.value

    const res = await apiFetch("pve/battles", {
        headers: {
            "Authorization": `Bearer ${token ?? ""}`,
        },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
