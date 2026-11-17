"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const STORAGE_KEY = "nidoria_onboarding_v1_done"

const STEPS = [
  {
    title: "Bienvenido a tu colonia",
    body: "En el Centro de Comando verás tus recursos (arriba) y las secciones principales. Aquí empieza todo: construir, investigar, enviar misiones y hacer Caza.",
  },
  {
    title: "Construcciones e Investigaciones",
    body: "En Construcciones mejoras estructuras de la colonia. En Investigaciones desbloqueas tecnologías que cambian tu producción y tus unidades.",
  },
  {
    title: "Unidades y Misiones",
    body: "En Unidades gestionas tus hormigas (soldados, obreras, especiales). En Misiones/Exploraciones envías obreras a conseguir recursos con el tiempo.",
  },
  {
    title: "Caza y Buzón",
    body: "En Caza encuentras monstruos en el mapa, envías una expedición y esperas el viaje: el resultado llega como reporte al Buzón (Correos). Revísalo para ver botín y detalles del combate.",
  },
  {
    title: "Consejo rápido",
    body: "Si algo no queda claro, usa el enlace a la Wiki o explora con calma. Esta beta cambia a menudo: tus reportes ayudan mucho. ¡Buena suerte con tu hormiguero!",
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
            Tutorial rápido · paso {step + 1} de {STEPS.length}
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
                Atrás
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
