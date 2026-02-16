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
        <div className="w-full max-w-lg text-center">
          <div className="nest-chamber p-12 shadow-2xl amber-glow">
            {!submitted ? (
              <>
                <div className="flex justify-center mb-8">
                  <div className="p-4 bg-muted/30 rounded-full amber-glow">
                    <img src="/nidoria2.png" alt="Nidoria" className="w-40" />
                  </div>
                </div>
                <h1 className="text-5xl font-bold mb-6 text-foreground">Pre-regístrate</h1>
                <p className="text-muted-foreground text-xl mb-10 text-pretty">
                  Sé el primero en fundar tu colonia cuando el gran hormiguero de Nidoria abra sus puertas.
                </p>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="text-left">
                    <FormField
                      label="Tu Correo Electrónico"
                      type="email"
                      placeholder="hormiga-reina@colonia.com"
                      value={email}
                      onChange={(v) => setEmail(v)}
                      required
                      className="bg-muted/20 border-primary/30 text-lg py-6"
                    />
                  </div>
                  <Button type="submit" className="w-full py-8 text-xl rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 amber-glow font-bold">
                    Avisarme al Lanzamiento
                  </Button>
                </form>
              </>
            ) : (
              <div className="py-12">
                <div className="flex justify-center mb-8">
                  <div className="p-6 rounded-full bg-accent/20 amber-glow">
                    <svg className="w-20 h-20 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-6 text-foreground">¡Te hemos anotado!</h2>
                <p className="text-muted-foreground text-xl mb-10 text-pretty">
                  Te avisaremos en <strong>{email}</strong> tan pronto como el hormiguero esté listo para ser conquistado por tu estirpe.
                </p>
                <Button variant="outline" className="w-full py-6 text-xl rounded-2xl glass-card" asChild>
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
