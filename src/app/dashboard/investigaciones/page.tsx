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

const coste_investigacion = (t: any) => {
  if (!t.update || t.update.length === 0) return null;
  const upd = t.update[0];

  if (upd.investigation.maxLevel === t.level) {
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

  if (t.status === 'INVESTIGATING') {
    return null;
  } else {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Coste de Mejora</p>
        <div className="flex gap-2 text-sm flex-wrap">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            🍯 {upd.cost.FOOD?.toLocaleString()}
          </span>
          <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium">
            🪵 {upd.cost.WOOD?.toLocaleString()}
          </span>
          <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded text-xs font-medium">
            🍃 {upd.cost.LEAD?.toLocaleString()}
          </span>
          <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium">
            🐜 {upd.cost.ANTS?.toLocaleString()}
          </span>
        </div>
      </div>
    )
  }
}

export default function InvestigacionesPage() {
  const [selectedResearch, setSelectedResearch] = useState<string | null>(null)
  const { data: socketData } = useSocket()
  const { data: serverData, mutate } = useSWR('/api/investigations', fetcher)

  let lockedResearch = [];
  let activeResearch = [];

  if (serverData != undefined && serverData.error == undefined) {
    lockedResearch = serverData.filter((i: any) => i.requirementsMet == false);
    activeResearch = serverData.filter((i: any) => i.requirementsMet == true && i.type == "NEW");
    if (socketData != undefined) {
      socketData.techs.forEach((t: any) => {
        t.update = serverData.filter((s: any) => s.instanceId == t.id);
      });
    }
  }

  const categories = ["Todas", "Economía", "Militar", "Infraestructura", "Social"]
  const [selectedCategory, setSelectedCategory] = useState("Todas")

  const handleResearch = async (id: number, instanceId?: number) => {
    try {
      const res = await fetch('/api/investigations', {
        method: 'POST',
        body: JSON.stringify({ investigationId: id, instance: instanceId }),
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
          <Stats />

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
                Desarrolla nuevas tecnologías para adaptar tu especie. Descubre mejoras genéticas y avances estratégicos.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-bold gradient-text">🔬 Investigaciones</h2>
              <p className="text-muted-foreground">Árbol tecnológico y evolutivo</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {/*{categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}*/}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <Card className="game-panel border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                    🧪 Tecnologías Desarrolladas
                  </CardTitle>
                  <CardDescription>Mejoras activas y en proceso de evolución</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {socketData?.techs.map((t: any) => (
                    <div
                      key={`owned-${t.id}`}
                      className={`tech-node p-6 cursor-pointer transition-all hover:bg-accent/5 ${selectedResearch === `owned-${t.id}` ? "ring-2 ring-primary bg-accent/10" : "bg-card/50"
                        }`}
                      onClick={() => setSelectedResearch(`owned-${t.id}`)}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-xl">{t.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              Nivel {t.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {t.status === 'COMPLETED' ? "Tecnología operativa y proporcionando beneficios." : "Evolución genética en curso..."}
                          </p>
                        </div>
                        <div className="text-right">
                          {t.status === 'INVESTIGATING' && (
                            <Badge className="bg-yellow-500/80 text-white animate-pulse">⚡ Investigando</Badge>
                          )}
                        </div>
                      </div>

                      {t.status === 'INVESTIGATING' && (
                        <div className="space-y-3 mt-4 pt-4 border-t border-border/50">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progreso de evolución</span>
                            <span>{t.finishingAt ? new Date(t.finishingAt).toLocaleString() : "Cargando..."}</span>
                          </div>
                          <div className="progress-bar h-2">
                            <div className="progress-fill w-3/4 animate-pulse bg-accent"></div>
                          </div>
                        </div>
                      )}

                      {t.status === 'COMPLETED' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Efecto Actual</p>
                            <p className="text-sm text-primary font-medium">Bonificación de nivel {t.level} activa.</p>
                          </div>
                          {coste_investigacion(t)}
                        </div>
                      )}

                      {t.status === 'COMPLETED' && t.update && t.update.length > 0 && t.update[0].investigation.maxLevel > t.level && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            size="sm"
                            className="interactive-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResearch(t.update[0].investigation.id, t.id);
                            }}
                          >
                            Mejorar ({formatTime(t.update[0].cost.time)})
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {socketData?.techs.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground italic">
                      Aún no has desarrollado ninguna tecnología.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="game-panel border-accent/20">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                    🏗️ Nuevos Descubrimientos
                  </CardTitle>
                  <CardDescription>Tecnologías disponibles para comenzar su desarrollo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeResearch.map((r: any) => (
                    <div
                      key={`new-${r.investigation.id}`}
                      className={`tech-node p-6 cursor-pointer transition-all hover:bg-accent/5 ${selectedResearch === `new-${r.investigation.id}` ? "ring-2 ring-primary bg-accent/10" : "bg-card/50"
                        }`}
                      onClick={() => setSelectedResearch(`new-${r.investigation.id}`)}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-xl">{r.investigation.name}</h4>
                            <Badge variant="outline" className="text-xs">Disponible</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{r.investigation.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Beneficio esperado</p>
                          <p className="text-sm text-primary font-medium">Nuevas capacidades para la colonia.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Coste de Inicio</p>
                          <div className="flex gap-2 text-sm flex-wrap">
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                              🍯 {r.cost.FOOD?.toLocaleString()}
                            </span>
                            <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium">
                              🪵 {r.cost.WOOD?.toLocaleString()}
                            </span>
                            <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded text-xs font-medium">
                              🍃 {r.cost.LEAD?.toLocaleString()}
                            </span>
                            <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium">
                              🐜 {r.cost.ANTS?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button
                          size="sm"
                          className="interactive-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResearch(r.investigation.id);
                          }}
                        >
                          Investigar ({formatTime(r.cost.time)})
                        </Button>
                      </div>
                    </div>
                  ))}
                  {activeResearch.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground italic">
                      No hay nuevas investigaciones disponibles en este momento.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="game-panel opacity-90">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                    🔒 Proyectos Futuros
                  </CardTitle>
                  <CardDescription>Requieren otras investigaciones o edificios primero</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lockedResearch.map((r: any) => (
                    <div key={`locked-${r.investigation.id}`} className="tech-node locked p-6 bg-muted/20 border-dashed border-2 border-muted">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xl text-muted-foreground">{r.investigation.name}</h4>
                            <Badge variant="outline" className="text-xs">Bloqueado</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                        <p className="text-xs text-destructive font-bold flex items-center gap-2 mb-2">
                          🚫 Requiere:
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                          {r.requirements.map((req: any) => (
                            <li key={req.id}>
                              <span className="font-semibold">{req.requiredName}</span> - Nivel {req.requiredLevel}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="game-panel sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl">📊 Resumen Evolutivo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                      <div className="text-3xl font-bold text-primary">{socketData?.techs.filter((t: any) => t.status === 'COMPLETED').length || 0}</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Completas</div>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                      <div className="text-3xl font-bold text-accent">{socketData?.techs.filter((t: any) => t.status === 'INVESTIGATING').length || 0}</div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">En Curso</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <Button className="w-full" variant="secondary" disabled>
                      Ver Árbol Tecnológico (Próximamente)
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
