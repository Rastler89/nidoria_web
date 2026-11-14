import { apiFetch } from "@/lib/apiFetch";
import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'

/** Detalle de un reporte por id (query, para no depender de rutas dinámicas). */
export async function GET(req: NextRequest) {
    const token = (await cookies()).get('auth_token')?.value
    const id = Number(req.nextUrl.searchParams.get('id'))

    if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json({ error: "Reporte inválido" }, { status: 400 })
    }

    const res = await apiFetch(`reports/${id}`, {
        headers: {
            "Authorization": `Bearer ${token ?? ""}`,
        },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
