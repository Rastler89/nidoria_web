"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/ui/navigation"
import { FormField } from "@/components/ui/form-field"
import { useAuth } from "@/lib/auth"

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { register } = useAuth()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const username = formData.username.trim()
    const email = formData.email.trim()

    if (!username) {
      newErrors.username = "El nombre de jugador es requerido"
    } else if (username.length < 3) {
      newErrors.username = "Debe tener al menos 3 caracteres"
    }

    if (!email) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Introduce un email válido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "Debe tener al menos 6 caracteres"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateField = (field: keyof RegisterForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
    if (errors.submit) setErrors((prev) => ({ ...prev, submit: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})
    try {
      const result = await register(
        formData.email.trim(),
        formData.username.trim(),
        formData.password,
      )

      if (result.ok) {
        setSubmitted(true)
      } else {
        setErrors({
          submit: [result.error, result.details].filter(Boolean).join(" "),
        })
      }
    } catch (err) {
      setErrors({ submit: "Error de conexión con el servidor." })
    } finally {
      setIsSubmitting(false)
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
              <span className="founder-badge text-lg">Ventajas de Fundador</span>
              <h2 className="text-4xl font-bold text-foreground">Funda tu Colonia</h2>
              <div className="space-y-6">
                {[
                  { title: "Acceso a la Beta", desc: "Juega desde el primer día y ayúdanos a pulir Nidoria." },
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
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center">Crea tu cuenta</h1>
                  <p className="text-lg text-muted-foreground mb-8 text-center text-pretty">
                    Funda tu colonia en <span className="text-accent">Nidoria</span> y despierta a tu reina.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <FormField
                      label="Nombre de jugador"
                      placeholder="Tu nombre de líder"
                      value={formData.username}
                      onChange={(v) => updateField("username", v)}
                      error={errors.username}
                      required
                      className="bg-muted/20 border-primary/30"
                    />

                    <FormField
                      label="Correo Electrónico"
                      type="email"
                      placeholder="hormiga-reina@colonia.com"
                      value={formData.email}
                      onChange={(v) => updateField("email", v)}
                      error={errors.email}
                      required
                      className="bg-muted/20 border-primary/30"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Contraseña"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(v) => updateField("password", v)}
                        error={errors.password}
                        required
                        className="bg-muted/20 border-primary/30"
                      />
                      <FormField
                        label="Confirmar contraseña"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(v) => updateField("confirmPassword", v)}
                        error={errors.confirmPassword}
                        required
                        className="bg-muted/20 border-primary/30"
                      />
                    </div>

                    {errors.submit && (
                      <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center font-medium">
                        {errors.submit}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-8 text-xl rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 amber-glow font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      {isSubmitting ? "Preparando tu Colonia..." : "Fundar Mi Colonia"}
                    </Button>
                  </form>
                  <p className="mt-6 text-xs text-center text-muted-foreground/60">
                    Al crear tu cuenta recibirás un correo para verificar tu dirección.
                  </p>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    ¿Ya tienes una colonia?{" "}
                    <Link href="/login" className="text-accent hover:underline font-bold">
                      Inicia sesión
                    </Link>
                  </div>
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
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground text-glow">¡Colonia fundada!</h2>
                  <p className="text-lg text-muted-foreground mb-4 text-pretty">
                    Hemos enviado un correo de verificación a <strong>{formData.email}</strong>.
                  </p>
                  <p className="text-muted-foreground mb-10 text-pretty">
                    Ábrelo para despertar a tu reina y poder entrar al hormiguero.
                    Si no lo ves, revisa la carpeta de spam.
                  </p>
                  <div className="space-y-4">
                    <Button className="w-full py-6 text-xl rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                      <Link href="/login">Ir a iniciar sesión</Link>
                    </Button>
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
