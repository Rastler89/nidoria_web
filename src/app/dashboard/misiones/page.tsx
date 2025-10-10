"use client"
import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Stats } from "@/components/stats"
import { useResources } from "@/lib/useResources"

export default function MisionesPage() {
  const { data, error, isLoading } = useResources();

  const [assignments, setAssignments] = useState({
    food: 0,
    wood: 0,
    leaves: 0,
  })

  const misiones = [
    {
        id: 1,
        resource: "food",
        name: "Recolección de Néctar",
        icon: "🍯",
        description: "Las obreras recolectan néctar de flores cercanas",
        efficiency: 2.5,
        workersAssigned: 77,
        production: 192,
        timeRemaining: "2h 15m",
      },
      {
        id: 2,
        resource: "wood",
        name: "Tala de Ramas",
        icon: "🪵",
        description: "Cortar y transportar pequeñas ramas para construcción",
        efficiency: 1.8,
        workersAssigned: 0,
        production: 0,
        timeRemaining: null,
      },
      {
        id: 3,
        resource: "leaves",
        name: "Cosecha de Hojas",
        icon: "🍃",
        description: "Recolectar hojas frescas para cultivo de hongos",
        efficiency: 3.2,
        workersAssigned: 0,
        production: 0,
        timeRemaining: null,
      },
  ]

  const totalAssignedWorkers = Object.values(assignments).reduce((sum,val) => sum + val, 0);
  const remainingWorkers = (data?.ants ?? 0) - totalAssignedWorkers - (data?.busy_ants ?? 0);

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
            <h1 className="text-4xl font-bold gradient-text mb-4 flex items-center justify-right gap-2">
              <img src="/exploration-ant.png" width="75" alt="icono" />
              Misiones
            </h1>
            <p className="text-xl text-muted-foreground">
              Mejora y construye nuevas estructuras para fortalecer tu colonia
            </p>
          </div>

          <Card className="game-panel mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">🐜 Obreras disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/20">
                  <div className="text-3xl font-bold text-primary">{remainingWorkers}</div>
                  <div className="text-sm text-muted-foreground">Obreras libres</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/20">
                  <div className="text-3xl font-bold text-accent">{totalAssignedWorkers}</div>
                  <div className="text-sm text-muted-foreground">Por asignar</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/20">
                  <div className="text-3xl font-bold text-secondary">
                    {data?.busy_ants ?? 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Trabajando</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {misiones.map((mision) => (
              <Card key={mision.id} className="game-panel">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4">{mision.icon}</div>
                  <CardTitle className="text-xl gradient-text">{mision.name}</CardTitle>
                  <CardDescription>{mision.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Eficiencia: </span>
                      <span className="font-bold text-primary">{mision.efficiency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Obreras Asignadas:</span>
                      <span className="font-bold text-accent">{mision.workersAssigned}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Producción/hora: </span>
                      <span className="font-bold text-secondary">{mision.production}</span>
                    </div>
                    {mision.timeRemaining && (
                      <div className="flex justify-between text-sm">
                        <span>Tiempo restante:</span>
                        <span className="font-bold text-primary">{mision.timeRemaining}</span>
                      </div>
                    )}
                  </div>
                  {mision.workersAssigned > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>75%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
