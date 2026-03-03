"use client"
import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Stats } from "@/components/stats"
import { useResources } from "@/lib/useResources"
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input"
import { useSocket } from "@/context/SocketContext"
import { toast } from "@/components/ui/use-toast"
import { mutate } from "swr"
import Image from "next/image"

export default function MisionesPage() {
  const { data: sockedData } = useSocket()
  const { data: initialData } = useResources()
  const [selectedMission, setSelectedMission] = useState<number | null>(null)

  const data = { ...initialData, ...sockedData }

  const [assignments, setAssignments] = useState({
    food: 0,
    wood: 0,
    leaves: 0,
  })

  const misiones = [
    {
      id: 1,
      resource: "food",
      type: 'F',
      name: "Recolección de Néctar",
      icon: "🍯",
      description: "Las obreras recolectan néctar de flores cercanas",
      efficiency: 1,
      workersAssigned: data?.resources?.find((r: any) => r.type === 'FOOD')?.workers || 0,
      production: 0,
      timeRemaining: null,
      difficulty: "Baja",
    },
    {
      id: 2,
      resource: "wood",
      type: 'W',
      name: "Tala de Ramas",
      icon: "🪵",
      description: "Cortar y transportar pequeñas ramas para construcción",
      efficiency: 1,
      workersAssigned: data?.resources?.find((r: any) => r.type === 'WOOD')?.workers || 0,
      production: 0,
      timeRemaining: null,
      difficulty: "Media",
    },
    {
      id: 3,
      resource: "leaves",
      type: 'L',
      name: "Cosecha de Hojas",
      icon: "🍃",
      description: "Recolectar hojas frescas para cultivo de hongos",
      efficiency: 1,
      workersAssigned: data?.resources?.find((r: any) => r.type === 'LEAF')?.workers || 0,
      production: 0,
      timeRemaining: null,
      difficulty: "Baja",
    },
  ]

  const handleAssignWorkers = (resource: string, amount: number) => {
    // Basic validation against total ants
    if (amount >= 0) {
      setAssignments((prev) => ({
        ...prev,
        [resource]: amount,
      }))
    }
  }

  const totalAssignedWorkers = Object.values(assignments).reduce((sum, val) => sum + val, 0);
  const assignableWorkers = (data?.ants ?? 0) - (data?.busy_ants ?? 0);
  const remainingWorkers = assignableWorkers - totalAssignedWorkers;

  const handleSubmit = async (resource: string, amount: number) => {
    try {
      const response = await fetch("/api/misiones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resource: resource, amount: amount }),
      })

      if (!response.ok) throw new Error("Failed to assign mission");

      toast({
        title: "Misión actualizada",
        description: `Se han asignado ${amount} obreras a la tarea.`
      });

      mutate('/api/resources');

       setAssignments((prev) => ({
        ...prev,
        [resource === 'F' ? 'food' : resource === 'W' ? 'wood' : 'leaves']: 0,
      }))

    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo asignar la misión.",
        variant: "destructive"
      });
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-12">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Stats />

          {/* Visual de Misiones (Header) */}
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 border border-border shadow-lg">
            <Image
              src="/ant-workers-carrying-food-teamwork.png"
              alt="Misiones y Expediciones"
              fill
              className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent flex flex-col justify-end p-6 md:p-8">
               <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2">
                 Expediciones
               </h1>
               <p className="text-white/90 text-lg max-w-2xl drop-shadow-sm">
                 Envía a tus obreras a recolectar recursos vitales y explorar el vasto mundo exterior para asegurar la prosperidad de la colonia.
               </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
             <div>
                <h2 className="text-3xl font-bold gradient-text">🗺️ Misiones de Recolección</h2>
                <p className="text-muted-foreground">Gestiona la fuerza laboral de tu colonia</p>
             </div>
             <Link href="/dashboard">
              <Button variant="outline" className="bg-background">
                ← Volver al Centro de Comando
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Lista de Misiones */}
            <div className="xl:col-span-2 space-y-6">
               <Card className="game-panel border-primary/20">
                  <CardHeader>
                     <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                        🌿 Recursos Disponibles
                     </CardTitle>
                     <CardDescription>Zonas de recolección descubiertas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {misiones.map((mision) => (
                        <div
                           key={mision.id}
                           className={`tech-node p-6 transition-all hover:bg-accent/5 ${selectedMission === mision.id ? "ring-2 ring-primary bg-accent/10" : "bg-card/50"}`}
                           onClick={() => setSelectedMission(mision.id)}
                        >
                           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                              <div className="flex items-center gap-4">
                                 <div className="text-4xl bg-background/50 p-2 rounded-lg border border-border">{mision.icon}</div>
                                 <div>
                                    <h4 className="font-bold text-xl">{mision.name}</h4>
                                    <p className="text-sm text-muted-foreground">{mision.description}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Dificultad</div>
                                 <span className={`px-2 py-1 rounded text-xs font-bold ${mision.difficulty === 'Baja' ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600'}`}>
                                    {mision.difficulty}
                                 </span>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
                              <div className="space-y-2">
                                 <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Obreras Asignadas:</span>
                                    <span className="font-bold text-accent">{mision.workersAssigned}</span>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Eficiencia:</span>
                                    <span className="font-medium">{mision.efficiency} / hora</span>
                                 </div>
                                 {mision.workersAssigned > 0 && (
                                    <div className="mt-2">
                                       <div className="flex justify-between text-xs mb-1">
                                          <span>Estado: Recolectando</span>
                                          <span className="animate-pulse text-green-500">● Activo</span>
                                       </div>
                                       <Progress value={100} className="h-1.5" />
                                    </div>
                                 )}
                              </div>

                              <div className="bg-background/40 p-3 rounded-lg border border-border/50 space-y-3">
                                 <label className="text-xs font-bold uppercase text-muted-foreground">Asignar Obreras</label>
                                 <div className="flex gap-2">
                                    <Input
                                       type="number"
                                       min="0"
                                       max={assignableWorkers}
                                       value={assignments[mision.resource as keyof typeof assignments] || ''}
                                       onChange={(e) => {
                                          e.stopPropagation();
                                          handleAssignWorkers(mision.resource, Number.parseInt(e.target.value) || 0)
                                       }}
                                       className="flex-1 h-9 text-sm"
                                       placeholder="Cant."
                                       onClick={(e) => e.stopPropagation()}
                                    />
                                    <Button
                                       size="sm"
                                       className="interactive-button"
                                       disabled={assignments[mision.resource as keyof typeof assignments] === 0 && assignments[mision.resource as keyof typeof assignments] !== undefined}
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          handleSubmit(mision.type, assignments[mision.resource as keyof typeof assignments])
                                       }}
                                    >
                                       Enviar
                                    </Button>
                                 </div>
                                 <div className="text-xs text-right text-muted-foreground">
                                    Est. +{(assignments[mision.resource as keyof typeof assignments] * mision.efficiency).toFixed(1)}/h
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </CardContent>
               </Card>
            </div>

            {/* Panel Lateral de Estado */}
            <div className="space-y-6">
              <Card className="game-panel sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl">📊 Fuerza Laboral</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="text-2xl font-bold text-primary">{remainingWorkers >= 0 ? remainingWorkers : 0}</div>
                      <div className="text-xs text-muted-foreground uppercase">Libres</div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                      <div className="text-2xl font-bold text-secondary">{data?.busy_ants ?? 0}</div>
                      <div className="text-xs text-muted-foreground uppercase">Ocupadas</div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                     <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Resumen de Producción</h4>
                     <div className="space-y-3">
                        {misiones.map(m => (
                           <div key={m.id} className="flex justify-between items-center text-sm">
                              <span className="flex items-center gap-2 text-muted-foreground">
                                 {m.icon} {m.name}
                              </span>
                              <span className="font-mono font-medium text-foreground">
                                 +{(m.workersAssigned * m.efficiency).toFixed(1)}/h
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                     <Button className="w-full" variant="secondary">
                        Gestionar Prioridades
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
