"use client"
import { useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/ui/navigation"
import { useAuth } from "@/lib/auth"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = "El email es requerido"
    if (!formData.password) newErrors.password = "La contraseña es requerida"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        router.push("/dashboard")
      } else {
        setErrors({ submit: "Credenciales inválidas o acceso no autorizado." })
      }
    } catch (error) {
      setErrors({ submit: "Error de conexión con el hormiguero." })
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  return (
    <div className="min-h-screen bg-background ant-texture">
      <Navigation />
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block p-4 mb-4">
              <img src="/nidoria2.png" alt="Nidoria" className="w-32 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Acceso a la Colonia</h1>
            <div className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider mb-6">
              Mantenimiento / Solo Staff
            </div>
          </div>

          <div className="nest-chamber p-8 shadow-2xl relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  label="Correo Electrónico"
                  type="email"
                  placeholder="reina@nidoria.com"
                  value={formData.email}
                  onChange={(v) => updateField("email", v)}
                  error={errors.email}
                  required
                  className="bg-muted/20 border-primary/20"
                />
                <FormField
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(v) => updateField("password", v)}
                  error={errors.password}
                  required
                  className="bg-muted/20 border-primary/20"
                />
              </div>

              {errors.submit && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                  {errors.submit}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 text-lg rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 amber-glow font-bold transition-all active:scale-95"
              >
                {isLoading ? "Validando..." : "Entrar al Hormiguero"}
              </Button>

              <div className="text-center pt-4 border-t border-primary/10">
                <p className="text-sm text-muted-foreground">
                  ¿No tienes acceso?{" "}
                  <Link href="/register" className="text-accent hover:underline font-bold">
                    Pre-regístrate como Fundador
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground/50 italic">
            "Solo las hormigas con el aroma correcto pueden entrar durante la hibernación."
          </p>
        </div>
      </div>
    </div>
  )
}
