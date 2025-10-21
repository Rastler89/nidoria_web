"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/lib/auth"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Por favor ingresa un email válido"
    }

    if (!formData.username) {
      newErrors.username = "El nombre de usuario es requerido"
    } else if (formData.username.length < 3) {
      newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Por favor confirma tu contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const success = await register(formData.email, formData.username, formData.password)
      if (success) {
        router.push("/dashboard")
      } else {
        setErrors({ submit: "El registro falló. Por favor intenta de nuevo." })
      }
    } catch (error) {
      setErrors({ submit: "Ocurrió un error. Por favor intenta de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="max-h-screen relative overflow-hidden morphing-bg">
      {/*<div className="ant-particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="ant-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 25}s`,
              animationDuration: `${12 + Math.random() * 15}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>*/}

      <div className="absolute inset-0 bg-gradient-to-br from-secondary/15 via-background/5 to-primary/25">
        <div className="absolute inset-0 bg-[url('/ant-workers-carrying-food-teamwork.png')] bg-cover bg-center opacity-8"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10 relative">
            <div className="floating-animation inline-flex items-center justify-center w-28 h-28 glass-card rounded-full mb-8 pulse-glow relative">
              <svg className="w-14 h-14 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L8 8h8l-4-6zm0 20l4-6H8l4 6zm-6-8L2 12l4-2v4zm12 0v-4l4 2-4 2z" />
              </svg>
            </div>
            <h1 className="text-6xl font-bold gradient-text mb-6 text-balance">
              Únete a <span className="text-secondary">Nidoria</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed max-w-md mx-auto">
              Construye tu imperio subterráneo y lidera tu propia colonia de hormigas
            </p>

            <div
              className="absolute -top-8 -left-16 w-24 h-24 bg-primary/8 rounded-full blur-2xl floating-animation"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute -bottom-12 -right-20 w-32 h-32 bg-secondary/8 rounded-full blur-3xl floating-animation"
              style={{ animationDelay: "3s" }}
            ></div>
            <div
              className="absolute top-1/2 -left-8 w-12 h-12 bg-accent/10 rounded-full blur-xl floating-animation"
              style={{ animationDelay: "5s" }}
            ></div>
          </div>

          <div className="glass-card rounded-3xl p-10 shadow-2xl border border-border/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="relative">
                  <FormField
                    label="Email"
                    type="email"
                    placeholder="jugador@nidoria.com"
                    value={formData.email}
                    onChange={(value) => updateField("email", value)}
                    error={errors.email}
                    required
                    className="glass-input"
                  />
                </div>

                <div className="relative">
                  <FormField
                    label="Nombre de Jugador"
                    placeholder="Elige tu nombre de líder"
                    value={formData.username}
                    onChange={(value) => updateField("username", value)}
                    error={errors.username}
                    required
                    className="glass-input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <FormField
                      label="Contraseña"
                      type="password"
                      placeholder="Crea una contraseña segura"
                      value={formData.password}
                      onChange={(value) => updateField("password", value)}
                      error={errors.password}
                      required
                      className="glass-input"
                    />
                  </div>

                  <div className="relative">
                    <FormField
                      label="Confirmar Contraseña"
                      type="password"
                      placeholder="Confirma tu contraseña"
                      value={formData.confirmPassword}
                      onChange={(value) => updateField("confirmPassword", value)}
                      error={errors.confirmPassword}
                      required
                      className="glass-input"
                    />
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="glass-card p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive-foreground">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                className="interactive-button w-full text-xl py-6 rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-secondary hover:from-primary/90 hover:via-primary hover:to-secondary/90 text-primary-foreground font-bold shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" text="Construyendo tu colonia..." />
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Fundar Mi Colonia
                  </span>
                )}
              </Button>

              <div className="text-center pt-6 border-t border-border/20">
                <p className="text-muted-foreground">
                  ¿Ya tienes una colonia?{" "}
                  <Link
                    href="/login"
                    className="text-secondary hover:text-secondary/80 font-bold hover:underline transition-all duration-300"
                  >
                    Regresa a casa
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
