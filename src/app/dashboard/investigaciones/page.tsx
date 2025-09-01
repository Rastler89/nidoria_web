"use client"
import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function InvestigacionesPage() {
  const [selectedResearch, setSelectedResearch] = useState<number | null>(null)

  const gameData = {
    resources: {
      eggs: 234,
      larvae: 156,
      workers: 1247,
      food: 2340,
      wood: 890,
      leaves: 567,
    },
    research: [
      {
        id: 1,
        name: "Eficiencia de Recolección",
        progress: 75,
        completed: false,
        cost: { food: 300, leaves: 200 },
        timeLeft: "1h 23m",
        description: "Aumenta la velocidad de recolección de recursos",
        benefits: "Obreras recolectan +15% más rápido",
        category: "Economía",
      },
      {
        id: 2,
        name: "Resistencia de Soldados",
        progress: 100,
        completed: true,
        cost: { food: 500, wood: 300 },
        timeLeft: "",
        description: "Mejora la resistencia y supervivencia en combate",
        benefits: "Soldados reciben +20% de vida",
        category: "Militar",
      },
      {
        id: 3,
        name: "Velocidad de Construcción",
        progress: 30,
        completed: false,
        cost: { wood: 400, leaves: 250 },
        timeLeft: "3h 45m",
        description: "Acelera todos los procesos de construcción",
        benefits: "Construcciones 25% más rápidas",
        category: "Infraestructura",
      },
      {
        id: 4,
        name: "Comunicación Avanzada",
        progress: 0,
        completed: false,
        cost: { leaves: 600, food: 400 },
        timeLeft: "",
        description: "Desarrolla sistemas de comunicación complejos",
        benefits: "Permite coordinar ataques grupales",
        category: "Social",
      },
    ],
    lockedResearch: [
      {
        id: 5,
        name: "Cultivo Avanzado",
        requirement: "Laboratorio Nivel 3",
        cost: { food: 800, leaves: 500 },
        description: "Técnicas avanzadas de cultivo de hongos",
        benefits: "Desbloquea la Granja de Hongos",
        category: "Economía",
        researchTime: "6h 00m",
      },
      {
        id: 6,
        name: "Genética de Soldados",
        requirement: "Resistencia de Soldados",
        cost: { food: 1200, wood: 800 },
        description: "Manipulación genética para crear soldados superiores",
        benefits: "Permite crear soldados élite mejorados",
        category: "Militar",
        researchTime: "8h 30m",
      },
      {
        id: 7,
        name: "Arquitectura Subterránea",
        requirement: "Velocidad de Construcción",
        cost: { wood: 1500, leaves: 900 },
        description: "Técnicas avanzadas de construcción subterránea",
        benefits: "Desbloquea túneles profundos y estructuras complejas",
        category: "Infraestructura",
        researchTime: "10h 00m",
      },
      {
        id: 8,
        name: "Inteligencia Colectiva",
        requirement: "Comunicación Avanzada",
        cost: { leaves: 2000, food: 1500 },
        description: "Desarrollo de una mente colmena avanzada",
        benefits: "Todas las unidades ganan +50% eficiencia",
        category: "Social",
        researchTime: "12h 00m",
      },
    ],
  }

  const categories = ["Todas", "Economía", "Militar", "Infraestructura", "Social"]
  const [selectedCategory, setSelectedCategory] = useState("Todas")

  const filteredResearch =
    selectedCategory === "Todas" ? gameData.research : gameData.research.filter((r) => r.category === selectedCategory)

  const filteredLockedResearch =
    selectedCategory === "Todas"
      ? gameData.lockedResearch
      : gameData.lockedResearch.filter((r) => r.category === selectedCategory)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Panel de recursos */}
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border border-primary/30 glow-effect">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🥚 Huevos</div>
                <div className="text-2xl font-bold">{gameData.resources.eggs.toLocaleString()}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🐛 Larvas</div>
                <div className="text-2xl font-bold">{gameData.resources.larvae.toLocaleString()}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🐜 Obreras</div>
                <div className="text-2xl font-bold">{gameData.resources.workers.toLocaleString()}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🍯 Comida</div>
                <div className="text-2xl font-bold">{gameData.resources.food.toLocaleString()}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🪵 Madera</div>
                <div className="text-2xl font-bold">{gameData.resources.wood.toLocaleString()}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🍃 Hojas</div>
                <div className="text-2xl font-bold">{gameData.resources.leaves.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Navegación de regreso */}
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="outline" className="mb-4 bg-transparent">
                ← Volver al Centro de Comando
              </Button>
            </Link>
            <h1 className="text-4xl font-bold gradient-text mb-2">🔬 Investigaciones</h1>
            <p className="text-xl text-muted-foreground">
              Desarrolla tecnologías avanzadas para evolucionar tu especie
            </p>
          </div>

          {/* Filtros por categoría */}
          <div className="mb-6">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Lista de investigaciones */}
            <div className="xl:col-span-2 space-y-6">
              <Card className="game-panel">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text">🧪 Investigaciones Activas</CardTitle>
                  <CardDescription>Tecnologías en desarrollo y completadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredResearch.map((research) => (
                    <div
                      key={research.id}
                      className={`tech-node p-6 cursor-pointer transition-all ${
                        selectedResearch === research.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedResearch(research.id)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-xl">{research.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {research.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{research.description}</p>
                          <p className="text-sm text-accent font-medium">{research.benefits}</p>
                        </div>
                        <div className="text-right">
                          {research.completed ? (
                            <Badge className="stat-badge bg-accent">✓ Completado</Badge>
                          ) : (
                            <Badge variant="outline" className="mb-2">
                              {research.progress}%
                            </Badge>
                          )}
                        </div>
                      </div>

                      {!research.completed && (
                        <div className="space-y-3">
                          <div className="progress-bar h-4">
                            <div
                              className="progress-fill transition-all duration-300"
                              style={{ width: `${research.progress}%` }}
                            ></div>
                          </div>
                          {research.progress > 0 && (
                            <p className="text-sm text-accent font-medium">⏱️ {research.timeLeft} restantes</p>
                          )}
                          {research.progress === 0 && (
                            <div className="space-y-3">
                              <div className="flex gap-2 text-sm flex-wrap">
                                <span className="bg-primary/20 px-3 py-1 rounded-full">
                                  🍯 {research.cost.food?.toLocaleString()}
                                </span>
                                {research.cost.wood && (
                                  <span className="bg-secondary/20 px-3 py-1 rounded-full">
                                    🪵 {research.cost.wood.toLocaleString()}
                                  </span>
                                )}
                                <span className="bg-accent/20 px-3 py-1 rounded-full">
                                  🍃 {research.cost.leaves?.toLocaleString()}
                                </span>
                              </div>
                              <Button className="w-full interactive-button">Iniciar Investigación</Button>
                            </div>
                          )}
                          {research.progress > 0 && research.progress < 100 && (
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              Acelerar con Gemas
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="game-panel">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text">🔒 Investigaciones Bloqueadas</CardTitle>
                  <CardDescription>Tecnologías avanzadas que requieren investigaciones previas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredLockedResearch.map((research) => (
                    <div key={research.id} className="tech-node locked p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-xl opacity-70">{research.name}</h4>
                            <Badge variant="outline" className="text-xs opacity-60">
                              {research.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{research.description}</p>
                          <p className="text-sm text-accent/70 font-medium mb-2">{research.benefits}</p>
                          <p className="text-xs text-destructive font-medium">📋 Requiere: {research.requirement}</p>
                        </div>
                        <Badge variant="outline" className="opacity-60">
                          Bloqueado
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex gap-2 text-sm flex-wrap opacity-60">
                          <span className="bg-primary/10 px-3 py-1 rounded-full">
                            🍯 {research.cost.food?.toLocaleString()}
                          </span>
                          {research.cost.wood && (
                            <span className="bg-secondary/10 px-3 py-1 rounded-full">
                              🪵 {research.cost.wood.toLocaleString()}
                            </span>
                          )}
                          <span className="bg-accent/10 px-3 py-1 rounded-full">
                            🍃 {research.cost.leaves?.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground opacity-60">
                          Tiempo de investigación: {research.researchTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Panel lateral */}
            <div className="space-y-6">
              <Card className="game-panel">
                <CardHeader>
                  <CardTitle className="text-xl">📊 Progreso Científico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-primary/20">
                      <div className="text-2xl font-bold text-primary">2</div>
                      <div className="text-sm text-muted-foreground">Completadas</div>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/20">
                      <div className="text-2xl font-bold text-accent">2</div>
                      <div className="text-sm text-muted-foreground">En Progreso</div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/20">
                      <div className="text-2xl font-bold text-secondary">4</div>
                      <div className="text-sm text-muted-foreground">Bloqueadas</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/20">
                      <div className="text-2xl font-bold">52%</div>
                      <div className="text-sm text-muted-foreground">Progreso Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedResearch && (
                <Card className="game-panel">
                  <CardHeader>
                    <CardTitle className="text-xl">🔍 Detalles de Investigación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const research = gameData.research.find((r) => r.id === selectedResearch)
                      return research ? (
                        <div className="space-y-4">
                          <h3 className="font-bold text-lg gradient-text">{research.name}</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Categoría:</span>
                              <span className="font-bold">{research.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Progreso:</span>
                              <span className="font-bold">{research.progress}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Estado:</span>
                              <span
                                className={`font-bold ${research.completed ? "text-accent" : research.progress > 0 ? "text-primary" : "text-muted-foreground"}`}
                              >
                                {research.completed
                                  ? "Completado"
                                  : research.progress > 0
                                    ? "En Progreso"
                                    : "Disponible"}
                              </span>
                            </div>
                          </div>
                          <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground mb-2">Beneficios:</p>
                            <p className="text-sm text-accent">{research.benefits}</p>
                          </div>
                        </div>
                      ) : null
                    })()}
                  </CardContent>
                </Card>
              )}

              <Card className="game-panel">
                <CardHeader>
                  <CardTitle className="text-xl">⚡ Laboratorio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center p-4 rounded-lg bg-primary/20">
                    <div className="text-2xl font-bold text-primary">Nivel 1</div>
                    <div className="text-sm text-muted-foreground">Velocidad: +10%</div>
                  </div>
                  <Button className="w-full interactive-button">🔬 Mejorar Laboratorio</Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    📋 Cola de Investigación
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
