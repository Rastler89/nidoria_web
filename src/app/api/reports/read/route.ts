import { apiFetch } from "@/lib/apiFetch";
import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'

/** Marca un reporte como leído. */
export async function POST(req: NextRequest) {
    const token = (await cookies()).get('auth_token')?.value
    const { id } = await req.json()
    const reportId = Number(id)

    if (!Number.isInteger(reportId) || reportId <= 0) {
        return NextResponse.json({ error: "Reporte inválido" }, { status: 400 })
    }

    const res = await apiFetch(`reports/${reportId}/read`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token ?? ""}`,
            'Content-Type': 'application/json',
        },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
