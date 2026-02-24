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
  // Assuming the API/Socket returns an object with a 'constructions' array
  // If the returned data doesn't match the shape, we might have issues, but this is a best-effort integration.
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
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Panel de recursos */}
          <Stats />

          {/* Navegación de regreso */}
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="outline" className="mb-4 bg-transparent">
                ← Volver al Centro de Comando
              </Button>
            </Link>
            <h1 className="text-4xl font-bold gradient-text mb-2">🏗️ Construcciones</h1>
            <p className="text-xl text-muted-foreground">
              Mejora y construye nuevas estructuras para fortalecer tu colonia
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Lista de construcciones */}
            <div className="xl:col-span-2 space-y-6">
              <Card className="game-panel">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text">🏠 Edificios Activos</CardTitle>
                  <CardDescription>Estructuras construidas y operativas en tu colonia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeConstructions.map((construction) => (
                    <div
                      key={construction.id}
                      className={`tech-node p-6 cursor-pointer transition-all ${
                        selectedBuilding === construction.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedBuilding(construction.id)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-xl mb-2">{construction.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{construction.description}</p>
                          <p className="text-sm text-accent font-medium">{construction.benefits}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="stat-badge mb-2">
                            Nivel {construction.level}/{construction.maxLevel}
                          </Badge>
                          {construction.upgrading && <Badge className="bg-accent block">⚡ Mejorando</Badge>}
                        </div>
                      </div>

                      {construction.upgrading ? (
                        <div className="space-y-3">
                          <div className="progress-bar h-4">
                            <div className="progress-fill w-3/4"></div>
                          </div>
                          <p className="text-sm text-accent font-medium">⏱️ {construction.timeLeft} restantes</p>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            Acelerar con Gemas
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex gap-2 text-sm flex-wrap">
                            <span className="bg-primary/20 px-3 py-1 rounded-full">
                              🍯 {construction.cost.food?.toLocaleString()}
                            </span>
                            <span className="bg-secondary/20 px-3 py-1 rounded-full">
                              🪵 {construction.cost.wood?.toLocaleString()}
                            </span>
                            {construction.cost.leaves && (
                              <span className="bg-accent/20 px-3 py-1 rounded-full">
                                🍃 {construction.cost.leaves.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1 interactive-button" onClick={() => handleUpgrade(construction.id)}>
                              Mejorar a Nivel {construction.level + 1}
                            </Button>
                            <Button variant="outline" size="sm">
                              ℹ️
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">Tiempo de mejora: {construction.upgradeTime}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="game-panel">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text">🔒 Edificios Bloqueados</CardTitle>
                  <CardDescription>
                    Estructuras avanzadas que requieren investigación o construcciones previas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lockedBuildings.map((building) => (
                    <div key={building.id} className="tech-node locked p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-xl mb-2 opacity-70">{building.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{building.description}</p>
                          <p className="text-sm text-accent/70 font-medium mb-2">{building.benefits}</p>
                          <p className="text-xs text-destructive font-medium">📋 Requiere: {building.requirement}</p>
                        </div>
                        <Badge variant="outline" className="opacity-60">
                          Bloqueado
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex gap-2 text-sm flex-wrap opacity-60">
                          <span className="bg-primary/10 px-3 py-1 rounded-full">
                            🍯 {building.cost.food?.toLocaleString()}
                          </span>
                          <span className="bg-secondary/10 px-3 py-1 rounded-full">
                            🪵 {building.cost.wood?.toLocaleString()}
                          </span>
                          <span className="bg-accent/10 px-3 py-1 rounded-full">
                            🍃 {building.cost.leaves?.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground opacity-60">
                          Tiempo de construcción: {building.upgradeTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Panel de información detallada */}
            <div className="space-y-6">
              <Card className="game-panel">
                <CardHeader>
                  <CardTitle className="text-xl">📊 Estadísticas de Construcción</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-primary/20">
                      <div className="text-2xl font-bold text-primary">{activeConstructions.length}</div>
                      <div className="text-sm text-muted-foreground">Activos</div>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/20">
                      <div className="text-2xl font-bold text-accent">{activeConstructions.filter(c => c.upgrading).length}</div>
                      <div className="text-sm text-muted-foreground">Mejorando</div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/20">
                      <div className="text-2xl font-bold text-secondary">{lockedBuildings.length}</div>
                      <div className="text-sm text-muted-foreground">Bloqueados</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/20">
                      <div className="text-2xl font-bold">{activeConstructions.reduce((acc, curr) => acc + curr.level, 0)}</div>
                      <div className="text-sm text-muted-foreground">Nivel Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedBuilding && (
                <Card className="game-panel">
                  <CardHeader>
                    <CardTitle className="text-xl">🔍 Detalles del Edificio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const building = activeConstructions.find((b) => b.id === selectedBuilding)
                      return building ? (
                        <div className="space-y-4">
                          <h3 className="font-bold text-lg gradient-text">{building.name}</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Nivel Actual:</span>
                              <span className="font-bold">{building.level}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Nivel Máximo:</span>
                              <span className="font-bold">{building.maxLevel}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Estado:</span>
                              <span className={`font-bold ${building.upgrading ? "text-accent" : "text-primary"}`}>
                                {building.upgrading ? "Mejorando" : "Operativo"}
                              </span>
                            </div>
                          </div>
                          <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground mb-2">Beneficios del siguiente nivel:</p>
                            <p className="text-sm text-accent">
                              {building.name === "Cámara de Cría" &&
                                `Producción: +${(building.level + 1) * 15}% larvas/hora`}
                              {building.name === "Almacén de Comida" &&
                                `Capacidad: ${(building.level + 1) * 2500} unidades`}
                              {building.name === "Túneles de Defensa" &&
                                `Defensa: +${(building.level + 1) * 10}% resistencia`}
                              {building.name === "Laboratorio" &&
                                `Investigación: +${(building.level + 1) * 10}% velocidad`}
                              {building.name === "Cuartel" && `Entrenamiento: +${(building.level + 1) * 10}% velocidad`}
                            </p>
                          </div>
                        </div>
                      ) : null
                    })()}
                  </CardContent>
                </Card>
              )}

              <Card className="game-panel">
                <CardHeader>
                  <CardTitle className="text-xl">⚡ Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full interactive-button">🔄 Mejorar Todo Disponible</Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    ⏸️ Pausar Construcciones
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    📋 Ver Cola de Construcción
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
