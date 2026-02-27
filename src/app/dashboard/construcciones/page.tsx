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

interface Construction {
  id: number
  name: string
  level: number
  upgrading: boolean
  maxLevel: number
  cost: {
    food: number
    wood: number
    leaves?: number
  }
  description: string
  benefits: string
  upgradeTime: string
  timeLeft?: string
}

export default function ConstruccionesPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)
  const { data: socketData } = useSocket()
  const { data: serverData, mutate } = useSWR('/api/constructions', fetcher)

  // Fallback data structure if API returns nothing or error
  const defaultGameData = {
    constructions: [
      {
        id: 1,
        name: "Cámara de Cría",
        level: 3,
        upgrading: false,
        maxLevel: 10,
        cost: { food: 500, wood: 200 },
        description: "Aumenta la producción de larvas en un 15% por nivel",
        benefits: "Producción actual: +45% larvas/hora",
        upgradeTime: "2h 30m",
      },
      {
        id: 2,
        name: "Almacén de Comida",
        level: 5,
        upgrading: true,
        maxLevel: 15,
        cost: { wood: 800, leaves: 300 },
        description: "Incrementa la capacidad de almacenamiento de comida",
        benefits: "Capacidad actual: 12,500 unidades",
        upgradeTime: "1h 45m",
        timeLeft: "1h 23m",
      },
      {
        id: 3,
        name: "Túneles de Defensa",
        level: 2,
        upgrading: false,
        maxLevel: 8,
        cost: { wood: 1200, food: 400 },
        description: "Mejora las defensas de la colonia contra ataques",
        benefits: "Defensa actual: +20% resistencia",
        upgradeTime: "3h 15m",
      },
      {
        id: 4,
        name: "Laboratorio",
        level: 1,
        upgrading: false,
        maxLevel: 12,
        cost: { leaves: 600, wood: 400 },
        description: "Permite investigaciones avanzadas y acelera el progreso",
        benefits: "Velocidad investigación: +10%",
        upgradeTime: "4h 00m",
      },
      {
        id: 5,
        name: "Cuartel",
        level: 2,
        upgrading: false,
        maxLevel: 10,
        cost: { food: 1000, wood: 600 },
        description: "Entrena soldados más rápido y desbloquea nuevos tipos",
        benefits: "Velocidad entrenamiento: +20%",
        upgradeTime: "2h 45m",
      },
    ],
    lockedBuildings: [
      {
        id: 6,
        name: "Cámara Real",
        level: 0,
        requirement: "Laboratorio Nivel 3",
        cost: { food: 2000, wood: 1500, leaves: 800 },
        description: "Permite criar reinas especializadas para expandir el territorio",
        benefits: "Desbloquea: Expansión territorial, Reinas especializadas",
        upgradeTime: "8h 00m",
      },
      {
        id: 7,
        name: "Torre de Vigilancia",
        level: 0,
        requirement: "Túneles de Defensa Nivel 5",
        cost: { wood: 1800, leaves: 600 },
        description: "Detecta ataques enemigos con anticipación",
        benefits: "Alerta temprana: +30 minutos de preparación",
        upgradeTime: "5h 30m",
      },
      {
        id: 8,
        name: "Granja de Hongos",
        level: 0,
        requirement: "Investigación: Cultivo Avanzado",
        cost: { leaves: 1200, food: 800 },
        description: "Produce comida automáticamente sin necesidad de obreras",
        benefits: "Producción automática: 50 comida/hora",
        upgradeTime: "6h 15m",
      },
      {
        id: 9,
        name: "Centro de Comunicaciones",
        level: 0,
        requirement: "Investigación: Comunicación Avanzada",
        cost: { leaves: 1500, wood: 1000 },
        description: "Permite coordinar ataques con otras colonias aliadas",
        benefits: "Desbloquea: Alianzas, Ataques coordinados",
        upgradeTime: "7h 00m",
      },
    ],
  }

  // Determine which data to use: Socket > Server > Default
  const activeConstructions: Construction[] = socketData?.constructions || serverData?.constructions || defaultGameData.constructions;
  const lockedBuildings: any[] = socketData?.lockedBuildings || serverData?.lockedBuildings || defaultGameData.lockedBuildings;

  const handleUpgrade = async (id: number) => {
    try {
      const res = await fetch('/api/constructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ constructionId: id })
      });

      if (!res.ok) {
        throw new Error("Failed to upgrade");
      }

      toast({
        title: "Mejora iniciada",
        description: "La construcción se está mejorando.",
      });

      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar la mejora.",
        variant: "destructive"
      });
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-12">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Panel de recursos */}
          <Stats />

          {/* Visual del Nido (Nueva Sección) */}
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 border border-border shadow-lg">
            <Image
              src="/ant-colony-workers-building-tunnels.png"
              alt="Interior del Nido"
              fill
              className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent flex flex-col justify-end p-6 md:p-8">
               <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2">
                 Nido Central
               </h1>
               <p className="text-white/90 text-lg max-w-2xl drop-shadow-sm">
                 Gestiona el crecimiento de tu colonia. Construye nuevas cámaras, almacenes y defensas para asegurar la supervivencia de la reina.
               </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
             <div>
                <h2 className="text-3xl font-bold gradient-text">🏗️ Construcciones</h2>
                <p className="text-muted-foreground">Administra la infraestructura de tu imperio</p>
             </div>
             <Link href="/dashboard">
              <Button variant="outline" className="bg-background">
                ← Volver al Centro de Comando
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Lista de construcciones */}
            <div className="xl:col-span-2 space-y-6">
              <Card className="game-panel border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                    🏠 Edificios Activos
                  </CardTitle>
                  <CardDescription>Estructuras construidas y operativas en tu colonia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeConstructions.map((construction) => (
                    <div
                      key={construction.id}
                      className={`tech-node p-6 cursor-pointer transition-all hover:bg-accent/5 ${
                        selectedBuilding === construction.id ? "ring-2 ring-primary bg-accent/10" : "bg-card/50"
                      }`}
                      onClick={() => setSelectedBuilding(construction.id)}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                             <h4 className="font-bold text-xl">{construction.name}</h4>
                             <Badge variant="secondary" className="text-xs">
                               Nivel {construction.level}
                             </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{construction.description}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                           {construction.upgrading && <Badge className="bg-yellow-500/80 text-white animate-pulse">⚡ Mejorando</Badge>}
                        </div>
                      </div>

                      {/* Detalles desplegados o siempre visibles de forma resumida */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
                          <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Beneficio Actual</p>
                              <p className="text-sm text-primary font-medium">{construction.benefits}</p>
                          </div>

                          {construction.upgrading ? (
                             <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                   <span>Progreso</span>
                                   <span>{construction.timeLeft}</span>
                                </div>
                                <div className="progress-bar h-2">
                                  <div className="progress-fill w-3/4 animate-pulse"></div>
                                </div>
                             </div>
                          ) : (
                             <div className="flex flex-col gap-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Coste de Mejora</p>
                                <div className="flex gap-2 text-sm flex-wrap">
                                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                                    🍯 {construction.cost.food?.toLocaleString()}
                                  </span>
                                  <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium">
                                    🪵 {construction.cost.wood?.toLocaleString()}
                                  </span>
                                  {construction.cost.leaves && (
                                    <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded text-xs font-medium">
                                      🍃 {construction.cost.leaves.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                             </div>
                          )}
                      </div>

                      {!construction.upgrading && (
                         <div className="mt-4 flex justify-end">
                            <Button
                              size="sm"
                              className="interactive-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpgrade(construction.id);
                              }}
                            >
                              Mejorar ({construction.upgradeTime})
                            </Button>
                         </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="game-panel opacity-90">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                    🔒 Proyectos Futuros
                  </CardTitle>
                  <CardDescription>
                    Estructuras avanzadas disponibles tras cumplir requisitos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lockedBuildings.map((building) => (
                    <div key={building.id} className="tech-node locked p-6 bg-muted/20 border-dashed border-2 border-muted">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xl text-muted-foreground">{building.name}</h4>
                            <Badge variant="outline" className="text-xs">Bloqueado</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{building.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                          <p className="text-xs text-destructive font-bold flex items-center gap-2">
                             🚫 Requiere: {building.requirement}
                          </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Panel lateral de información y estadísticas */}
            <div className="space-y-6">
              <Card className="game-panel sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl">📊 Resumen de Colonia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                      <div className="text-3xl font-bold text-primary">{activeConstructions.length}</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Edificios</div>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                      <div className="text-3xl font-bold text-accent">{activeConstructions.filter(c => c.upgrading).length}</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Obras</div>
                    </div>
                  </div>

                  {selectedBuilding ? (
                     <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {(() => {
                          const building = activeConstructions.find((b) => b.id === selectedBuilding);
                          if (!building) return null;
                          return (
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                               <h3 className="font-bold text-lg text-primary mb-2">{building.name}</h3>
                               <div className="space-y-2 text-sm">
                                  <div className="flex justify-between py-1 border-b border-primary/10">
                                     <span className="text-muted-foreground">Nivel Máximo</span>
                                     <span className="font-medium">{building.maxLevel}</span>
                                  </div>
                                  <div className="flex justify-between py-1 border-b border-primary/10">
                                     <span className="text-muted-foreground">Tiempo Mejora</span>
                                     <span className="font-medium">{building.upgradeTime}</span>
                                  </div>
                               </div>
                               <div className="mt-4">
                                  <p className="text-xs font-semibold text-muted-foreground mb-1">PRÓXIMO NIVEL:</p>
                                  <p className="text-sm text-foreground/80 italic">
                                     {building.name === "Cámara de Cría" && `Producción: +${(building.level + 1) * 15}% larvas/hora`}
                                     {building.name === "Almacén de Comida" && `Capacidad: ${(building.level + 1) * 2500} unidades`}
                                     {building.name === "Túneles de Defensa" && `Defensa: +${(building.level + 1) * 10}% resistencia`}
                                     {building.name === "Laboratorio" && `Investigación: +${(building.level + 1) * 10}% velocidad`}
                                     {building.name === "Cuartel" && `Entrenamiento: +${(building.level + 1) * 10}% velocidad`}
                                  </p>
                               </div>
                            </div>
                          );
                        })()}
                     </div>
                  ) : (
                     <div className="text-center p-8 text-muted-foreground text-sm italic bg-muted/10 rounded-xl">
                        Selecciona un edificio para ver más detalles técnicos.
                     </div>
                  )}

                  <div className="space-y-3 pt-4 border-t border-border">
                     <Button className="w-full" variant="secondary">
                        Ver Árbol Tecnológico
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
