"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NidoriaIcon } from "@/components/ui/nidoria-icon"
import { Navigation } from "@/components/ui/navigation"
import { useAuth } from "@/lib/auth"

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background ant-texture">
      <Navigation />

      <main>
        <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 hero-gradient overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="flex justify-center mb-10">
              <div className="inline-block transform hover:scale-105 transition-transform duration-500">
                <img src="/nidoria2.png" alt="Nidoria" className="mx-auto w-72 md:w-96" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground mb-8 text-balance">
              <span className="bg-gradient-to-b from-primary to-accent bg-clip-text text-transparent">
                Forja tu imperio subterráneo
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty">
              El universo subterráneo te aguarda. Gestiona recursos, muta tu especie y conquista el hormiguero en esta experiencia de estrategia persistente.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="text-xl px-10 py-6 rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 amber-glow" asChild>
                <Link href="/register">Pre-regístrate ahora</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-xl px-10 py-6 rounded-2xl glass-card"
                asChild
              >
                <Link href="/explore">Explorar el Mundo</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 soil-pattern relative">
          <div className="max-w-5xl mx-auto">
            <div className="nest-chamber p-8 md:p-12 text-center border-primary/40">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">La Comunidad de Nidoria</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-3">12,847</div>
                  <div className="text-muted-foreground text-lg uppercase tracking-wider">Colonias Activas</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-accent mb-3">2.3M</div>
                  <div className="text-muted-foreground text-lg uppercase tracking-wider">Hormigas</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-3">156</div>
                  <div className="text-muted-foreground text-lg uppercase tracking-wider">Batallas Diarias</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-accent mb-3">98%</div>
                  <div className="text-muted-foreground text-lg uppercase tracking-wider">Satisfacción</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8">Domina el Arte del Hormiguero</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Experimenta la simulación de colonias más realista con IA avanzada y estrategias de supervivencia infinitas en un mundo en constante evolución.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="nest-chamber p-8 text-center flex flex-col items-center">
                <div className="mb-8 w-full">
                  <img
                    src="/ant-queen-chamber-golden-glow.png"
                    alt="Cámara de la Reina"
                    className="rounded-3xl w-full h-48 object-cover border-2 border-primary/20"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">Gestión de la Reina</h3>
                <p className="text-muted-foreground">
                  Protege y gestiona tu reina para asegurar el crecimiento continuo de tu estirpe.
                </p>
              </div>

              <div className="nest-chamber p-8 text-center flex flex-col items-center">
                <div className="mb-8 w-full">
                  <img
                    src="/ant-workers-carrying-food-teamwork.png"
                    alt="Trabajo en Equipo"
                    className="rounded-3xl w-full h-48 object-cover border-2 border-primary/20"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">Trabajo en Equipo</h3>
                <p className="text-muted-foreground">
                  Coordina miles de trabajadoras para recolectar recursos y expandir tus fronteras.
                </p>
              </div>

              <div className="nest-chamber p-8 text-center flex flex-col items-center">
                <div className="mb-8 w-full">
                  <img
                    src="/ant-colony-workers-building-tunnels.png"
                    alt="Construcción de Túneles"
                    className="rounded-3xl w-full h-48 object-cover border-2 border-primary/20"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">Arquitectura Viva</h3>
                <p className="text-muted-foreground">
                  Diseña complejas redes de túneles que se adapten a los desafíos del terreno.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-10">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground text-center lg:text-left">El Despertar de Nidoria</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 rounded-full bg-primary/20 amber-glow">
                      <NidoriaIcon className="text-accent" size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Ecosistema Dinámico</h3>
                      <p className="text-lg text-muted-foreground">
                        Cada túnel cuenta, cada recurso importa. Interactúa con un mundo que respira.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="p-4 rounded-full bg-primary/20 amber-glow">
                      <NidoriaIcon className="text-accent" size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Evolución Dirigida</h3>
                      <p className="text-lg text-muted-foreground">
                        Adapta tus hormigas a través de mutaciones genéticas para sobrevivir a las amenazas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="nest-chamber p-4 amber-glow">
                  <img
                    src="/ant-colony-workers-building-tunnels.png"
                    alt="Características del juego"
                    className="rounded-2xl w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
