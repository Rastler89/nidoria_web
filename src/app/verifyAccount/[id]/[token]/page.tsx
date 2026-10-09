"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

const DB_HOST = process.env.NEXT_PUBLIC_DB_HOST || "http://127.0.0.1:4000"

export default function VerifyAccountPage() {
  const params = useParams<{ id: string; token: string }>()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState("")

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${DB_HOST}/verifyAccount/${params.id}/${params.token}`)
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          setError(data?.message || "El enlace de verificación no es válido o ha expirado.")
          setStatus("error")
          return
        }
        setStatus("success")
      } catch {
        setError("No se pudo conectar con el servidor.")
        setStatus("error")
      }
    }
    verify()
  }, [params.id, params.token])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 morphing-bg">
      <div className="w-full max-w-md glass-card rounded-3xl p-10 shadow-2xl border border-border/20 text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-6 w-14 h-14 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <h1 className="text-2xl font-bold mb-3">Verificando tu cuenta...</h1>
            <p className="text-muted-foreground">Despertando a la Reina, un momento por favor.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3">¡Email verificado!</h1>
            <p className="text-muted-foreground mb-8">
              Tu cuenta ha sido verificada correctamente. Ya puedes entrar a tu colonia.
            </p>
            <Button asChild className="w-full interactive-button">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center">
              <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3">Error de verificación</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Ir al inicio de sesión</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
