"use client"
import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Stats } from "@/components/stats"

export default function MisionesPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)

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

          <div className="grid grid-cols-4 xl:grid-cols-4 gap-6">
              <Card className="game-panel">
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
