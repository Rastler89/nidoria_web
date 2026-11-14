"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR, { mutate } from "swr"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import {
   Bug,
   Clock,
   Coins,
   MapPin,
   Shield,
   Skull,
   Swords,
   Trophy,
} from "lucide-react"

interface ArmyUnit {
   antId: number
   code: string
   name: string
   type: string
   total: number
   busy: number
   available: number
   attack: number
   defense: number
   speed: number
   hp: number
}

interface Spawn {
   id: number
   monster: { code: string; name: string; description: string | null; tier: number }
   level: number
   hpRemaining: number
   hpMax: number
   attack: number
   defense: number
   speed: number
   loot: Record<string, number>
   position: { x: number; y: number }
   distance: number
   travelSeconds: number
   spawnedAt: string
   expiresAt: string
}

interface SpawnResponse {
   army: ArmyUnit[]
   spawns: Spawn[]
}

interface Battle {
   id: number
   result: "WIN" | "LOSS" | "DRAW" | null
   pending: boolean
   travelSeconds: number
   startedAt: string
   resolvedAt: string | null
   arrivesAt: string
   monster: { code: string; name: string; level: number } | null
   loot: Record<string, number>
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const RESOURCE_LABELS: Record<string, string> = {
   FOOD: "Comida",
   WOOD: "Madera",
   LEAD: "Plomo",
}

const TIER_LABELS: Record<number, string> = {
   1: "Menor",
   2: "Peligroso",
   3: "Épico",
}

function formatDuration(totalSeconds: number): string {
   const seconds = Math.max(0, Math.round(totalSeconds))
   if (seconds < 60) return `${seconds} s`
   const minutes = Math.floor(seconds / 60)
   const rest = seconds % 60
   return rest > 0 ? `${minutes} min ${rest} s` : `${minutes} min`
}

function formatLoot(loot: Record<string, number> | null | undefined) {
   if (!loot) return []
   return Object.entries(loot)
      .filter(([, amount]) => Number(amount) > 0)
      .map(([type, amount]) => `${Number(amount).toLocaleString("es-ES")} ${RESOURCE_LABELS[type] ?? type}`)
}

function resultBadge(result: Battle["result"]) {
   switch (result) {
      case "WIN":
         return <Badge className="bg-emerald-600 text-white">Victoria</Badge>
      case "LOSS":
         return <Badge variant="destructive">Derrota</Badge>
      case "DRAW":
         return <Badge variant="secondary">Empate</Badge>
      default:
         return <Badge variant="outline">En curso</Badge>
   }
}

export default function CazaPage() {
   const { data: spawnData, error: spawnError } = useSWR<SpawnResponse>("/api/pve/spawns", fetcher)
   const { data: battles } = useSWR<Battle[]>("/api/pve/battles", fetcher, {
      refreshInterval: (latest) => (latest?.some((battle) => battle.pending) ? 5000 : 0),
   })

   const [selectedId, setSelectedId] = useState<number | null>(null)
   const [quantities, setQuantities] = useState<Record<number, number>>({})
   const [sending, setSending] = useState(false)
   const [now, setNow] = useState(() => Date.now())

   useEffect(() => {
      const timer = setInterval(() => setNow(Date.now()), 1000)
      return () => clearInterval(timer)
   }, [])

   const army = spawnData?.army ?? []
   const spawns = spawnData?.spawns ?? []
   const selected = useMemo(
      () => spawns.find((spawn) => spawn.id === selectedId) ?? null,
      [spawns, selectedId],
   )

   const totalSelected = Object.values(quantities).reduce(
      (total, value) => total + (Number(value) || 0),
      0,
   )

   const setQuantity = (antId: number, available: number, raw: string) => {
      const parsed = Number.parseInt(raw, 10)
      const value = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), available) : 0
      setQuantities((prev) => ({ ...prev, [antId]: value }))
   }

   const handleAttack = async () => {
      if (!selected || totalSelected <= 0) return

      const units = Object.entries(quantities)
         .map(([antId, quantity]) => ({ antId: Number(antId), quantity: Number(quantity) }))
         .filter((unit) => unit.quantity > 0)

      setSending(true)

      try {
         const res = await fetch("/api/pve/attack", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ spawnId: selected.id, units }),
         })

         const payload = await res.json()

         if (!res.ok) {
            throw new Error(payload?.message ?? "No se pudo enviar el ataque")
         }

         toast({
            title: "Expedición enviada",
            description: `Tus hormigas llegarán en ${formatDuration(payload.travelSeconds)}.`,
         })

         setQuantities({})
         setSelectedId(null)
         mutate("/api/pve/spawns")
         mutate("/api/pve/battles")
      } catch (error: any) {
         toast({
            title: "Error",
            description: error?.message ?? "No se pudo enviar el ataque.",
            variant: "destructive",
         })
      } finally {
         setSending(false)
      }
   }

   return (
      <ProtectedRoute>
         <div className="min-h-screen bg-background pb-12">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
               <div className="relative w-full rounded-2xl overflow-hidden mb-8 border border-border shadow-lg bg-gradient-to-br from-emerald-900 via-background to-background p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-3">
                     <Swords className="h-10 w-10 text-emerald-400" />
                     <h1 className="text-4xl md:text-5xl font-bold text-foreground">Caza</h1>
                  </div>
                  <p className="text-muted-foreground text-lg max-w-2xl">
                     Las amenazas aparecen de forma aleatoria en el mapa. Elige tus unidades y
                     envía una expedición: el combate se resuelve al terminar el viaje y recibirás
                     un reporte con el resultado y el botín.
                  </p>
               </div>

               {spawnError && (
                  <Card className="game-panel border-destructive/40 mb-6">
                     <CardContent className="p-6 text-destructive">
                        No se pudieron cargar las apariciones. Vuelve a intentarlo en unos segundos.
                     </CardContent>
                  </Card>
               )}

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Lista de presas */}
                  <div className="lg:col-span-2 space-y-4">
                     <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold gradient-text">Presas disponibles</h2>
                        <span className="text-sm text-muted-foreground">
                           {spawns.length} {spawns.length === 1 ? "aparición" : "apariciones"}
                        </span>
                     </div>

                     {spawns.length === 0 && (
                        <Card className="game-panel">
                           <CardContent className="p-8 text-center text-muted-foreground">
                              <Bug className="h-12 w-12 mx-auto mb-3 opacity-30" />
                              No hay monstruos activos ahora mismo. Vuelve en unos minutos.
                           </CardContent>
                        </Card>
                     )}

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {spawns.map((spawn) => {
                           const hpPercent = spawn.hpMax > 0 ? (spawn.hpRemaining / spawn.hpMax) * 100 : 0
                           const isSelected = spawn.id === selectedId

                           return (
                              <Card
                                 key={spawn.id}
                                 className={`game-panel cursor-pointer transition-all hover:bg-accent/5 ${isSelected ? "border-emerald-500/60 ring-1 ring-emerald-500/30" : ""}`}
                                 onClick={() => {
                                    setSelectedId(isSelected ? null : spawn.id)
                                    setQuantities({})
                                 }}
                              >
                                 <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-2">
                                       <div>
                                          <CardTitle className="text-lg flex items-center gap-2">
                                             <Bug className="h-4 w-4 text-emerald-400" />
                                             {spawn.monster.name}
                                          </CardTitle>
                                          <CardDescription className="mt-1">
                                             Nivel {spawn.level} · {TIER_LABELS[spawn.monster.tier] ?? "Desconocido"}
                                          </CardDescription>
                                       </div>
                                       <Badge variant="outline">x{spawn.level}</Badge>
                                    </div>
                                 </CardHeader>
                                 <CardContent className="space-y-3">
                                    <div>
                                       <div className="flex justify-between text-xs mb-1">
                                          <span className="text-muted-foreground">Vida</span>
                                          <span>
                                             {spawn.hpRemaining.toLocaleString("es-ES")} /{" "}
                                             {spawn.hpMax.toLocaleString("es-ES")}
                                          </span>
                                       </div>
                                       <Progress value={hpPercent} className="h-2" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                       <span className="flex items-center gap-1">
                                          <Swords className="h-3 w-3" /> {spawn.attack} ataque
                                       </span>
                                       <span className="flex items-center gap-1">
                                          <Shield className="h-3 w-3" /> {spawn.defense} defensa
                                       </span>
                                       <span className="flex items-center gap-1">
                                          <MapPin className="h-3 w-3" /> {spawn.distance} casillas
                                       </span>
                                       <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" /> {formatDuration(spawn.travelSeconds)}
                                       </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1 text-xs text-amber-500">
                                       <Coins className="h-3 w-3" />
                                       {formatLoot(spawn.loot).join(" · ") || "Sin botín"}
                                    </div>
                                 </CardContent>
                              </Card>
                           )
                        })}
                     </div>
                  </div>

                  {/* Panel de ataque */}
                  <div className="space-y-4">
                     <Card className="game-panel border-emerald-500/20">
                        <CardHeader>
                           <CardTitle className="text-xl">Enviar expedición</CardTitle>
                           <CardDescription>
                              {selected
                                 ? `Atacar a ${selected.monster.name} (nivel ${selected.level})`
                                 : "Selecciona una presa para atacar"}
                           </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           {!selected && (
                              <p className="text-sm text-muted-foreground">
                                 Las unidades se reservan durante el viaje y solo vuelven si
                                 sobreviven al combate.
                              </p>
                           )}

                           {selected && army.length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                 No tienes unidades disponibles. Recluta hormigas en la sección
                                 Unidades.
                              </p>
                           )}

                           {selected &&
                              army.map((unit) => (
                                 <div key={unit.antId} className="flex items-center gap-2">
                                    <div className="flex-1 min-w-0">
                                       <div className="text-sm font-medium truncate">{unit.name}</div>
                                       <div className="text-xs text-muted-foreground">
                                          {unit.available} disponibles · atq {unit.attack} · def {unit.defense}
                                       </div>
                                    </div>
                                    <Input
                                       type="number"
                                       min={0}
                                       max={unit.available}
                                       value={quantities[unit.antId] ?? ""}
                                       onChange={(event) => setQuantity(unit.antId, unit.available, event.target.value)}
                                       className="w-20 h-8 text-sm"
                                       placeholder="0"
                                       disabled={unit.available <= 0}
                                    />
                                 </div>
                              ))}

                           {selected && (
                              <>
                                 <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                                    <span className="text-muted-foreground">Unidades enviadas</span>
                                    <span className="font-bold">{totalSelected}</span>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Viaje</span>
                                    <span>{formatDuration(selected.travelSeconds)}</span>
                                 </div>
                                 <Button
                                    className="w-full"
                                    onClick={handleAttack}
                                    disabled={sending || totalSelected <= 0}
                                 >
                                    <Swords className="mr-2 h-4 w-4" />
                                    {sending ? "Enviando..." : "Atacar"}
                                 </Button>
                              </>
                           )}
                        </CardContent>
                     </Card>

                     {/* Batallas */}
                     <Card className="game-panel">
                        <CardHeader>
                           <CardTitle className="text-xl flex items-center gap-2">
                              <Trophy className="h-5 w-5 text-amber-500" /> Tus batallas
                           </CardTitle>
                           <CardDescription>Pendientes y resueltas</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           {(battles ?? []).length === 0 && (
                              <p className="text-sm text-muted-foreground">
                                 Todavía no has enviado ninguna expedición.
                              </p>
                           )}

                           {(battles ?? []).slice(0, 8).map((battle) => {
                              const start = new Date(battle.startedAt).getTime()
                              const arrive = new Date(battle.arrivesAt).getTime()
                              const total = Math.max(1, arrive - start)
                              const progress = Math.min(100, Math.max(0, ((now - start) / total) * 100))
                              const remaining = Math.max(0, (arrive - now) / 1000)

                              return (
                                 <div key={battle.id} className="p-3 rounded-lg bg-background/40 border border-border/50 space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                       <span className="text-sm font-medium flex items-center gap-1">
                                          {battle.pending ? (
                                             <Clock className="h-3 w-3 text-amber-500" />
                                          ) : battle.result === "WIN" ? (
                                             <Trophy className="h-3 w-3 text-emerald-500" />
                                          ) : (
                                             <Skull className="h-3 w-3 text-destructive" />
                                          )}
                                          {battle.monster?.name ?? "Monstruo"}
                                       </span>
                                       {resultBadge(battle.result)}
                                    </div>

                                    {battle.pending ? (
                                       <div>
                                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                             <span>En camino</span>
                                             <span>{formatDuration(remaining)}</span>
                                          </div>
                                          <Progress value={progress} className="h-1.5" />
                                       </div>
                                    ) : (
                                       <div className="text-xs text-muted-foreground">
                                          {formatLoot(battle.loot).join(" · ") || "Sin botín"}
                                       </div>
                                    )}
                                 </div>
                              )
                           })}
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </main>
         </div>
      </ProtectedRoute>
   )
}
