"use client"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AntIcon } from "@/components/ui/ant-icon"
import Link from "next/link"

export default function ExplorePage() {

  const antTypes = [
    {
      name: "Hormigas Obreras",
      role: "Recolección de Recursos",
      description: "La columna vertebral de tu colonia, especializadas en recolectar alimento y construir estructuras",
      stats: { fuerza: 3, velocidad: 4, inteligencia: 5 },
    },
    {
      name: "Hormigas Soldado",
      role: "Defensa y Combate",
      description: "Guerreras poderosas que protegen la colonia y lideran ataques contra enemigos",
      stats: { fuerza: 5, velocidad: 3, inteligencia: 3 },
    },
    {
      name: "Hormigas Exploradoras",
      role: "Exploración",
      description: "Hormigas rápidas y ágiles que exploran nuevos territorios y recopilan información",
      stats: { fuerza: 2, velocidad: 5, inteligencia: 4 },
    },
    {
      name: "Hormiga Reina",
      role: "Liderazgo de la Colonia",
      description: "El corazón de la colonia, responsable de la reproducción y decisiones estratégicas",
      stats: { fuerza: 4, velocidad: 2, inteligencia: 5 },
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <AntIcon className="text-primary" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Explora el Mundo de Nidoria</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre terrenos diversos, aprende sobre diferentes especies de hormigas y comprende las mecánicas que
            hacen de nuestra simulación multijugador de colonias de hormigas la experiencia más realista disponible.
          </p>
        </div>

        <section className="text-center py-12 bg-muted/30 rounded-lg">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">¡Estamos en desarrollo!</h2>
            <p className="text-muted-foreground mb-6">
              La aventura en Nidoria está a punto de comenzar.
            </p>
            <p className="text-muted-foreground mb-6">
              Sé parte de nuestro sueño y ayúdanos a construir la mejor experiencia.
              <br />
              Únete a nuestra comunidad en Discord para estar al tanto de las últimas novedades y participar en la evolución de Nidoria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="https://discord.gg/cd5GDqJC" target="_blank">Únete a Discord</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Especies de Hormigas y Roles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Construye una colonia equilibrada con diferentes tipos de hormigas, cada una especializada en tareas
              específicas y roles de combate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {antTypes.map((ant, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <AntIcon className="text-primary" size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{ant.name}</CardTitle>
                      <CardDescription className="text-primary font-medium">{ant.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{ant.description}</p>
                  <div>
                    <h4 className="font-medium mb-3">Estadísticas:</h4>
                    <div className="space-y-2">
                      {Object.entries(ant.stats).map(([stat, value]) => (
                        <div key={stat} className="flex items-center justify-between">
                          <span className="text-sm capitalize text-muted-foreground">{stat}:</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${i < value ? "bg-primary" : "bg-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Mecánicas Principales del Juego</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprender estas mecánicas es clave para construir una colonia exitosa y dominar en batallas multijugador.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Gestión de Recursos</CardTitle>
                <CardDescription>Gestiona eficientemente alimento, materiales y territorio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-medium">Producción de Alimento</span>
                  <span className="text-primary">Crítico para el crecimiento</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-medium">Expansión Territorial</span>
                  <span className="text-accent">Ventaja estratégica</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-medium">Recolección de Materiales</span>
                  <span className="text-secondary">Construir y mejorar</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Sistema de Combate</CardTitle>
                <CardDescription>Batallas estratégicas con tácticas en tiempo real</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-medium">Estrategia de Formación</span>
                  <span className="text-primary">Posicionamiento táctico</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-medium">Composición de Unidades</span>
                  <span className="text-accent">Fuerzas equilibradas</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-medium">Ventaja del Terreno</span>
                  <span className="text-secondary">Tácticas ambientales</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/*<section className="text-center py-12 bg-muted/30 rounded-lg">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">¿Listo para Construir tu Imperio?</h2>
            <p className="text-muted-foreground mb-6">
              Únete a miles de jugadores en la simulación definitiva de colonias de hormigas. Comienza tu aventura hoy y
              conviértete en el comandante de colonia más poderoso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">Crear tu Colonia</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            </div>
          </div>
        </section>*/}
      </main>
    </div>
  )
}
