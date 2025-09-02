"use client"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"
import Link from "next/link"
import { useEffect, useState } from "react"
import { get } from "http"

export default function DashboardPage() {
  const { user, token, logout } = useAuth()

  type Resources = {
    eggs: number;
    larva: number;
    ants: number;
    resources: { type: string; stock: number }[];
  };

  const [ resourcesData, setResourcesData ] = useState<Resources | null>(null);

  useEffect(() => {
  if (token) {
    getResources();
  }
}, [token]);
  
  async function getResources() {
    try {
      const res = await fetch("/api/resources", {
        headers: {
          "Authorization": `Bearer ${token ?? ""}`,
        },
      });

      const data = await res.json();

      if (data.statusCode && data.statusCode !== 200) {
        logout();
      }

      setResourcesData(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  }

  const getResourceStock = (type: string) => {
    return resourcesData?.resources?.find(r => r.type === type)?.stock ?? "--";
  }

  console.log('Fetched resources data:', resourcesData);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border border-primary/30 glow-effect">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🥚 Huevos</div>
                <div className="text-2xl font-bold">{resourcesData?.eggs ?? "--"}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🐛 Larvas</div>
                <div className="text-2xl font-bold">{resourcesData?.larva ?? "--"}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🐜 Obreras</div>
                <div className="text-2xl font-bold">{resourcesData?.ants ?? "--"}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🍯 Comida</div>
                <div className="text-2xl font-bold">{getResourceStock('F')}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🪵 Madera</div>
                <div className="text-2xl font-bold">{getResourceStock('W')}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🍃 Hojas</div>
                <div className="text-2xl font-bold">{getResourceStock('L')}</div>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4 flex items-center justify-center gap-2">
              <img src="/panel-ant.png" width="75" alt="icono" />
              Centro de Comando
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Gestiona tu colonia de hormigas desde el corazón del hormiguero
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Link href="/dashboard/construcciones">
              <Card className="game-panel hover:scale-105 transition-transform cursor-pointer h-full">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4"><img src="/construction-ant.png" /></div>
                  <CardTitle className="text-2xl gradient-text">Construcciones</CardTitle>
                  <CardDescription>Mejora y construye nuevas estructuras para fortalecer tu colonia</CardDescription>
                </CardHeader>
                <CardContent>
                  {/*<div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Edificios Activos:</span>
                      <span className="font-bold text-primary">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>En Construcción:</span>
                      <span className="font-bold text-accent">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disponibles:</span>
                      <span className="font-bold text-secondary">3</span>
                    </div>
                  </div>*/}
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/investigaciones">
              <Card className="game-panel hover:scale-105 transition-transform cursor-pointer h-full">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4"><img src="/investigation-ant.png"/></div>
                  <CardTitle className="text-2xl gradient-text">Investigaciones</CardTitle>
                  <CardDescription>Desarrolla tecnologías avanzadas para evolucionar tu especie</CardDescription>
                </CardHeader>
                <CardContent>
                  {/*<div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Completadas:</span>
                      <span className="font-bold text-primary">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>En Progreso:</span>
                      <span className="font-bold text-accent">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disponibles:</span>
                      <span className="font-bold text-secondary">4</span>
                    </div>
                  </div>*/}
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/ejercito">
              <Card className="game-panel hover:scale-105 transition-transform cursor-pointer h-full">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4"><img src="/special-ants.png"/></div>
                  <CardTitle className="text-2xl gradient-text">Ejército</CardTitle>
                  <CardDescription>
                    Entrena y gestiona diferentes tipos de soldados para defender y atacar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/*<div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Soldados Activos:</span>
                      <span className="font-bold text-primary">143</span>
                    </div>
                    <div className="flex justify-between">
                      <span>En Entrenamiento:</span>
                      <span className="font-bold text-accent">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tipos Disponibles:</span>
                      <span className="font-bold text-secondary">3</span>
                    </div>
                  </div>*/}
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/misiones">
              <Card className="game-panel hover:scale-105 transition-transform cursor-pointer h-full">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4"><img src="/exploration-ant.png"/></div>
                  <CardTitle className="text-2xl gradient-text">Misiones</CardTitle>
                  <CardDescription>Envía obreras a explotar recursos y explorar nuevos territorios</CardDescription>
                </CardHeader>
                <CardContent>
                  {/*<div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Misiones Activas:</span>
                      <span className="font-bold text-primary">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Obreras Trabajando:</span>
                      <span className="font-bold text-accent">77</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zonas Disponibles:</span>
                      <span className="font-bold text-secondary">5</span>
                    </div>
                  </div>*/}
                </CardContent>
              </Card>
            </Link>
          </div>

          {/*<div className="mt-8">
            <Card className="game-panel">
              <CardHeader>
                <CardTitle className="text-2xl gradient-text flex items-center gap-3">
                  🗺️ Vista Rápida del Territorio
                </CardTitle>
                <CardDescription>Acceso rápido al mapa estratégico y operaciones exteriores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg bg-primary/20">
                    <div className="text-2xl font-bold text-primary">5</div>
                    <div className="text-sm text-muted-foreground">Colonias Detectadas</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent/20">
                    <div className="text-2xl font-bold text-accent">3</div>
                    <div className="text-sm text-muted-foreground">Zonas de Recursos</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-secondary/20">
                    <div className="text-2xl font-bold text-secondary">0</div>
                    <div className="text-sm text-muted-foreground">Ataques Programados</div>
                  </div>
                </div>
                <Link href="/dashboard/mapa">
                  <Button className="w-full interactive-button text-lg py-4">🌍 Abrir Mapa Estratégico Completo</Button>
                </Link>
              </CardContent>
            </Card>
          </div>*/} 
        </main>
      </div>
    </ProtectedRoute>
  )
}
