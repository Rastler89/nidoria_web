"use client"
import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Stats } from "@/components/stats"
import { useSocket } from "@/context/SocketContext"
import useSWR from "swr"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface Research {
  id: number
  name: string
  progress: number
  completed: boolean
  cost: {
    food: number
    wood?: number
    leaves?: number
  }
  timeLeft: string
  description: string
  benefits: string
  category: string
  researchTime?: string
  requirement?: string
}

export default function InvestigacionesPage() {
  const [selectedResearch, setSelectedResearch] = useState<number | null>(null)
  const { data: socketData } = useSocket()
  const { data: serverData, mutate } = useSWR('/api/investigations', fetcher)

  const defaultGameData = {
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

  const activeResearch: Research[] = socketData?.investigations || serverData?.investigations || defaultGameData.research;
  const lockedResearch: Research[] = socketData?.lockedResearch || serverData?.lockedResearch || defaultGameData.lockedResearch;

  const categories = ["Todas", "Economía", "Militar", "Infraestructura", "Social"]
  const [selectedCategory, setSelectedCategory] = useState("Todas")

  const filteredResearch =
    selectedCategory === "Todas" ? activeResearch : activeResearch.filter((r) => r.category === selectedCategory)

  const filteredLockedResearch =
    selectedCategory === "Todas"
      ? lockedResearch
      : lockedResearch.filter((r) => r.category === selectedCategory)

  const handleResearch = async (id: number) => {
    try {
        const res = await fetch('/api/investigations', {
            method: 'POST',
            body: JSON.stringify({ investigationId: id }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error('Failed to start research');
        toast({ title: "Investigación iniciada", description: "El desarrollo de la tecnología ha comenzado." });
        mutate();
    } catch (e) {
        toast({ title: "Error", description: "No se pudo iniciar la investigación.", variant: "destructive" });
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-12">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Panel de recursos */}
          <Stats />

           {/* Visual del Laboratorio (Nueva Sección) */}
           <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 border border-border shadow-lg">
            <Image
              src="/ant-queen-chamber-golden-glow.png"
              alt="Laboratorio de Investigación"
              fill
              className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent flex flex-col justify-end p-6 md:p-8">
               <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2">
                 Cámara de Evolución
               </h1>
               <p className="text-white/90 text-lg max-w-2xl drop-shadow-sm">
                 Desarrolla nuevas tecnologías para adaptar tu especie. Descubre mejoras genéticas, tácticas militares y avances en infraestructura.
               </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
             <div>
                <h2 className="text-3xl font-bold gradient-text">🔬 Investigaciones</h2>
                <p className="text-muted-foreground">Árbol tecnológico y evolutivo</p>
             </div>
             <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Lista de investigaciones */}
            <div className="xl:col-span-2 space-y-6">
              <Card className="game-panel border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                    🧪 Proyectos Activos
                  </CardTitle>
                  <CardDescription>Tecnologías en desarrollo y completadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredResearch.map((research) => (
                    <div
                      key={research.id}
                      className={`tech-node p-6 cursor-pointer transition-all hover:bg-accent/5 ${
                        selectedResearch === research.id ? "ring-2 ring-primary bg-accent/10" : "bg-card/50"
                      }`}
                      onClick={() => setSelectedResearch(research.id)}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-xl">{research.name}</h4>
                            <Badge variant="outline" className="text-xs border-accent/50 text-accent-foreground">
                              {research.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{research.description}</p>
                        </div>
                        <div className="text-right">
                          {research.completed ? (
                            <Badge className="stat-badge bg-green-500/80 text-white">✓ Completado</Badge>
                          ) : (
                            <div className="flex flex-col items-end">
                                <Badge variant="outline" className="mb-1">
                                  {research.progress}%
                                </Badge>
                                <span className="text-xs text-muted-foreground">{research.progress > 0 ? "En proceso" : "Disponible"}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {!research.completed && (
                        <div className="space-y-3 pt-4 border-t border-border/50">
                          {research.progress > 0 ? (
                             <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                   <span>Progreso de investigación</span>
                                   <span>{research.timeLeft} restantes</span>
                                </div>
                                <div className="progress-bar h-3">
                                  <div
                                    className="progress-fill transition-all duration-300 bg-accent"
                                    style={{ width: `${research.progress}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-end mt-2">
                                    <Button variant="ghost" size="sm" className="text-xs h-8 text-accent hover:text-accent/80">
                                      Acelerar con Gemas
                                    </Button>
                                </div>
                             </div>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Coste de Investigación</p>
                              <div className="flex gap-2 text-sm flex-wrap">
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                                  🍯 {research.cost.food?.toLocaleString()}
                                </span>
                                {research.cost.wood && (
                                  <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium">
                                    🪵 {research.cost.wood.toLocaleString()}
                                  </span>
                                )}
                                <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded text-xs font-medium">
                                  🍃 {research.cost.leaves?.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-end mt-2">
                                  <Button
                                    className="interactive-button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleResearch(research.id);
                                    }}
                                  >
                                    Iniciar Investigación
                                  </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {research.completed && (
                          <div className="pt-2 mt-2 border-t border-border/50">
                             <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                                ✅ Beneficio activo: <span className="text-foreground font-normal">{research.benefits}</span>
                             </p>
                          </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="game-panel opacity-90">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                    🔒 Futuros Descubrimientos
                  </CardTitle>
                  <CardDescription>Tecnologías avanzadas que requieren investigaciones previas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredLockedResearch.map((research) => (
                    <div key={research.id} className="tech-node locked p-6 bg-muted/20 border-dashed border-2 border-muted">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-xl text-muted-foreground">{research.name}</h4>
                            <Badge variant="outline" className="text-xs opacity-60">
                              {research.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{research.description}</p>
                        </div>
                        <Badge variant="outline" className="opacity-60">
                          Bloqueado
                        </Badge>
                      </div>

                      <div className="mt-3 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                          <p className="text-xs text-destructive font-bold flex items-center gap-2">
                             🚫 Requiere: {research.requirement}
                          </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Panel lateral */}
            <div className="space-y-6">
              <Card className="game-panel sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl">📊 Resumen Científico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="text-2xl font-bold text-green-600">{activeResearch.filter(r => r.completed).length}</div>
                      <div className="text-xs text-muted-foreground uppercase">Completadas</div>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="text-2xl font-bold text-accent">{activeResearch.filter(r => r.progress > 0 && !r.completed).length}</div>
                      <div className="text-xs text-muted-foreground uppercase">En Curso</div>
                    </div>
                  </div>

                  {/* Barra de progreso global */}
                  <div className="space-y-2">
                     <div className="flex justify-between text-xs">
                        <span>Progreso Tecnológico</span>
                        <span className="font-bold">52%</span>
                     </div>
                     <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent w-[52%]"></div>
                     </div>
                  </div>

                  {selectedResearch ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {(() => {
                          const research = activeResearch.find((r) => r.id === selectedResearch)
                          if (!research) return null;
                          return (
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                               <h3 className="font-bold text-lg text-primary mb-2">{research.name}</h3>
                               <div className="space-y-2 text-sm">
                                  <div className="flex justify-between py-1 border-b border-primary/10">
                                      <span className="text-muted-foreground">Categoría</span>
                                      <span className="font-medium">{research.category}</span>
                                  </div>
                                  <div className="flex justify-between py-1 border-b border-primary/10">
                                      <span className="text-muted-foreground">Estado</span>
                                      <span className={`font-bold ${research.completed ? "text-green-600" : research.progress > 0 ? "text-accent" : "text-muted-foreground"}`}>
                                        {research.completed ? "Completado" : research.progress > 0 ? "Investigando" : "Pendiente"}
                                      </span>
                                  </div>
                               </div>
                               <div className="mt-4 bg-background/50 p-3 rounded-lg">
                                  <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Beneficio:</p>
                                  <p className="text-sm text-foreground/90">{research.benefits}</p>
                               </div>
                            </div>
                          );
                        })()}
                    </div>
                  ) : (
                     <div className="text-center p-6 text-muted-foreground text-sm italic bg-muted/10 rounded-xl">
                        Selecciona una investigación para ver sus detalles.
                     </div>
                  )}

                  <div className="pt-4 border-t border-border space-y-3">
                     <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="text-lg font-bold text-primary">Nivel de Laboratorio: 1</div>
                        <div className="text-xs text-muted-foreground">Velocidad Base: +10%</div>
                     </div>
                     <Button className="w-full" variant="outline">
                        📋 Ver Cola de Investigación
                     </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
