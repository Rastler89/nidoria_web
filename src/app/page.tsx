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
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 hero-gradient ant-texture">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm">
                <NidoriaIcon className="text-primary" size={80} />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
              Construye tu{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Colonia en Nidoria
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Únete a miles de jugadores en la simulación de colonias de hormigas más avanzada. Construye túneles,
              gestiona trabajadoras y domina en batallas épicas entre colonias.
            </p>

            <div className="mb-8">
              <img
                src="/ant-colony-workers-building-tunnels.png"
                alt="Hormigas trabajadoras construyendo túneles"
                className="rounded-2xl shadow-2xl mx-auto max-w-2xl w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" className="text-lg px-8 py-4 rounded-xl" asChild>
                  <Link href="/dashboard">Entrar a tu Colonia</Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="text-lg px-8 py-4 rounded-xl" asChild>
                    <Link href="/register">Crear tu Colonia</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 rounded-xl bg-white/50 backdrop-blur-sm"
                    asChild
                  >
                    <Link href="/explore">Explorar el Mundo</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-accent/5 colony-pattern">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">La Comunidad de Nidoria</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">12,847</div>
                <div className="text-muted-foreground">Colonias Activas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">2.3M</div>
                <div className="text-muted-foreground">Hormigas Trabajadoras</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">156</div>
                <div className="text-muted-foreground">Batallas Diarias</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">98%</div>
                <div className="text-muted-foreground">Satisfacción</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">Domina el Arte de las Colonias de Hormigas</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Experimenta la simulación de colonias de hormigas más realista con IA avanzada, batallas multijugador en
                tiempo real y estrategias de supervivencia infinitas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center card-hover border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader className="pb-8">
                  <div className="flex justify-center mb-6">
                    <img
                      src="/ant-queen-chamber-golden-glow.png"
                      alt="Cámara de la Reina"
                      className="rounded-2xl w-full max-w-[200px]"
                    />
                  </div>
                  <CardTitle className="text-2xl mb-4">Gestión de la Reina</CardTitle>
                  <CardDescription className="text-lg">
                    Protege y gestiona tu reina para asegurar el crecimiento continuo de tu colonia
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center card-hover border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader className="pb-8">
                  <div className="flex justify-center mb-6">
                    <img
                      src="/ant-workers-carrying-food-teamwork.png"
                      alt="Hormigas Trabajando en Equipo"
                      className="rounded-2xl w-full max-w-[200px]"
                    />
                  </div>
                  <CardTitle className="text-2xl mb-4">Trabajo en Equipo</CardTitle>
                  <CardDescription className="text-lg">
                    Coordina miles de hormigas trabajadoras para recolectar recursos y construir túneles
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center card-hover border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader className="pb-8">
                  <div className="flex justify-center mb-6">
                    <img
                      src="/ant-colony-workers-building-tunnels.png"
                      alt="Construcción de Túneles"
                      className="rounded-2xl w-full max-w-[200px]"
                    />
                  </div>
                  <CardTitle className="text-2xl mb-4">Construcción de Túneles</CardTitle>
                  <CardDescription className="text-lg">
                    Diseña y construye complejas redes de túneles subterráneos para tu colonia
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-muted/30 to-muted/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">Características Únicas de Nidoria</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <NidoriaIcon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ecosistema Realista</h3>
                    <p className="text-muted-foreground">
                      Interactúa con el medio ambiente, clima y otras especies en un mundo vivo y dinámico.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-accent/10 mt-1">
                    <NidoriaIcon className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">IA Avanzada</h3>
                    <p className="text-muted-foreground">
                      Cada hormiga tiene comportamientos únicos y toma decisiones inteligentes basadas en la situación.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    <NidoriaIcon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Evolución de Especies</h3>
                    <p className="text-muted-foreground">
                      Desarrolla nuevas castas de hormigas especializadas según las necesidades de tu colonia.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <img
                  src="/ant-colony-workers-building-tunnels.png"
                  alt="Características del juego"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
