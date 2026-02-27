"use client"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"
import { useState } from "react"
import { Trophy, Medal, Star, Crown, Sword, Pickaxe, Map, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Player {
  rank: number
  name: string
  points: number
  alliance: string
  title: string
  avatar?: string
  bio?: string
  level: number
}

// Mock data generators
const generateMockData = (type: string): Player[] => {
  const base = [
    { rank: 1, name: "Reina Suprema", points: 15420, alliance: "THE_HIV", title: "Emperador", level: 45, bio: "Gobernante de todas las hormigas." },
    { rank: 2, name: "General Hormiga", points: 12850, alliance: "ANTZ", title: "General", level: 42, bio: "La guerra es la única constante." },
    { rank: 3, name: "Obrera Elite", points: 11200, alliance: "WORK", title: "Constructor", level: 40, bio: "Trabajo duro, vida dura." },
    { rank: 4, name: "Explorador Veloz", points: 9850, alliance: "SPEED", title: "Explorador", level: 38, bio: "Siempre un paso adelante." },
    { rank: 5, name: "Defensor Acero", points: 8700, alliance: "SHIELD", title: "Guardián", level: 36, bio: "Nadie pasará." },
    { rank: 6, name: "Recolector Pro", points: 7650, alliance: "FARM", title: "Novato", level: 34, bio: "Recursos para la colmena." },
    { rank: 7, name: "Guerrero Alfa", points: 6540, alliance: "WAR", title: "Novato", level: 32, bio: "Sangre por sangre." },
    { rank: 8, name: "Arquitecto Real", points: 5430, alliance: "BUILD", title: "Constructor", level: 30, bio: "Diseñando el futuro." },
    { rank: 9, name: "Cazador Furtivo", points: 4320, alliance: "HUNT", title: "Explorador", level: 28, bio: "En las sombras." },
    { rank: 10, name: "Diplomático", points: 3210, alliance: "PEACE", title: "Novato", level: 25, bio: "La pluma es más fuerte." },
  ]

  if (type === "militar") {
    return base.map(p => ({ ...p, points: Math.floor(p.points * 0.8), title: "Guerrero" })).sort((a, b) => b.points - a.points).map((p, i) => ({ ...p, rank: i + 1 }))
  }
  if (type === "economia") {
    return base.map(p => ({ ...p, points: Math.floor(p.points * 1.2), title: "Recolector" })).sort((a, b) => b.points - a.points).map((p, i) => ({ ...p, rank: i + 1 }))
  }
  return base
}

export default function RankingPage() {
  const { user } = useAuth()
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  const RankingList = ({ data }: { data: Player[] }) => (
    <CardContent className="p-0">
      {data.map((player) => (
        <Dialog key={player.rank}>
          <DialogTrigger asChild>
            <div
              className={`grid grid-cols-12 gap-4 items-center p-4 border-b border-border hover:bg-accent/5 transition-colors cursor-pointer ${
                player.name === user?.username ? "bg-primary/10 ring-1 ring-inset ring-primary/20" : ""
              }`}
              onClick={() => setSelectedPlayer(player)}
            >
              <div className="col-span-2 md:col-span-1 text-center font-bold text-lg flex justify-center">
                {player.rank === 1 && <Crown className="h-6 w-6 text-yellow-500" />}
                {player.rank === 2 && <Medal className="h-6 w-6 text-gray-400" />}
                {player.rank === 3 && <Medal className="h-6 w-6 text-amber-700" />}
                {player.rank > 3 && <span className="text-muted-foreground font-mono">#{player.rank}</span>}
              </div>
              <div className="col-span-6 md:col-span-5 font-semibold truncate flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={`/placeholder-user.jpg`} />
                  <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="flex items-center gap-2">
                    {player.name}
                    {player.rank <= 3 && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                  </span>
                  <span className="text-xs text-muted-foreground md:hidden">[{player.alliance}]</span>
                </div>
              </div>
              <div className="col-span-3 md:col-span-2 text-center hidden md:block">
                <Badge variant="outline" className="text-xs bg-muted/20 hover:bg-muted/30">[{player.alliance}]</Badge>
              </div>
              <div className="col-span-2 md:col-span-2 text-center hidden md:block text-sm text-muted-foreground">
                {player.title}
              </div>
              <div className="col-span-4 md:col-span-2 text-right font-mono font-bold text-primary">
                {player.points.toLocaleString()}
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
             <DialogHeader>
                <div className="flex flex-col items-center gap-4 mb-4">
                   <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary/20 shadow-xl">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-2xl">{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                   </Avatar>
                   <div className="text-center">
                      <DialogTitle className="text-2xl font-bold gradient-text">{player.name}</DialogTitle>
                      <DialogDescription className="text-lg flex items-center justify-center gap-2 mt-1">
                         <Badge variant="secondary">[{player.alliance}]</Badge>
                         <span className="text-muted-foreground">•</span>
                         <span>{player.title}</span>
                      </DialogDescription>
                   </div>
                </div>
             </DialogHeader>
             <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-lg border border-border italic text-center text-muted-foreground text-sm">
                   "{player.bio}"
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-primary/5 rounded border border-primary/10 text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Nivel</div>
                      <div className="text-2xl font-bold text-primary">{player.level}</div>
                   </div>
                   <div className="p-3 bg-accent/5 rounded border border-accent/10 text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Ranking</div>
                      <div className="text-2xl font-bold text-accent">#{player.rank}</div>
                   </div>
                </div>

                <div className="flex justify-center gap-3">
                   <Badge variant="outline" className="py-1 px-3 flex gap-2">
                      <Sword className="h-3 w-3" /> Puntos Militares
                   </Badge>
                   <Badge variant="outline" className="py-1 px-3 flex gap-2">
                      <Pickaxe className="h-3 w-3" /> Puntos Económicos
                   </Badge>
                </div>
             </div>
          </DialogContent>
        </Dialog>
      ))}

      {/* Tu posición fija al final */}
      <div className="bg-accent/10 border-t-2 border-accent p-4 grid grid-cols-12 gap-4 items-center mt-auto sticky bottom-0 backdrop-blur-sm">
          <div className="col-span-2 md:col-span-1 text-center font-bold text-muted-foreground">#42</div>
          <div className="col-span-6 md:col-span-5 font-bold text-accent flex items-center gap-3">
             <Avatar className="h-8 w-8 border border-accent/50">
                <AvatarImage src="" />
                <AvatarFallback className="bg-accent text-accent-foreground">TU</AvatarFallback>
             </Avatar>
             {user?.username || "Tú"}
          </div>
          <div className="col-span-3 md:col-span-2 text-center hidden md:block text-muted-foreground">-</div>
          <div className="col-span-3 md:col-span-2 text-center hidden md:block text-sm text-muted-foreground">Novato</div>
          <div className="col-span-4 md:col-span-2 text-right font-mono font-bold text-accent">4,520</div>
      </div>
    </CardContent>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center justify-center gap-3">
              <Trophy className="h-10 w-10 text-yellow-500 drop-shadow-md" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-700">
                Salón de la Fama
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Las colonias más poderosas de Nidoria compiten por la supremacía. ¿Podrás alzar tu imperio sobre las demás?
            </p>
          </div>

          <Tabs defaultValue="global" className="w-full space-y-6">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3 p-1 bg-muted/50 backdrop-blur">
                <TabsTrigger value="global" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                   <Trophy className="h-4 w-4 mr-2" /> Global
                </TabsTrigger>
                <TabsTrigger value="militar" className="data-[state=active]:bg-background data-[state=active]:text-destructive data-[state=active]:shadow-sm">
                   <Sword className="h-4 w-4 mr-2" /> Militar
                </TabsTrigger>
                <TabsTrigger value="economia" className="data-[state=active]:bg-background data-[state=active]:text-green-600 data-[state=active]:shadow-sm">
                   <Pickaxe className="h-4 w-4 mr-2" /> Economía
                </TabsTrigger>
              </TabsList>
            </div>

            <Card className="game-panel overflow-hidden border-t-4 border-t-primary/20">
               <CardHeader className="bg-muted/20 border-b border-border py-3">
                  <div className="grid grid-cols-12 gap-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                     <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                     <div className="col-span-6 md:col-span-5">Jugador</div>
                     <div className="col-span-3 md:col-span-2 text-center hidden md:block">Alianza</div>
                     <div className="col-span-2 md:col-span-2 text-center hidden md:block">Título</div>
                     <div className="col-span-4 md:col-span-2 text-right">Puntos</div>
                  </div>
               </CardHeader>

               <TabsContent value="global" className="m-0 focus-visible:ring-0">
                  <RankingList data={generateMockData("global")} />
               </TabsContent>
               <TabsContent value="militar" className="m-0 focus-visible:ring-0">
                  <RankingList data={generateMockData("militar")} />
               </TabsContent>
               <TabsContent value="economia" className="m-0 focus-visible:ring-0">
                  <RankingList data={generateMockData("economia")} />
               </TabsContent>
            </Card>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
