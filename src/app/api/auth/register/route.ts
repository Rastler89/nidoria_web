import { type NextRequest, NextResponse } from "next/server"

/**
 * Origen público del frontend (el que ve el jugador). La API lo usa para
 * armar el enlace de verificación del correo cuando no hay APP_URL.
 */
function resolveAppOrigin(request: NextRequest): string | undefined {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim()

  if (forwardedHost) {
    return `${forwardedProto ?? "https"}://${forwardedHost}`
  }

  return request.nextUrl.origin
}

export async function POST(request: NextRequest) {
  try {
    let payload: { email?: string; username?: string; password?: string }
    try {
      payload = await request.json()
    } catch {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
    }

    const { email, username, password } = payload

    const dbHost = process.env.DB_HOST

    if (!dbHost) {
      console.error("DB_HOST is not defined in environment variables")
      return NextResponse.json({ error: "Configuration error" }, { status: 500 })
    }

    const appOrigin = resolveAppOrigin(request)

    const res = await fetch(`${dbHost}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(appOrigin ? { "x-app-origin": appOrigin } : {}),
      },
      body: JSON.stringify({ email, username, password }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data.message || "No se pudo completar el registro.",
          details: data.details,
        },
        { status: res.status },
      )
    }

    return NextResponse.json({ user: data }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
