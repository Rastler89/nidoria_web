import { apiFetch } from "@/lib/apiFetch";
import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'

/**
 * Envía unidades contra una aparición. El backend valida el ejército, calcula
 * el viaje y encola el combate; aquí solo se reenvía la petición.
 */
export async function POST(req: NextRequest) {
    const token = (await cookies()).get('auth_token')?.value
    const { spawnId, units } = await req.json()

    const res = await apiFetch(`pve/spawns/${Number(spawnId)}/attack`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token ?? ""}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ units }),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
