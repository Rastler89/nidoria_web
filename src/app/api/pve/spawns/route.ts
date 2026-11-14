import { apiFetch } from "@/lib/apiFetch";
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

/** Apariciones de monstruos activas + ejército disponible del jugador. */
export async function GET() {
    const token = (await cookies()).get('auth_token')?.value

    const res = await apiFetch("pve/spawns", {
        headers: {
            "Authorization": `Bearer ${token ?? ""}`,
        },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
