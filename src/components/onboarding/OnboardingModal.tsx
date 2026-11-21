"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const STORAGE_KEY = "nidoria_onboarding_v1_done"

const STEPS = [
  {
    title: "Bienvenido a tu colonia",
    body: "En el Centro de Comando ves tus recursos arriba y las secciones principales. Desde aqui construyes, investigas, envias expediciones y haces Caza para hacer crecer tu hormiguero.",
  },
  {
    title: "Recursos: para que sirve cada uno",
    body: "Comida: se usa para que la reina ponga huevos (cuesta 40 de comida por huevo) y para mantener a tu colonia. Madera: se usa principalmente para construir y mejorar estructuras. Hojas: se usan en ciertas construcciones e investigaciones para avanzar. Recolecta enviando obreras a Expediciones.",
  },
  {
    title: "Ciclo de la reina y tiempos",
    body: "La reina pone huevos de forma periodica (cada poco tiempo) gastando comida. Un huevo tarda aproximadamente 1.5 minutos en convertirse en larva. Una larva tarda aproximadamente 2 minutos en convertirse en obrera. Gestiona bien la comida para no parar la produccion.",
  },
  {
    title: "Construcciones e Investigaciones",
    body: "En Construcciones mejoras estructuras (ej. hormiguero, almacenamiento). En Investigaciones desbloqueas mejoras que aumentan produccion, capacidad o desbloquean opciones. Revisa requisitos antes de empezar.",
  },
  {
    title: "Expediciones y Unidades",
    body: "En Expediciones (Misiones) asignas obreras a recolectar Comida, Madera u Hojas; tardan un tiempo y luego regresan con recursos. En Unidades ves y gestionas tus hormigas (obreras, soldados, etc.). Puedes cancelar una expedicion para recuperar las obreras.",
  },
  {
    title: "Caza, reportes y consejos",
    body: "En Caza buscas monstruos, envias una expedicion y esperas el resultado en el Buzon (Correos). Si algo falla (ej. construccion), lee el mensaje de error: suele decir que falta recurso o requisito. Usa la Wiki si necesitas mas ayuda. Buena suerte.",
  },
]

export function OnboardingModal() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    try {
      const done = localStorage.getItem(STORAGE_KEY)
      if (!done) setOpen(true)
    } catch {
      setOpen(true)
    }
  }, [])

  useEffect(() => {
    const handler = () => {
      setStep(0)
      setOpen(true)
    }
    window.addEventListener("open-onboarding", handler)
    return () => window.removeEventListener("open-onboarding", handler)
  }, [])

  const finish = async () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1")
    } catch {
      // ignore
    }
    const token = Cookies.get("auth_token")
    if (token) {
      try {
        await fetch("/api/users/me/onboarding-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: "{}",
        })
      } catch {
        // ignore backend errors; local flag still set
      }
    }
    setOpen(false)
  }

  if (!open) return null

  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6">
      <Card className="game-panel w-full max-w-lg border-primary/30 shadow-xl">
        <CardHeader>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Tutorial rapido - paso {step + 1} de {STEPS.length}
          </p>
          <CardTitle className="text-2xl gradient-text">{STEPS[step].title}</CardTitle>
          <CardDescription className="text-base leading-relaxed text-foreground/90">
            {STEPS[step].body}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={finish}
            className="text-muted-foreground"
          >
            Saltar tutorial
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
                Atras
              </Button>
            )}
            <Button
              type="button"
              className="interactive-button"
              onClick={() => {
                if (isLast) finish()
                else setStep((s) => s + 1)
              }}
            >
              {isLast ? "Empezar a jugar" : "Siguiente"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
