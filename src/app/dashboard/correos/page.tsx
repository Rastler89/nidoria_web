"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import useSWR, { mutate } from "swr"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSocket } from "@/context/SocketContext"
import { toast } from "@/components/ui/use-toast"
import { CheckCheck, Coins, Mail, Skull, Swords, Trophy } from "lucide-react"

interface ReportSummary {
   id: number
   type: "BATTLE" | "SYSTEM" | "ALLIANCE"
   battleId: number | null
   title: string
   body: any
   read: boolean
   readAt: string | null
   createdAt: string
}

interface ReportList {
   page: number
   limit: number
   total: number
   unread: number
   pages: number
   items: ReportSummary[]
}

interface ReportDetail {
   id: number
   type: string
   battleId: number | null
   title: string
   body: any
   readAt: string | null
   createdAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const RESOURCE_LABELS: Record<string, string> = {
   FOOD: "Comida",
   WOOD: "Madera",
   LEAD: "Plomo",
}

const FILTERS = [
   { id: "all", label: "Todos" },
   { id: "unread", label: "Sin leer" },
   { id: "BATTLE", label: "Batallas" },
   { id: "SYSTEM", label: "Sistema" },
] as const

type FilterId = (typeof FILTERS)[number]["id"]

function formatDate(value: string) {
   return new Date(value).toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
   })
}

function formatDuration(totalSeconds: number) {
   const seconds = Math.max(0, Math.round(Number(totalSeconds) || 0))
   if (seconds < 60) return `${seconds} s`
   const minutes = Math.floor(seconds / 60)
   const rest = seconds % 60
   return rest > 0 ? `${minutes} min ${rest} s` : `${minutes} min`
}

function unitLabel(code: string, body: any): string {
   const attacker = body?.units?.attacker as Array<{ key: string; name: string }> | undefined
   const defender = body?.units?.defender as Array<{ key: string; name: string }> | undefined
   const match = [...(attacker ?? []), ...(defender ?? [])].find((unit) => unit.key === code)
   return match?.name ?? code
}

function LossList({ losses, body }: { losses: Record<string, number>; body: any }) {
   const entries = Object.entries(losses ?? {}).filter(([, amount]) => Number(amount) > 0)

   if (entries.length === 0) {
      return <span className="text-muted-foreground">Sin bajas</span>
   }

   return (
      <ul className="space-y-1">
         {entries.map(([code, amount]) => (
            <li key={code} className="flex justify-between gap-4">
               <span>{unitLabel(code, body)}</span>
               <span className="font-medium text-destructive">-{Number(amount)}</span>
            </li>
         ))}
      </ul>
   )
}

