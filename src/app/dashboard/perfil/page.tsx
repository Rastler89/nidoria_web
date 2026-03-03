"use client"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"
import { useState } from "react"
import { User, Shield, Medal, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function PerfilPage() {
  const { user } = useAuth()
  const [username, setUsername] = useState(user?.username || "")
  const [selectedTitle, setSelectedTitle] = useState("Novato")

  const availableTitles = [
    { id: 1, name: "Novato", unlocked: true },
    { id: 2, name: "Explorador", unlocked: true },
    { id: 3, name: "Constructor", unlocked: true },
    { id: 4, name: "General", unlocked: false },
    { id: 5, name: "Emperador", unlocked: false },
  ]

  const handleSave = () => {
    // Aquí iría la lógica para guardar en el backend
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios se han guardado correctamente.",
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center justify-center gap-3">
              <User className="h-10 w-10 text-primary" /> Perfil de Jugador
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gestiona tu identidad, muestra tus logros y personaliza tu presencia en el imperio.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tarjeta de Resumen */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="game-panel text-center overflow-hidden border-primary/20">
                <div className="bg-gradient-to-b from-primary/10 to-transparent p-6 pb-0">
                   <div className="relative inline-block">
                      <div className="w-32 h-32 rounded-full bg-background border-4 border-primary shadow-xl mx-auto mb-4 flex items-center justify-center overflow-hidden">
                         <span className="text-5xl font-bold text-primary">{username.charAt(0).toUpperCase()}</span>
                      </div>
                      <Badge className="absolute bottom-2 right-0 bg-primary text-primary-foreground border-2 border-background px-2 py-1">
                         Lvl 12
                      </Badge>
                   </div>
                   <h2 className="text-3xl font-bold mb-1">{username}</h2>
                   <Badge variant="outline" className="mb-6 bg-background/50 backdrop-blur">{selectedTitle}</Badge>
                </div>

                <CardContent className="pt-2">
                   <div className="grid grid-cols-2 gap-4 text-left">
                      <div className="p-3 bg-muted/30 rounded-lg border border-border text-center">
                         <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Puntos</span>
                         <span className="font-bold text-xl text-primary">4,520</span>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg border border-border text-center">
                         <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Ranking</span>
                         <span className="font-bold text-xl text-accent">#42</span>
                      </div>
                   </div>
                   <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex justify-between items-center text-sm py-2">
                         <span className="text-muted-foreground">Alianza</span>
                         <span className="font-medium">--</span>
                      </div>
                      <div className="flex justify-between items-center text-sm py-2">
                         <span className="text-muted-foreground">Registro</span>
                         <span className="font-medium">Hace 2 meses</span>
                      </div>
                   </div>
                </CardContent>
              </Card>
            </div>

            {/* Configuración y Títulos */}
            <div className="lg:col-span-2 space-y-6">
               <Card className="game-panel">
                  <CardHeader>
                     <CardTitle className="text-xl flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" /> Información de la Cuenta
                     </CardTitle>
                     <CardDescription>Actualiza tus datos públicos y privados</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Nombre de Usuario</label>
                           <Input
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="Tu nombre en el juego"
                              className="bg-background/50"
                           />
                           <p className="text-xs text-muted-foreground">Visible para otros jugadores.</p>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Correo Electrónico</label>
                           <Input value={user?.email} disabled className="opacity-70 bg-muted/20" />
                           <p className="text-xs text-muted-foreground">Contacta a soporte para cambiarlo.</p>
                        </div>
                     </div>

                     <div className="pt-4 flex justify-end">
                        <Button onClick={handleSave} className="w-full sm:w-auto gap-2">
                           <Save className="h-4 w-4" /> Guardar Cambios
                        </Button>
                     </div>
                  </CardContent>
               </Card>

               <Card className="game-panel">
                  <CardHeader>
                     <CardTitle className="text-xl flex items-center gap-2">
                        <Medal className="h-5 w-5 text-accent" /> Títulos y Logros
                     </CardTitle>
                     <CardDescription>Selecciona el título que te representará en el ranking</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="flex flex-wrap gap-3">
                        {availableTitles.map((title) => (
                           <button
                              key={title.id}
                              className={`
                                relative group px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium
                                ${selectedTitle === title.name
                                   ? "bg-primary/10 border-primary text-primary ring-2 ring-primary/20"
                                   : title.unlocked
                                      ? "bg-card hover:bg-accent/5 border-border hover:border-accent text-muted-foreground hover:text-foreground"
                                      : "bg-muted/20 border-border/50 text-muted-foreground/50 cursor-not-allowed grayscale"}
                              `}
                              onClick={() => title.unlocked && setSelectedTitle(title.name)}
                              disabled={!title.unlocked}
                           >
                              {title.name}
                              {selectedTitle === title.name && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span></span>}
                              {!title.unlocked && <span className="ml-2 opacity-70">🔒</span>}
                           </button>
                        ))}
                     </div>

                     <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/10">
                        <h4 className="text-sm font-bold text-accent mb-2">Progreso del Siguiente Título</h4>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                           <span>General (Lvl 20)</span>
                           <span>60%</span>
                        </div>
                        <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                           <div className="h-full bg-accent w-[60%]"></div>
                        </div>
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
