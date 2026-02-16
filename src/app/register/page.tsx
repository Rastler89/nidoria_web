"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/ui/navigation"
import { FormField } from "@/components/ui/form-field"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitting(true)
      // Simulación de guardado en base de datos
      console.log(`Pre-registro recibido: ${email}`);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setIsSubmitting(false)
      setSubmitted(true)
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
              <span className="founder-badge text-lg">Beneficios Exclusivos</span>
              <h2 className="text-4xl font-bold text-foreground">Únete como Fundador</h2>
              <div className="space-y-6">
                {[
                  { title: "Acceso Anticipado", desc: "Explora Nidoria antes que nadie." },
                  { title: "Emblema de Fundador", desc: "Presume tu estatus en tu perfil." },
                  { title: "Bonus de Recursos", desc: "Comienza con una ventaja estratégica." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl glass-card border-accent/20">
                    <div className="mt-1">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
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
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center">Pre-regístrate</h1>
                  <p className="text-lg text-muted-foreground mb-8 text-center text-pretty">
                    Asegura tu lugar en la historia de <span className="text-accent">Nidoria</span> y reclama tus recompensas de fundador.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-8 text-xl rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 amber-glow font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      {isSubmitting ? "Preparando tu Colonia..." : "¡Quiero ser Fundador!"}
                    </Button>
                  </form>
                  <p className="mt-6 text-xs text-center text-muted-foreground/60">
                    Al unirte, aceptas ser contactado exclusivamente para noticias sobre el lanzamiento de Nidoria.
                  </p>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="flex justify-center mb-8">
                    <div className="p-6 rounded-full bg-accent/20 amber-glow">
                      <svg className="w-16 h-16 md:w-20 md:h-20 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground text-glow">¡Bienvenida, Majestad!</h2>
                  <p className="text-lg text-muted-foreground mb-10 text-pretty">
                    Tu estatus de <span className="founder-badge">Fundador</span> ha sido reservado para <strong>{email}</strong>.
                    Pronto recibirás noticias imperiales en tu cámara.
                  </p>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full py-6 text-xl rounded-2xl glass-card hover:bg-accent/10" asChild>
                      <Link href="/">Volver al Gran Hormiguero</Link>
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
