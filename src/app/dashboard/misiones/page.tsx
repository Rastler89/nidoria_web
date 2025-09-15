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
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 xl:grid-cols-3 gap-6">
            <Card className="game-panel tech-node p-6 cursor-pointer transition-all">
              <CardHeader>
                <CardTitle className="text-2xl gradient-text">
                  <h1>
                    <img src="/food_resource.png" width="50" alt="icono" className="inline-block mr-2" />
                    Recolectar comida
                  </h1>
                </CardTitle>
                <CardDescription>
                  
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
              </CardContent>
            </Card>
            <Card className="game-panel tech-node p-6 cursor-pointer transition-all">
              <CardHeader>
                <CardTitle className="text-2xl gradient-text">
                  <h1>
                    <img src="/wood_resource.png" width="50" alt="icono" className="inline-block mr-2" />
                    Recolectar madera
                  </h1>
                </CardTitle>
                <CardDescription>missatges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                contingut
              </CardContent>
            </Card>
            <Card className="game-panel tech-node p-6 cursor-pointer transition-all">
              <CardHeader>
                <CardTitle className="text-2xl gradient-text">Titulo</CardTitle>
                <CardDescription>missatges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                contingut
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
