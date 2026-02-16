"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/ui/navigation"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background ant-texture">
      <Navigation />
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-md text-center">
          <div className="glass-card rounded-3xl p-10 shadow-2xl border border-border/20 backdrop-blur-md">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/20 animate-pulse">
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L8 8h8l-4-6zm0 20l4-6H8l4 6zm-6-8L2 12l4-2v4zm12 0v-4l4 2-4 2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Próximamente</h1>
            <p className="text-muted-foreground text-xl mb-8">
              El acceso a las colonias está actualmente restringido mientras preparamos el lanzamiento oficial.
            </p>
            <div className="space-y-4">
              <Button className="w-full py-6 text-lg rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link href="/register">Pre-regístrate para el lanzamiento</Link>
              </Button>
              <Button variant="ghost" className="w-full py-6 text-lg rounded-2xl" asChild>
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