function BattleReport({ body }: { body: any }) {
   const result = body?.result as string | undefined
   const rounds = (body?.rounds as any[]) ?? []
   const lootEntries = Object.entries((body?.loot ?? {}) as Record<string, number>).filter(
      ([, amount]) => Number(amount) > 0,
   )

   if (body?.reason === "gone") {
      return (
         <div className="space-y-3">
            <p className="text-muted-foreground">
               La presa desapareció antes de que llegaran tus hormigas. Las unidades enviadas han
               vuelto al hormiguero.
            </p>
            <p className="text-sm text-muted-foreground">
               Viaje: {formatDuration(body?.travelSeconds ?? 0)}
            </p>
         </div>
      )
   }

   return (
      <div className="space-y-6">
         <div className="flex flex-wrap items-center gap-3">
            {result === "WIN" ? (
               <Badge className="bg-emerald-600 text-white">
                  <Trophy className="h-3 w-3" /> Victoria
               </Badge>
            ) : result === "LOSS" ? (
               <Badge variant="destructive">
                  <Skull className="h-3 w-3" /> Derrota
               </Badge>
            ) : (
               <Badge variant="secondary">Empate</Badge>
            )}

            {body?.monster && (
               <span className="text-sm">
                  {body.monster.name}
                  {body.monster.level ? ` · nivel ${body.monster.level}` : ""}
               </span>
            )}

            <span className="text-sm text-muted-foreground">
               Viaje: {formatDuration(body?.travelSeconds ?? 0)}
            </span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
               <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                  <Coins className="h-3 w-3" /> Botín
               </h4>
               {lootEntries.length === 0 ? (
                  <span className="text-sm text-muted-foreground">Sin botín</span>
               ) : (
                  <ul className="space-y-1 text-sm">
                     {lootEntries.map(([type, amount]) => (
                        <li key={type} className="flex justify-between gap-4">
                           <span>{RESOURCE_LABELS[type] ?? type}</span>
                           <span className="font-medium text-amber-500">
                              +{Number(amount).toLocaleString("es-ES")}
                           </span>
                        </li>
                     ))}
                  </ul>
               )}
            </div>

            <div className="rounded-lg border border-border/60 p-4">
               <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                  <Swords className="h-3 w-3" /> Bajas propias
               </h4>
               <div className="text-sm">
                  <LossList losses={body?.lossesAttacker ?? {}} body={body} />
               </div>
            </div>

            <div className="rounded-lg border border-border/60 p-4">
               <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1">
                  <Skull className="h-3 w-3" /> Bajas enemigas
               </h4>
               <div className="text-sm">
                  <LossList losses={body?.lossesDefender ?? {}} body={body} />
               </div>
            </div>
         </div>

         {rounds.length > 0 && (
            <div>
               <h4 className="text-sm font-bold mb-2">Rondas de combate</h4>
               <div className="max-h-64 overflow-y-auto rounded-lg border border-border/60">
                  <table className="w-full text-sm">
                     <thead className="bg-muted/40 sticky top-0">
                        <tr>
                           <th className="text-left p-2 font-medium">Ronda</th>
                           <th className="text-right p-2 font-medium">Daño hecho</th>
                           <th className="text-right p-2 font-medium">Daño recibido</th>
                           <th className="text-right p-2 font-medium">Tuyas</th>
                           <th className="text-right p-2 font-medium">Enemigas</th>
                        </tr>
                     </thead>
                     <tbody>
                        {rounds.map((round) => (
                           <tr key={round.round} className="border-t border-border/40">
                              <td className="p-2">{round.round}</td>
                              <td className="p-2 text-right text-emerald-500">
                                 {Number(round.attackerDamage).toLocaleString("es-ES")}
                              </td>
                              <td className="p-2 text-right text-destructive">
                                 {Number(round.defenderDamage).toLocaleString("es-ES")}
                              </td>
                              <td className="p-2 text-right">{round.attackerRemaining}</td>
                              <td className="p-2 text-right">{round.defenderRemaining}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>
   )
}

function ReportBody({ report }: { report: ReportDetail }) {
   if (report.type === "BATTLE") {
      return <BattleReport body={report.body} />
   }

   return (
      <pre className="text-sm whitespace-pre-wrap break-words bg-muted/30 rounded-lg p-4">
         {JSON.stringify(report.body ?? {}, null, 2)}
      </pre>
   )
}

export default function CorreosPage() {
   const { socket, refreshReports } = useSocket()
   const [filter, setFilter] = useState<FilterId>("all")
   const [selectedId, setSelectedId] = useState<number | null>(null)
   const markedRef = useRef<Set<number>>(new Set())

   const listKey = useMemo(() => {
      const params = new URLSearchParams({ limit: "30" })
      if (filter === "unread") params.set("unread", "true")
      if (filter === "BATTLE" || filter === "SYSTEM") params.set("type", filter)
      return `/api/reports?${params.toString()}`
   }, [filter])

   const { data: list } = useSWR<ReportList>(listKey, fetcher)
   const { data: detail, mutate: mutateDetail } = useSWR<ReportDetail>(
      selectedId ? `/api/reports/detail?id=${selectedId}` : null,
      fetcher,
   )

   const reports = list?.items ?? []

   useEffect(() => {
      if (!socket) return
      const handler = () => mutate(listKey)
      socket.on("report_new", handler)
      return () => {
         socket.off("report_new", handler)
      }
   }, [socket, listKey])

   useEffect(() => {
      if (!detail || detail.readAt || markedRef.current.has(detail.id)) return

      markedRef.current.add(detail.id)

      fetch("/api/reports/read", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ id: detail.id }),
      })
         .then(() => {
            mutate(listKey)
            mutateDetail()
            refreshReports()
         })
         .catch(() => {
            // Si falla, el reporte sigue sin leer; no es crítico.
         })
   }, [detail, listKey, mutateDetail, refreshReports])

   const markAllRead = async () => {
      try {
         const res = await fetch("/api/reports/read-all", { method: "POST" })
         if (!res.ok) throw new Error("No se pudo marcar todo como leído")

         mutate(listKey)
         mutateDetail()
         refreshReports()
         toast({ title: "Bandeja al día", description: "Todos los reportes están marcados como leídos." })
      } catch (error: any) {
         toast({
            title: "Error",
            description: error?.message ?? "No se pudo actualizar la bandeja.",
            variant: "destructive",
         })
      }
   }

   return (
      <ProtectedRoute>
         <div className="min-h-screen bg-background pb-12">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
               <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                     <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
                        <Mail className="h-8 w-8" /> Buzón
                     </h1>
                     <p className="text-muted-foreground">
                        Reportes de batalla y avisos del sistema
                        {list?.unread ? ` · ${list.unread} sin leer` : ""}
                     </p>
                  </div>
                  <Button variant="outline" onClick={markAllRead} disabled={!list?.unread}>
                     <CheckCheck className="mr-2 h-4 w-4" /> Marcar todo leído
                  </Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[500px]">
                  <Card className="md:col-span-1 game-panel flex flex-col overflow-hidden">
                     <div className="p-3 border-b border-border flex flex-wrap gap-2">
                        {FILTERS.map((item) => (
                           <Button
                              key={item.id}
                              size="sm"
                              variant={filter === item.id ? "secondary" : "ghost"}
                              onClick={() => setFilter(item.id)}
                           >
                              {item.label}
                           </Button>
                        ))}
                     </div>

                     <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[60vh]">
                        {reports.length === 0 && (
                           <p className="p-4 text-sm text-muted-foreground text-center">
                              No hay reportes en esta bandeja.
                           </p>
                        )}

                        {reports.map((report) => (
                           <button
                              key={report.id}
                              onClick={() => setSelectedId(report.id)}
                              className={`w-full text-left p-3 rounded-lg transition-colors border ${
                                 selectedId === report.id
                                    ? "bg-primary/10 border-primary/30"
                                    : "bg-card hover:bg-accent/5 border-border"
                              }`}
                           >
                              <div className="flex justify-between items-start gap-2 mb-1">
                                 <span className={`text-sm ${!report.read ? "font-bold text-primary" : "font-medium"}`}>
                                    {report.title}
                                 </span>
                                 <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDate(report.createdAt)}
                                 </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                 <Badge variant="outline">
                                    {report.type === "BATTLE" ? "Batalla" : report.type === "SYSTEM" ? "Sistema" : "Alianza"}
                                 </Badge>
                                 {!report.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                              </div>
                           </button>
                        ))}
                     </div>
                  </Card>

                  <Card className="md:col-span-2 game-panel flex flex-col overflow-hidden">
                     {detail ? (
                        <>
                           <CardHeader className="border-b border-border bg-card/50">
                              <CardTitle className="text-xl mb-1">{detail.title}</CardTitle>
                              <CardDescription>
                                 {formatDate(detail.createdAt)}
                                 {detail.battleId ? ` · Batalla #${detail.battleId}` : ""}
                              </CardDescription>
                           </CardHeader>
                           <CardContent className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
                              <ReportBody report={detail} />
                           </CardContent>
                        </>
                     ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center min-h-[300px]">
                           <Mail className="h-16 w-16 mb-4 opacity-20" />
                           <h3 className="text-lg font-medium mb-2">No has seleccionado ningún reporte</h3>
                           <p>Elige un reporte de la lista para ver el detalle de la batalla.</p>
                        </div>
                     )}
                  </Card>
               </div>
            </main>
         </div>
      </ProtectedRoute>
   )
}
