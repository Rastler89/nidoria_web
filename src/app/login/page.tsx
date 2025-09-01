"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/lib/auth"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { login, token } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "El email es requerido"
    }/* else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Por favor ingresa un email válido"
    }*/

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        router.push("/dashboard")
      } else {
        setErrors({ submit: "Email o contraseña incorrectos. Por favor intenta de nuevo." })
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
    <div className="min-h-screen relative overflow-hidden morphing-bg">
      <div className="ant-particles">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="ant-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/10 to-secondary/20">
        <div className="absolute inset-0 bg-[url('/ant-colony-workers-building-tunnels.png')] bg-cover bg-center opacity-10"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-12 relative">
            <div className="floating-animation inline-flex items-center justify-center w-24 h-24 glass-card rounded-3xl mb-6 pulse-glow">
              <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L8 8h8l-4-6zm0 20l4-6H8l4 6zm-6-8L2 12l4-2v4zm12 0v-4l4 2-4 2z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold gradient-text mb-4 text-balance">Bienvenido de Vuelta</h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Tu colonia te está esperando en <span className="text-secondary font-bold">Nidoria</span>
            </p>

            <div
              className="absolute -top-4 -right-8 w-16 h-16 bg-secondary/10 rounded-full blur-xl floating-animation"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute -bottom-8 -left-12 w-20 h-20 bg-primary/10 rounded-full blur-2xl floating-animation"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>

          <div className="glass-card rounded-3xl p-8 shadow-2xl border border-border/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="relative">
                  <FormField
                    label="Email/Usuario"
                    type="text"
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
                    label="Contraseña"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={formData.password}
                    onChange={(value) => updateField("password", value)}
                    error={errors.password}
                    required
                    className="glass-input"
                  />
                </div>
              </div>

              {errors.submit && (
                <div className="glass-card p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive-foreground">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                className="interactive-button w-full text-lg py-6 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" text="Accediendo a tu colonia..." />
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Entrar a Nidoria
                  </span>
                )}
              </Button>

              <div className="text-center pt-6 border-t border-border/20">
                <p className="text-muted-foreground">
                  ¿Nuevo en Nidoria?{" "}
                  <Link
                    href="/register"
                    className="text-secondary hover:text-secondary/80 font-bold hover:underline transition-all duration-300"
                  >
                    Únete a la colonia
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
