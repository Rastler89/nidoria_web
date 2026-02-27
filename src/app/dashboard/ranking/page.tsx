"use client"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"
import { useState } from "react"
import { Trophy, Medal, Star, Crown } from "lucide-react"

// Mock data
const mockRanking = [
  { rank: 1, name: "Reina Suprema", points: 15420, alliance: "THE_HIV", title: "Emperador" },
  { rank: 2, name: "General Hormiga", points: 12850, alliance: "ANTZ", title: "General" },
  { rank: 3, name: "Obrera Elite", points: 11200, alliance: "WORK", title: "Constructor" },
  { rank: 4, name: "Explorador Veloz", points: 9850, alliance: "SPEED", title: "Explorador" },
  { rank: 5, name: "Defensor Acero", points: 8700, alliance: "SHIELD", title: "Guardián" },
  { rank: 6, name: "Recolector Pro", points: 7650, alliance: "FARM", title: "Novato" },
  { rank: 7, name: "Guerrero Alfa", points: 6540, alliance: "WAR", title: "Novato" },
  { rank: 8, name: "Arquitecto Real", points: 5430, alliance: "BUILD", title: "Constructor" },
  { rank: 9, name: "Cazador Furtivo", points: 4320, alliance: "HUNT", title: "Explorador" },
  { rank: 10, name: "Diplomático", points: 3210, alliance: "PEACE", title: "Novato" },
]

export default function RankingPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" /> Ranking Global
            </h1>
            <p className="text-xl text-muted-foreground">
              Las colonias más poderosas de Nidoria
            </p>
          </div>

          <Card className="game-panel overflow-hidden">
             <CardHeader className="bg-primary/5 border-b border-primary/10">
                <div className="grid grid-cols-12 gap-4 font-bold text-sm uppercase tracking-wider text-muted-foreground">
                   <div className="col-span-1 text-center">Rank</div>
                   <div className="col-span-5 md:col-span-4">Jugador</div>
                   <div className="col-span-3 md:col-span-3 text-center hidden md:block">Alianza</div>
                   <div className="col-span-3 md:col-span-2 text-center hidden md:block">Título</div>
                   <div className="col-span-6 md:col-span-2 text-right">Puntos</div>
                </div>
             </CardHeader>
             <CardContent className="p-0">
                {mockRanking.map((player) => (
                   <div
                      key={player.rank}
                      className={`grid grid-cols-12 gap-4 items-center p-4 border-b border-border hover:bg-accent/5 transition-colors ${
                         player.name === user?.username ? "bg-primary/10 ring-1 ring-inset ring-primary/20" : ""
                      }`}
                   >
                      <div className="col-span-1 text-center font-bold text-lg flex justify-center">
                         {player.rank === 1 && <Crown className="h-6 w-6 text-yellow-500" />}
                         {player.rank === 2 && <Medal className="h-6 w-6 text-gray-400" />}
                         {player.rank === 3 && <Medal className="h-6 w-6 text-amber-700" />}
                         {player.rank > 3 && <span className="text-muted-foreground">#{player.rank}</span>}
                      </div>
                      <div className="col-span-5 md:col-span-4 font-semibold truncate flex items-center gap-2">
                         {player.name}
                         {player.rank <= 3 && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <div className="col-span-3 md:col-span-3 text-center hidden md:block">
                         <Badge variant="outline" className="text-xs bg-muted/20">[{player.alliance}]</Badge>
                      </div>
                      <div className="col-span-3 md:col-span-2 text-center hidden md:block text-sm text-muted-foreground">
                         {player.title}
                      </div>
                      <div className="col-span-6 md:col-span-2 text-right font-mono font-bold text-primary">
                         {player.points.toLocaleString()}
                      </div>
                   </div>
                ))}

                {/* Tu posición (si no estás en el top 10) */}
                <div className="bg-accent/10 border-t-2 border-accent p-4 grid grid-cols-12 gap-4 items-center">
                   <div className="col-span-1 text-center font-bold text-muted-foreground">#42</div>
                   <div className="col-span-5 md:col-span-4 font-bold text-accent">{user?.username || "Tú"}</div>
                   <div className="col-span-3 md:col-span-3 text-center hidden md:block text-muted-foreground">-</div>
                   <div className="col-span-3 md:col-span-2 text-center hidden md:block text-sm text-muted-foreground">Novato</div>
                   <div className="col-span-6 md:col-span-2 text-right font-mono font-bold text-accent">4,520</div>
                </div>
             </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
