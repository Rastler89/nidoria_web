"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/ui/navigation"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background ant-texture">
      <Navigation />
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-lg text-center">
          <div className="nest-chamber p-8 md:p-12 shadow-2xl">
            <div className="flex justify-center mb-8">
              <div className="p-2">
                <img src="/nidoria2.png" alt="Nidoria" className="w-48 md:w-56" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">Acceso Restringido</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 text-pretty">
              El acceso a las colonias está actualmente restringido mientras preparamos el gran hormiguero de Nidoria.
            </p>
            <div className="space-y-4">
              <Button
                className="w-full py-8 text-xl rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 amber-glow font-bold"
                asChild
              >
                <Link href="/register">Pre-regístrate ahora</Link>
              </Button>
              <Button variant="outline" className="w-full py-6 text-xl rounded-2xl glass-card" asChild>
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
