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
        <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="flex justify-center mb-10">
              <div className="inline-block transform hover:scale-105 transition-transform duration-500">
                <img src="/nidoria2.png" alt="Nidoria" className="mx-auto w-72 md:w-96" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-foreground mb-8 text-balance leading-tight">
              <span className="bg-gradient-to-b from-primary to-accent bg-clip-text text-transparent text-glow">
                Domina el Inframundo: La Simulación de Colonias Definitiva
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed font-serif italic">
              "En las profundidades de la tierra, el poder no se hereda, se construye túnel a túnel."
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button size="lg" className="text-xl px-12 py-8 rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 amber-glow text-2xl w-full sm:w-auto" asChild>
                <Link href="/register">Pre-regístrate ahora</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-xl px-12 py-8 rounded-2xl border-primary/40 text-primary hover:bg-primary/10 text-2xl w-full sm:w-auto backdrop-blur-sm" asChild>
                <Link href="/explore">Explorar el Mundo</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 soil-pattern relative overflow-hidden">
          <div className="max-w-5xl mx-auto">
            {/* Beneficios de Fundador Section */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <span className="founder-badge text-sm md:text-lg mb-4 block">Oferta de Lanzamiento</span>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Conviértete en Fundador</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Pre-regístrate hoy y asegura estas ventajas exclusivas para el día 1. Ayúdanos a forjar la primera gran colonia.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-8 border-accent/30 text-center hover:bg-accent/5 transition-colors group">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L9 9l-8 3 8 3 3 8 3-8 8-3-8-3-3-8z" /></svg>
                  </div>
                  <h4 className="text-xl font-bold mb-3">Acceso Anticipado</h4>
                  <p className="text-sm text-muted-foreground">Sé el primero en excavar los túneles de Nidoria antes del estreno global.</p>
                </div>

                <div className="glass-card p-8 border-accent/30 text-center hover:bg-accent/5 transition-colors group">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
                  </div>
                  <h4 className="text-xl font-bold mb-3">Emblema de Fundador</h4>
                  <p className="text-sm text-muted-foreground">Un distintivo visual único que mostrará tu estatus de pionero para siempre.</p>
                </div>

                <div className="glass-card p-8 border-accent/30 text-center hover:bg-accent/5 transition-colors group">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" /></svg>
                  </div>
                  <h4 className="text-xl font-bold mb-3">Bonus de Recursos</h4>
                  <p className="text-sm text-muted-foreground">Comienza tu colonia con un suministro extra de alimentos y materiales raros.</p>
                </div>
              </div>
            </div>

            <div className="nest-chamber p-8 md:p-12 text-center border-primary/40 bg-primary/5">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Únete a la Expedición</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Estamos construyendo algo grande. Aunque la colonia aún está en fase de hibernación, tú puedes ser uno de los arquitectos originales.
              </p>
              <Button variant="link" className="text-accent text-lg hover:text-accent/80" asChild>
                <Link href="/wiki">Consultar el Manual (Wiki) →</Link>
              </Button>
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
              <div className="nest-chamber p-8 text-center flex flex-col items-center group">
                <div className="mb-8 w-full overflow-hidden rounded-3xl">
                  <img
                    src="/ant-queen-chamber-golden-glow.png"
                    alt="Cámara de la Reina"
                    className="w-full h-48 object-cover border-2 border-primary/20 group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-accent">Gestión de la Reina</h3>
                <p className="text-muted-foreground">
                  Protege y gestiona tu reina para asegurar el crecimiento continuo de tu estirpe.
                </p>
              </div>

              <div className="nest-chamber p-8 text-center flex flex-col items-center group">
                <div className="mb-8 w-full overflow-hidden rounded-3xl">
                  <img
                    src="/ant-workers-carrying-food-teamwork.png"
                    alt="Trabajo en Equipo"
                    className="w-full h-48 object-cover border-2 border-primary/20 group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-accent">Trabajo en Equipo</h3>
                <p className="text-muted-foreground">
                  Coordina miles de trabajadoras para recolectar recursos y expandir tus fronteras.
                </p>
              </div>

              <div className="nest-chamber p-8 text-center flex flex-col items-center group">
                <div className="mb-8 w-full overflow-hidden rounded-3xl">
                  <img
                    src="/ant-colony-workers-building-tunnels.png"
                    alt="Construcción de Túneles"
                    className="w-full h-48 object-cover border-2 border-primary/20 group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-accent">Arquitectura Viva</h3>
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
                <div className="nest-chamber p-4 amber-glow float">
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
