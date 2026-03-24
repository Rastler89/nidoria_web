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
import { Progress } from "@/components/ui/progress";


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

const formatTime = (seconds: number) => {
  if (!seconds) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);

  return parts.join(" ");
};

const coste_mejora = (c: any) => {

  if (c.update[0].construction.maxLevel === c.level) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Coste de Mejora</p>
        <div className="flex gap-2 text-sm flex-wrap">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            MAX
          </span>
        </div>
      </div>
    )
  }

  if (c.update[0].construction.upgrading) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progreso</span>
          <span>{c.update[0].construction.timeLeft}</span>
        </div>
        <div className="progress-bar h-2">
          <div className="progress-fill w-3/4 animate-pulse"></div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Coste de Mejora</p>
        <div className="flex gap-2 text-sm flex-wrap">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            🍯 {c.update[0].cost.FOOD?.toLocaleString()}
          </span>
          <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium">
            🪵 {c.update[0].cost.WOOD?.toLocaleString()}
          </span>
          <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded text-xs font-medium">
            🍃 {c.update[0].cost.LEAD.toLocaleString()}
          </span>
          <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium">
            🐜  {c.update[0].cost.ANTS.toLocaleString()}
          </span>
        </div>
      </div>
    )
  }
}

export default function ConstruccionesPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)
  const { data: socketData } = useSocket()
  const { data: constructionsData, mutate } = useSWR('/api/constructions', fetcher)

  let disabledConstructions = [];
  let activeConstructions = [];

  if (constructionsData != undefined && constructionsData.error == undefined) {
    disabledConstructions = constructionsData.filter((c: any) => c.requirementsMet == false);
    activeConstructions = constructionsData.filter((c: any) => c.requirementsMet == true && c.type == "NEW");
    if (socketData != undefined) {
      socketData.buildings.map((b: any) => {
        b.update = constructionsData.filter((c: any) => c.instanceId == b.id);
      });
    }
  }
  console.log('api', constructionsData);
  console.log('socket', socketData);

  const handleStart = async (id: number) => {
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
        title: "Construcción iniciada",
        description: "La construcción se está mejorando.",
      });

      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar la mejora.",
        variant: "destructive"
      })
    }
  }

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
  console.log(selectedBuilding)
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
              <h2 className="text-3xl font-bold gradient-text">🧱 Construcciones</h2>
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
                    🏠 Edificios Construidos
                  </CardTitle>
                  <CardDescription>Estructuras construidas y operativas en tu colonia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(socketData != undefined) && socketData.buildings.map((c: any) => (
                    < div
                      key={`owned-${c.id}`}
                      className={`tech-node p-6 cursor-pointer transition-all hover:bg-accent/5 ${selectedBuilding === `owned-${c.id}` ? "ring-2 ring-primary bg-accent/10" : "bg-card/50"
                        }`}
                      onClick={() => setSelectedBuilding(`owned-${c.id}`)}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-xl">{c.name}</h4>
                            {c.status === 'COMPLETED' && (
                              <Badge variant="secondary" className="text-xs">
                                Nivel {c.update[0]?.construction.maxLevel === c.level ? 'Max' : c.level}
                              </Badge>
                            )}
                          </div>
                          {c.status === 'COMPLETED' && (
                            <p className="text-sm text-muted-foreground">{c.update[0].construction.description}</p>
                          )}
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          {c.status === 'BUILDING' && <Badge className="bg-yellow-500/80 text-white animate-pulse">⚡ En construcción</Badge>}
                        </div>
                      </div>

                      {c.status === 'BUILDING' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
                          <div className="md:col-span-2 flex justify-end">
                            <div className="flex flex-col gap-2 items-end">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Finaliza el</p>
                              <Badge variant="outline" className="bg-background py-1.5 px-3 border-primary/20 flex items-center gap-2">
                                <span className="text-muted-foreground">⏳</span>
                                <span className="font-semibold text-primary">
                                  {c.finishingAt ? new Date(c.finishingAt).toLocaleString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'Calculando...'}
                                </span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                      {c.status == 'COMPLETED' && (
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Beneficio Actual</p>
                              <p className="text-sm text-primary font-medium">{c.update[0].construction.benefits}</p>
                            </div>
                            {coste_mejora(c)}
                          </div>
                          {(c.type != "NEW" && c.update[0].construction.maxLevel > c.level) && (
                            <div className="mt-4 flex justify-end">
                              <Button
                                size="sm"
                                className="interactive-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpgrade(c.update[0].construction.id);
                                }}
                              >
                                Mejorar ({formatTime(c.update[0].cost.time)})
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="game-panel border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                    🏗️ Por Construir
                  </CardTitle>
                  <CardDescription>Estructuras construidas y operativas en tu colonia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeConstructions.map((c: any) => (
                    < div
                      key={`new-${c.construction.id}`}
                      className={`tech-node p-6 cursor-pointer transition-all hover:bg-accent/5 ${selectedBuilding === `new-${c.construction.id}` ? "ring-2 ring-primary bg-accent/10" : "bg-card/50"
                        }`}
                      onClick={() => setSelectedBuilding(`new-${c.construction.id}`)}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-xl">{c.construction.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              Nivel {c.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{c.construction.description}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          {c.construction.upgrading && <Badge className="bg-yellow-500/80 text-white animate-pulse">⚡ En construcción</Badge>}
                        </div>
                      </div>

                      {/* Detalles desplegados o siempre visibles de forma resumida */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Beneficio Actual</p>
                          <p className="text-sm text-primary font-medium">{c.construction.effects.description}</p>
                        </div>

                        {c.construction.upgrading ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Progreso</span>
                              <span>{c.construction.timeLeft}</span>
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
                                🍯 {c.cost.FOOD?.toLocaleString()}
                              </span>
                              <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium">
                                🪵 {c.cost.WOOD?.toLocaleString()}
                              </span>
                              <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded text-xs font-medium">
                                🍃 {c.cost.LEAD.toLocaleString()}
                              </span>
                              <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium">
                                🐜  {c.cost.ANTS.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {c.type == "NEW" && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            size="sm"
                            className="interactive-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStart(c.construction.id);
                            }}
                          >
                            Construir ({formatTime(c.cost.time)})
                          </Button>
                        </div>
                      )}

                      {c.type != "NEW" && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            size="sm"
                            className="interactive-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpgrade(c.construction.id);
                            }}
                          >
                            Mejorar ({formatTime(c.cost.time)})
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
                  {disabledConstructions.map((building: any) => (
                    <div key={`locked-${building.construction.id}`} className="tech-node locked p-6 bg-muted/20 border-dashed border-2 border-muted">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xl text-muted-foreground">{building.construction.name}</h4>
                            <Badge variant="outline" className="text-xs">Bloqueado</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{building.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                        <p className="text-xs text-destructive font-bold flex items-center gap-2">
                          🚫 Requiere:
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          {building.requirements.map((req: any) => (
                            <li key={req.id}>
                              <span className="font-semibold">{req.requiredName}</span> - Nivel: {req.requiredLevel}
                            </li>
                          ))}
                        </ul>
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
                      <div className="text-3xl font-bold text-primary">{socketData?.buildings?.filter((c: any) => c.status === 'COMPLETED')?.length || 0}</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Edificios</div>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                      <div className="text-3xl font-bold text-accent">{socketData?.buildings.filter((c: any) => c.status === 'BUILDING')?.length || 0}</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Obras</div>
                    </div>
                  </div>

                  {selectedBuilding && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                      {(() => {
                        const building = activeConstructions.find((b: any) => b.id === selectedBuilding);
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
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  <div className="space-y-3 pt-4 border-t border-border">
                    <Button className="w-full" variant="secondary">
                      Ver Árbol Tecnológico (Próximamente)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div >
    </ProtectedRoute >
  )
}
