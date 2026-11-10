import { NextResponse } from "next/server"
import { serverApiUrl } from "@/lib/api-server-host"

// El banner es público: no requiere sesión, por eso no usamos `apiFetch`
// (que exige refresh_token). Cualquier fallo devuelve lista vacía para que
// el aviso nunca rompa el resto de la web.
export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const res = await fetch(serverApiUrl("banner"), { cache: "no-store" })
        if (!res.ok) {
            return NextResponse.json({ banners: [] })
        }
        const data = await res.json()
        return NextResponse.json({ banners: Array.isArray(data) ? data : [] })
    } catch {
        return NextResponse.json({ banners: [] })
    }
}
