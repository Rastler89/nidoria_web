"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/ui/navigation"
import { FormField } from "@/components/ui/form-field"
import { useAuth } from "@/lib/auth"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && username && password) {
      setIsSubmitting(true)
      setError(null)
      try {
        const success = await register(email, username, password)

        if (success) {
          setSubmitted(true)
          // Optional: redirect after a delay
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
        } else {
          setError("Ocurrió un error al procesar tu registro. Por favor verifica tus datos.")
        }
      } catch (err) {
        setError("Error de conexión con el servidor.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background ant-texture">
      <Navigation />
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Benefits Column */}
            <div className="hidden lg:block space-y-8 pr-8">
              <span className="founder-badge text-lg">Comienza tu Legado</span>
              <h2 className="text-4xl font-bold text-foreground">Forja tu Colonia</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl glass-card border-accent/20">
                  <div className="mt-1">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Gestiona tu Hormiguero</h4>
                    <p className="text-sm text-muted-foreground">Construye cámaras, túneles y defensas para proteger a tu reina.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl glass-card border-accent/20">
                  <div className="mt-1">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Lidera tus Tropas</h4>
                    <p className="text-sm text-muted-foreground">Recluta diferentes tipos de hormigas y conquista nuevos territorios.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl glass-card border-accent/20">
                  <div className="mt-1">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Investiga y Evoluciona</h4>
                    <p className="text-sm text-muted-foreground">Desbloquea tecnologías y mutaciones para mejorar tu colonia.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="nest-chamber p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <img src="/nidoria2.png" alt="" className="w-32 rotate-12" />
              </div>

              {!submitted ? (
                <>
                  <div className="lg:hidden flex justify-center mb-6">
                    <img src="/nidoria2.png" alt="Nidoria" className="w-40" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center">Registro</h1>
                  <p className="text-lg text-muted-foreground mb-8 text-center text-pretty">
                    Crea tu cuenta en <span className="text-accent">Nidoria</span> y comienza tu aventura.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-left space-y-4">
                      <FormField
                        label="Nombre de Usuario"
                        type="text"
                        placeholder="ReinaSuprema"
                        value={username}
                        onChange={(v) => setUsername(v)}
                        required
                        className="bg-muted/20 border-primary/30 text-lg py-6"
                      />
                      <FormField
                        label="Correo Electrónico"
                        type="email"
                        placeholder="hormiga@colonia.com"
                        value={email}
                        onChange={(v) => setEmail(v)}
                        required
                        className="bg-muted/20 border-primary/30 text-lg py-6"
                      />
                      <FormField
                        label="Contraseña"
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(v) => setPassword(v)}
                        required
                        className="bg-muted/20 border-primary/30 text-lg py-6"
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center font-medium">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-8 text-xl rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 amber-glow font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      {isSubmitting ? "Creando Colonia..." : "Registrarse"}
                    </Button>
                  </form>
                  <p className="mt-6 text-xs text-center text-muted-foreground/60">
                    ¿Ya tienes una cuenta? <Link href="/login" className="text-primary hover:underline">Inicia sesión aquí</Link>
                  </p>
                </>
              ) : (
                <div className="py-8 text-center animate-in fade-in zoom-in duration-500">
                  <div className="flex justify-center mb-8">
                    <div className="p-6 rounded-full bg-accent/20 amber-glow">
                      <svg className="w-16 h-16 md:w-20 md:h-20 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground text-glow">¡Bienvenido!</h2>
                  <p className="text-lg text-muted-foreground mb-10 text-pretty">
                    Tu colonia ha sido fundada exitosamente, <strong>{username}</strong>.
                    Estás siendo redirigido al panel de control...
                  </p>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full py-6 text-xl rounded-2xl glass-card hover:bg-accent/10" asChild>
                      <Link href="/dashboard">Ir al Dashboard</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
