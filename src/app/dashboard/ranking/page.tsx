"use client"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"
import { useState, useEffect, useMemo } from "react"
import { Trophy, Medal, Star, Crown, Sword, Pickaxe, BookOpen, User, Loader2, Sparkles, TrendingUp, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RankingEntry {
  powerTotal?: number
  powerConstruction?: number
  powerInvestigation?: number
  powerMilitary?: number
  owner: {
    id: number
    username: string
    titles: Array<{
      title: {
        name: string
        style: any
      }
    }>
  }
}

interface CategoryData {
  top10: RankingEntry[]
  user: {
    rank: number
    points: number
  }
}

interface RankingData {
  general: CategoryData
  construction: CategoryData
  investigation: CategoryData
  military: CategoryData
}

const getPoints = (entry: RankingEntry, category: string) => {
  switch (category) {
    case "general": return entry.powerTotal || 0
    case "construction": return entry.powerConstruction || 0
    case "investigation": return entry.powerInvestigation || 0
    case "military": return entry.powerMilitary || 0
    default: return 0
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "general": return <Trophy className="h-4 w-4 mr-2" />
    case "construction": return <Pickaxe className="h-4 w-4 mr-2" />
    case "investigation": return <BookOpen className="h-4 w-4 mr-2" />
    case "military": return <Sword className="h-4 w-4 mr-2" />
    default: return null
  }
}

const PodiumItem = ({ entry, rank, category, isCurrentUser }: { entry: RankingEntry, rank: number, category: string, isCurrentUser: boolean }) => {
  const points = getPoints(entry, category)
  const username = entry.owner.username
  const title = entry.owner.titles[0]?.title.name || "Novato"
  const isFounder = entry.owner.titles.some(t => t.title.name.toLowerCase().includes('fundador') || t.title.name.toLowerCase().includes('founder'))
  
  const colors = {
    1: "from-[#f59e0b] via-[#fbbf24] to-[#d97706] shadow-amber-500/40 border-[#fbbf24]/50",
    2: "from-slate-300 via-white to-slate-400 shadow-slate-300/30 border-slate-300/50",
    3: "from-[#8c5e3c] via-[#b5835a] to-[#5a3e2b] shadow-[#8c5e3c]/30 border-[#b5835a]/50"
  }[rank as 1 | 2 | 3]

  const height = { 1: "h-48", 2: "h-40", 3: "h-36" }[rank as 1 | 2 | 3]
  const order = { 1: "order-2", 2: "order-1", 3: "order-3" }[rank as 1 | 2 | 3]
  const avatarSize = { 1: "h-24 w-24", 2: "h-20 w-20", 3: "h-20 w-20" }[rank as 1 | 2 | 3]

  return (
    <div className={`flex flex-col items-center ${order} mb-4 transform transition-all duration-500 hover:scale-105`}>
      <div className="relative mb-6 group">
        <div className={`absolute -inset-2 rounded-full bg-gradient-to-tr ${colors} blur-lg opacity-40 group-hover:opacity-100 transition-opacity duration-500 ${rank === 1 ? 'animate-pulse' : ''}`} />
        <Avatar className={`${avatarSize} border-4 border-[#2d241e] relative z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] ring-2 ring-[#b5835a]/20`}>
          <AvatarFallback className="bg-[#2d241e] text-lg font-black text-[#b5835a]">{username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className={`absolute -top-4 -right-4 z-20 bg-gradient-to-tr ${colors} p-2 rounded-xl shadow-2xl border border-white/20 transform rotate-12 group-hover:rotate-0 transition-transform`}>
          {rank === 1 ? <Crown className="h-6 w-6 text-[#1c1512]" /> : <Medal className="h-5 w-5 text-[#1c1512]" />}
        </div>
        {rank === 1 && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 bg-[#f59e0b] text-[#1c1512] text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg">Rey de la Colmena</div>}
      </div>
      
      <div className="text-center mb-4 px-2">
        <h3 className={`font-black tracking-tight text-sm md:text-base truncate max-w-[130px] ${isCurrentUser ? "text-[#f59e0b] text-glow" : "text-[#ece0d1]"}`}>
          {username}
        </h3>
        <p className={`text-[9px] uppercase tracking-[0.2em] font-black leading-tight mt-1 ${isFounder ? 'founder-badge-animated' : 'text-[#b5835a]'}`}>
          {title}
        </p>
      </div>

      <div className={`w-24 md:w-32 ${height} bg-gradient-to-b ${colors} rounded-t-[3rem] relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.4),0_10px_40px_rgba(0,0,0,0.6)] flex flex-col justify-end p-4 border-t-2 border-x-2 border-white/10`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        <div className="relative z-10 text-center">
          <span className="block text-3xl md:text-4xl font-black text-[#1c1512] leading-none mb-1 italic">
            {rank}
          </span>
          <div className="h-px w-8 bg-[#1c1512]/20 mx-auto mb-1" />
          <span className="block text-[10px] font-black text-[#1c1512]/70 uppercase tracking-tighter">
            {points.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function RankingPage() {
  const { user } = useAuth()
  const [data, setData] = useState<RankingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch("/api/ranking")
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (error) {
        console.error("Error fetching ranking:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRanking()
  }, [])

  const currentCategoryData = useMemo(() => {
    if (!data) return null
    return data[activeTab as keyof RankingData]
  }, [data, activeTab])

  const RankingList = ({ category, categoryData }: { category: string, categoryData: CategoryData }) => {
    const top3 = categoryData.top10.slice(0, 3)
    const rest = categoryData.top10.slice(3)

    return (
      <CardContent className="p-0 flex flex-col">
        {/* Podium Section */}
        {top3.length > 0 && (
          <div className="relative pt-16 pb-12 px-4 flex justify-center items-end gap-2 md:gap-10 bg-[#1c1512]/60 border-b border-[#b5835a]/10">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(181,131,90,0.15),transparent_70%)] pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#1c1512] to-transparent pointer-events-none" />
             
             {top3[1] && <PodiumItem entry={top3[1]} rank={2} category={category} isCurrentUser={top3[1].owner.username === user?.username} />}
             {top3[0] && <div className="amber-glow rounded-t-[4rem]"><PodiumItem entry={top3[0]} rank={1} category={category} isCurrentUser={top3[0].owner.username === user?.username} /></div>}
             {top3[2] && <PodiumItem entry={top3[2]} rank={3} category={category} isCurrentUser={top3[2].owner.username === user?.username} />}
          </div>
        )}

        <div className="min-h-[200px] bg-[#1c1512]/40 soil-pattern">
          {rest.map((entry, index) => {
            const rank = index + 4
            const points = getPoints(entry, category)
            const username = entry.owner.username
            const title = entry.owner.titles[0]?.title.name || "Novato"
            const isCurrentUser = username === user?.username
            const isFounder = entry.owner.titles.some(t => t.title.name.toLowerCase().includes('fundador') || t.title.name.toLowerCase().includes('founder'))

            return (
              <div
                key={entry.owner.id}
                className={`grid grid-cols-12 gap-4 items-center p-5 border-b border-[#b5835a]/5 hover:bg-[#b5835a]/5 transition-all duration-300 group relative ${
                  isCurrentUser ? "bg-[#b5835a]/10" : ""
                }`}
              >
                {isCurrentUser && <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#f59e0b] rounded-r-full shadow-[0_0_15px_rgba(245,158,11,0.6)]" />}
                
                <div className="col-span-2 md:col-span-1 text-center flex justify-center items-center">
                  <div className="h-9 w-9 rounded-xl bg-[#2d241e] border border-[#b5835a]/20 flex items-center justify-center font-black text-sm text-[#b5835a] group-hover:border-[#f59e0b]/50 group-hover:text-[#f59e0b] transition-all transform group-hover:scale-110 italic">
                    {rank}
                  </div>
                </div>

                <div className="col-span-6 md:col-span-6 flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-11 w-11 border-2 border-[#b5835a]/20 ring-1 ring-[#1c1512] shadow-lg group-hover:border-[#f59e0b]/30 transition-all">
                      <AvatarFallback className="bg-[#2d241e] text-xs font-black text-[#b5835a]">{username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {isCurrentUser && <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#f59e0b] rounded-full border-2 border-[#1c1512] animate-pulse" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-black tracking-tighter text-base md:text-lg leading-tight ${isCurrentUser ? "text-[#f59e0b]" : "text-[#ece0d1]"}`}>
                      {username}
                    </span>
                    <span className={`text-[9px] uppercase tracking-[0.2em] font-black group-hover:opacity-100 transition-opacity ${isFounder ? 'founder-badge-animated' : 'text-[#b5835a] opacity-60'}`}>
                      {title}
                    </span>
                  </div>
                </div>

                <div className="col-span-4 md:col-span-5 text-right flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-[#ece0d1] text-lg md:text-xl tracking-tighter">
                      {points.toLocaleString()}
                    </span>
                    <div className="h-5 w-5 rounded-full bg-[#f59e0b]/10 flex items-center justify-center border border-[#f59e0b]/20">
                      <TrendingUp className="h-3 w-3 text-[#f59e0b]" />
                    </div>
                  </div>
                  <span className="text-[9px] text-[#b5835a] uppercase font-black tracking-[0.3em] mt-1">Puntos de Prestigio</span>
                </div>
              </div>
            )
          })}

          {categoryData.top10.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-[#b5835a]">
              <div className="relative mb-6">
                <div className="absolute -inset-4 bg-[#b5835a]/10 blur-xl rounded-full animate-pulse" />
                <Trophy className="h-20 w-20 opacity-20" />
              </div>
              <p className="font-black uppercase tracking-[0.4em] text-[10px] italic">Esperando a los primeros conquistadores...</p>
            </div>
          )}
        </div>

        {/* User Status Bar - Redesigned as a "Royal Seal" */}
        <div className="bg-[#2d241e]/95 backdrop-blur-3xl border-t-2 border-[#f59e0b]/40 p-6 md:p-8 grid grid-cols-12 gap-6 items-center sticky bottom-0 z-20 shadow-[0_-20px_60px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f59e0b] p-1.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] border-4 border-[#1c1512]">
              <Sparkles className="h-4 w-4 text-[#1c1512] animate-spin-slow" />
            </div>

            <div className="col-span-3 md:col-span-2 text-center border-r border-[#b5835a]/10">
              <span className="text-[9px] text-[#b5835a] block uppercase font-black tracking-[0.3em] mb-1">Tu Rango</span>
              <span className="text-3xl font-black text-white leading-none tracking-tighter italic">#{categoryData.user.rank}</span>
            </div>
            
            <div className="col-span-5 md:col-span-6 flex items-center gap-5 pl-2">
               <div className="h-14 w-14 rounded-[1.5rem] bg-gradient-to-tr from-[#f59e0b] to-[#b5835a] flex items-center justify-center border-2 border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.4)] animate-float overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
                  <User className="h-8 w-8 text-[#1c1512] relative z-10" />
               </div>
               <div className="flex flex-col">
                  <span className="font-black text-white uppercase tracking-tighter text-lg leading-tight">Posición de Colonia</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]"></span>
                    </span>
                    <span className="text-[9px] uppercase text-[#f59e0b] font-black tracking-[0.2em]">Enlace con la Gran Reina activo</span>
                  </div>
               </div>
            </div>

            <div className="col-span-4 md:col-span-4 text-right flex flex-col bg-[#1c1512]/40 p-4 rounded-2xl border border-[#b5835a]/10">
               <span className="text-[9px] text-[#b5835a] block uppercase font-black tracking-[0.3em] mb-1">Prestigio de Nidoria</span>
               <div className="flex items-center justify-end gap-3">
                <span className="text-3xl font-black text-[#f59e0b] font-mono tracking-tighter">{categoryData.user.points.toLocaleString()}</span>
                <div className="text-xl">🍯</div>
               </div>
            </div>
        </div>
      </CardContent>
    )
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#1c1512] flex flex-col relative overflow-hidden text-[#ece0d1] ant-texture">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(181,131,90,0.1),transparent_70%)] animate-pulse" />
          <Navigation />
          <div className="flex-1 flex items-center justify-center relative z-10">
            <div className="flex flex-col items-center gap-8">
              <div className="relative group">
                <div className="absolute -inset-8 rounded-full bg-[#f59e0b]/10 blur-3xl animate-pulse group-hover:bg-[#f59e0b]/20 transition-all" />
                <div className="h-24 w-24 rounded-full border-t-4 border-[#f59e0b] border-r-4 border-transparent animate-spin relative z-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 bg-[#2d241e] rounded-full border-2 border-[#b5835a]/20 flex items-center justify-center animate-bounce">
                    <Loader2 className="h-6 w-6 text-[#f59e0b] animate-spin-slow" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <p className="text-[#f59e0b] font-black tracking-[0.5em] uppercase text-xs italic">Consultando los Archivos de la Reina</p>
                <div className="w-64 h-1.5 bg-[#2d241e] rounded-full overflow-hidden border border-[#b5835a]/10">
                  <div className="h-full bg-gradient-to-r from-[#8c5e3c] via-[#f59e0b] to-[#8c5e3c] w-1/3 animate-[loading_2.5s_infinite_ease-in-out]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#1c1512] text-[#ece0d1] selection:bg-[#f59e0b]/30 ant-texture">
        <style jsx global>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        `}</style>

        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(181,131,90,0.15),transparent_60%)] pointer-events-none" />
        
        <Navigation />
        
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <header className="mb-20 text-center">
            <div className="inline-flex relative mb-10 group">
              <div className="absolute -inset-12 bg-[#f59e0b]/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative p-6 bg-gradient-to-b from-[#2d241e] to-transparent rounded-[2.5rem] border-2 border-[#b5835a]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl transform transition-all group-hover:scale-110 group-hover:rotate-3 duration-700 nest-chamber">
                <Trophy className="h-16 w-16 text-[#f59e0b] animate-float drop-shadow-glow" />
                <div className="absolute -top-3 -left-3 bg-[#f59e0b] p-2.5 rounded-2xl border-2 border-[#1c1512] shadow-xl transform -rotate-12">
                  <Crown className="h-6 w-6 text-[#1c1512]" />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-[#b5835a] p-2.5 rounded-2xl border-2 border-[#1c1512] shadow-xl transform rotate-12">
                  <Sparkles className="h-6 w-6 text-[#1c1512]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mb-8">
              <span className="text-[#b5835a] text-xs font-black tracking-[0.8em] uppercase italic">Pabellón de Honor</span>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic flex flex-col leading-[0.8]">
                <span className="bg-gradient-to-b from-[#ece0d1] via-[#ece0d1] to-[#b5835a] bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                  RANKING
                </span>
                <span className="text-[#f59e0b] text-4xl md:text-5xl not-italic tracking-[0.3em] mt-4 font-black text-glow">NIDORIA</span>
              </h1>
            </div>
            
            <div className="flex items-center justify-center gap-6 mb-10">
              <div className="h-[2px] w-12 md:w-24 bg-gradient-to-r from-transparent to-[#b5835a]" />
              <div className="text-2xl">🐜</div>
              <div className="h-[2px] w-12 md:w-24 bg-gradient-to-l from-transparent to-[#b5835a]" />
            </div>
            
            <p className="text-[#b5835a] text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed tracking-tight italic">
              "Solo aquellos que demuestren la fuerza de mil obreras y la sabiduría de la Reina verán su nombre grabado en las paredes de ámbar."
            </p>
          </header>

          <Tabs defaultValue="general" onValueChange={setActiveTab} className="w-full space-y-16">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 p-3 bg-[#2d241e]/80 border-2 border-[#b5835a]/10 backdrop-blur-3xl h-auto gap-3 rounded-[2rem] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05),transparent_70%)] pointer-events-none" />
              
              <TabsTrigger value="general" className="py-5 data-[state=active]:bg-[#f59e0b] data-[state=active]:text-[#1c1512] data-[state=active]:shadow-[0_0_25px_rgba(245,158,11,0.4)] font-black uppercase tracking-widest text-[11px] transition-all rounded-2xl group border border-[#b5835a]/5 relative z-10">
                <div className="flex flex-col items-center gap-3">
                  <Trophy className="h-6 w-6 group-data-[state=active]:scale-125 transition-all duration-500" />
                  <span>General</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="construction" className="py-5 data-[state=active]:bg-[#f59e0b] data-[state=active]:text-[#1c1512] data-[state=active]:shadow-[0_0_25px_rgba(245,158,11,0.4)] font-black uppercase tracking-widest text-[11px] transition-all rounded-2xl group border border-[#b5835a]/5 relative z-10">
                <div className="flex flex-col items-center gap-3">
                  <Pickaxe className="h-6 w-6 group-data-[state=active]:scale-125 transition-all duration-500" />
                  <span>Obras</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="investigation" className="py-5 data-[state=active]:bg-[#f59e0b] data-[state=active]:text-[#1c1512] data-[state=active]:shadow-[0_0_25px_rgba(245,158,11,0.4)] font-black uppercase tracking-widest text-[11px] transition-all rounded-2xl group border border-[#b5835a]/5 relative z-10">
                <div className="flex flex-col items-center gap-3">
                  <BookOpen className="h-6 w-6 group-data-[state=active]:scale-125 transition-all duration-500" />
                  <span>Ciencia</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="military" className="py-5 data-[state=active]:bg-[#f59e0b] data-[state=active]:text-[#1c1512] data-[state=active]:shadow-[0_0_25px_rgba(245,158,11,0.4)] font-black uppercase tracking-widest text-[11px] transition-all rounded-2xl group border border-[#b5835a]/5 relative z-10">
                <div className="flex flex-col items-center gap-3">
                  <Sword className="h-6 w-6 group-data-[state=active]:scale-125 transition-all duration-500" />
                  <span>Militar</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <Card className="bg-[#1c1512]/80 border-2 border-[#b5835a]/10 shadow-[0_40px_120px_rgba(0,0,0,0.9)] backdrop-blur-3xl rounded-[3rem] overflow-hidden ring-1 ring-white/5 animate-in fade-in zoom-in duration-1000 nest-chamber">
               <CardHeader className="bg-[#2d241e]/50 border-b-2 border-[#b5835a]/10 py-8 px-10 flex flex-col md:flex-row items-center justify-between gap-6 relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(245,158,11,0.05),transparent_50%)] pointer-events-none" />
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="p-4 bg-[#f59e0b]/10 rounded-2xl border-2 border-[#f59e0b]/20 amber-glow">
                      {getCategoryIcon(activeTab)}
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">
                        Los <span className="text-[#f59e0b]">Grandes Soberanos</span>
                      </h2>
                      <p className="text-[#b5835a] text-xs font-black uppercase tracking-[0.2em] mt-1">Categoría: {activeTab}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <Badge variant="outline" className="bg-[#f59e0b]/5 border-[#f59e0b]/20 text-[11px] font-black uppercase tracking-[0.3em] px-6 py-2.5 rounded-xl text-[#f59e0b] shadow-xl">
                      Ciclo Vital 1
                    </Badge>
                  </div>
               </CardHeader>

               <TabsContent value="general" className="m-0 border-none outline-none">
                  {data && <RankingList category="general" categoryData={data.general} />}
               </TabsContent>
               <TabsContent value="construction" className="m-0 border-none outline-none">
                  {data && <RankingList category="construction" categoryData={data.construction} />}
               </TabsContent>
               <TabsContent value="investigation" className="m-0 border-none outline-none">
                  {data && <RankingList category="investigation" categoryData={data.investigation} />}
               </TabsContent>
               <TabsContent value="military" className="m-0 border-none outline-none">
                  {data && <RankingList category="military" categoryData={data.military} />}
               </TabsContent>
            </Card>
          </Tabs>

          <footer className="mt-24 text-center relative py-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#b5835a]/30 to-transparent" />
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4 text-2xl opacity-20">
                <span>🐜</span>
                <span>👑</span>
                <span>🐜</span>
              </div>
              <p className="text-[11px] uppercase tracking-[0.6em] text-[#b5835a]/40 font-black italic max-w-lg mx-auto leading-loose">
                Registrado para la eternidad en los túneles sagrados del Consejo de la Reina
              </p>
              <div className="h-1.5 w-1.5 bg-[#f59e0b] rounded-full animate-pulse" />
            </div>
          </footer>
        </main>
      </div>
    </ProtectedRoute>
  )
}
