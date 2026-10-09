"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "tu correo"

  return (
    <div className="min-h-screen flex items-center justify-center p-4 morphing-bg">
      <div className="w-full max-w-md glass-card rounded-3xl p-10 shadow-2xl border border-border/20 text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-3">Revisa tu correo</h1>
        <p className="text-muted-foreground mb-8">
          Te hemos enviado un enlace de verificación a{" "}
          <span className="font-semibold text-foreground">{email}</span>.
          <br />
          Abre el correo y haz clic en{" "}
          <span className="font-semibold text-foreground">"Despertar a la Reina"</span> para activar tu cuenta.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Ir al inicio de sesión</Link>
        </Button>
      </div>
    </div>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense>
      <CheckEmailContent />
    </Suspense>
  )
}
