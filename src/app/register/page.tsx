"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/ui/navigation"
import { FormField } from "@/components/ui/form-field"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-background ant-texture">
      <Navigation />
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-md text-center">
          <div className="glass-card rounded-3xl p-10 shadow-2xl border border-border/20 backdrop-blur-md">
            {!submitted ? (
              <>
                <div className="flex justify-center mb-6">
                  <img src="/nidoria2.png" alt="Nidoria" className="w-48" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Pre-regístrate</h1>
                <p className="text-muted-foreground text-lg mb-8">
                  Sé el primero en fundar tu colonia cuando Nidoria abra sus puertas.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormField
                    label="Email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(v) => setEmail(v)}
                    required
                  />
                  <Button type="submit" className="w-full py-6 text-lg rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90">
                    Avisarme al Lanzamiento
                  </Button>
                </form>
              </>
            ) : (
              <div className="py-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-primary/20">
                    <svg className="w-16 h-16 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">¡Te hemos anotado!</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Te avisaremos en <strong>{email}</strong> tan pronto como el hormiguero esté listo para ser conquistado.
                </p>
                <Button variant="ghost" className="w-full py-6 text-lg rounded-2xl" asChild>
                  <Link href="/">Volver al Inicio</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
