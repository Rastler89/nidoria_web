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
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
              <User className="h-8 w-8" /> Perfil de Jugador
            </h1>
            <p className="text-xl text-muted-foreground">
              Gestiona tu identidad y tus logros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 game-panel text-center">
               <CardContent className="pt-6">
                  <div className="w-32 h-32 rounded-full bg-secondary/20 mx-auto mb-4 flex items-center justify-center border-4 border-secondary/50">
                     <span className="text-4xl font-bold text-secondary">{username.charAt(0).toUpperCase()}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{username}</h2>
                  <Badge variant="outline" className="mb-4">{selectedTitle}</Badge>

                  <div className="grid grid-cols-2 gap-2 text-sm text-left bg-muted/20 p-4 rounded-lg">
                     <div>
                        <span className="text-muted-foreground block text-xs uppercase">Nivel</span>
                        <span className="font-bold text-lg">12</span>
                     </div>
                     <div>
                        <span className="text-muted-foreground block text-xs uppercase">Puntos</span>
                        <span className="font-bold text-lg">4,520</span>
                     </div>
                     <div>
                        <span className="text-muted-foreground block text-xs uppercase">Alianza</span>
                        <span className="font-bold text-accent">N/A</span>
                     </div>
                     <div>
                        <span className="text-muted-foreground block text-xs uppercase">Ranking</span>
                        <span className="font-bold text-primary">#42</span>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
               <Card className="game-panel">
                  <CardHeader>
                     <CardTitle className="text-xl flex items-center gap-2">
                        <Shield className="h-5 w-5" /> Datos Personales
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Nombre de Usuario</label>
                        <Input
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           placeholder="Tu nombre en el juego"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Correo Electrónico</label>
                        <Input value={user?.email} disabled className="opacity-70" />
                        <p className="text-xs text-muted-foreground">El correo no se puede cambiar.</p>
                     </div>
                     <Button onClick={handleSave} className="w-full sm:w-auto">
                        <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                     </Button>
                  </CardContent>
               </Card>

               <Card className="game-panel">
                  <CardHeader>
                     <CardTitle className="text-xl flex items-center gap-2">
                        <Medal className="h-5 w-5" /> Títulos y Logros
                     </CardTitle>
                     <CardDescription>Selecciona el título que mostrarás a otros jugadores</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="flex flex-wrap gap-2">
                        {availableTitles.map((title) => (
                           <Button
                              key={title.id}
                              variant={selectedTitle === title.name ? "default" : "outline"}
                              className={`rounded-full ${!title.unlocked && "opacity-50 cursor-not-allowed"}`}
                              onClick={() => title.unlocked && setSelectedTitle(title.name)}
                              disabled={!title.unlocked}
                           >
                              {title.name}
                              {!title.unlocked && " 🔒"}
                           </Button>
                        ))}
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
