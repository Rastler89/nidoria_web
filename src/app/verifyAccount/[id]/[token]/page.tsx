import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/ui/navigation"

export const dynamic = "force-dynamic"

interface VerifyAccountPageProps {
  params: Promise<{ id: string; token: string }>
}

async function verifyAccount(id: string, token: string) {
  const dbHost = process.env.DB_HOST

  if (!dbHost) {
    console.error("DB_HOST is not defined in environment variables")
    return { ok: false, message: "Error de configuración del servidor." }
  }

  try {
    const res = await fetch(
      `${dbHost}/verifyAccount/${encodeURIComponent(id)}/${encodeURIComponent(token)}`,
      { cache: "no-store" },
    )
    const body = await res.text()

    if (res.ok) {
      return { ok: true, message: "Tu correo ha sido verificado. ¡La reina está despierta!" }
    }

    try {
      const data = JSON.parse(body)
      return {
        ok: false,
        message: data.message || data.error || "El enlace no es válido o ha expirado.",
      }
    } catch {
      return { ok: false, message: body || "El enlace no es válido o ha expirado." }
    }
  } catch (error) {
    console.error("Verify account error:", error)
    return { ok: false, message: "No se pudo conectar con el servidor. Inténtalo de nuevo." }
  }
}

export default async function VerifyAccountPage({ params }: VerifyAccountPageProps) {
  const { id, token } = await params
  const result = await verifyAccount(id, token)

  return (
    <div className="min-h-screen bg-background ant-texture">
      <Navigation />
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-lg nest-chamber p-8 md:p-12 shadow-2xl text-center">
          <div className="flex justify-center mb-8">
            <div
              className={`p-6 rounded-full amber-glow ${result.ok ? "bg-accent/20" : "bg-destructive/20"}`}
            >
              {result.ok ? (
                <svg className="w-16 h-16 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-16 h-16 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              )}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground text-glow">
            {result.ok ? "¡Cuenta verificada!" : "No pudimos verificar tu cuenta"}
          </h1>
          <p className="text-lg text-muted-foreground mb-10 text-pretty">{result.message}</p>

          <div className="space-y-4">
            <Button className="w-full py-6 text-xl rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href={result.ok ? "/login" : "/register"}>
                {result.ok ? "Entrar al Hormiguero" : "Volver al registro"}
              </Link>
            </Button>
            <Button variant="outline" className="w-full py-6 text-xl rounded-2xl glass-card hover:bg-accent/10" asChild>
              <Link href="/">Volver al Gran Hormiguero</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
