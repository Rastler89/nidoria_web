"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"

interface Summary {
  userCount: number
  anthillCount: number
  verifiedUsers: number
}

interface QueueStats {
  [key: string]: { waiting: number; active: number; completed: number; failed: number; delayed: number }
}

const DB_HOST = process.env.NEXT_PUBLIC_DB_HOST || "http://127.0.0.1:4000"

async function adminFetch(url: string) {
  const token = Cookies.get("auth_token")
  const res = await fetch(`${DB_HOST}/${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export default function AntMasterDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [queues, setQueues] = useState<QueueStats | null>(null)
  const [health, setHealth] = useState<any>(null)

  useEffect(() => {
    adminFetch("antmaster/api/summary").then(setSummary)
    adminFetch("antmaster/api/queues-stats").then(setQueues)
    adminFetch("antmaster/api/analysis/health").then(setHealth)
  }, [])

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Usuarios", value: summary?.userCount ?? "—", icon: "👥", color: "amber" },
          { label: "Hormigueros", value: summary?.anthillCount ?? "—", icon: "🏠", color: "amber" },
          { label: "Verificados", value: summary?.verifiedUsers ?? "—", icon: "✅", color: "green" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-white/10 hover:-translate-y-0.5 transition-all"
          >
            <div className="absolute -right-4 -bottom-4 text-8xl text-white/[0.03] group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <div className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className={`text-${stat.color}-500`}>{stat.icon}</span>
              {stat.label}
            </div>
            <div className="text-5xl font-black text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Queue Stats */}
      <div className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
        <div className="px-8 py-5 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-300 flex items-center gap-3">
            <span>🖥️</span> Estado de Colas de Trabajo
            <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">Bull</span>
          </h3>
          <button
            onClick={() => adminFetch("antmaster/api/queues-stats").then(setQueues)}
            className="text-[10px] bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-5 py-2 rounded-full transition-all uppercase border border-amber-500/30"
          >
            Sincronizar
          </button>
        </div>
        <div className="p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {queues && Object.entries(queues).map(([name, stats]) => (
            <div key={name} className="bg-black/40 rounded-2xl p-5 border border-white/5 text-center space-y-2">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{name}</div>
              <div className="space-y-1 text-xs">
                {[
                  { label: "Esperando", value: stats.waiting, color: "text-blue-400" },
                  { label: "Activos", value: stats.active, color: "text-green-400" },
                  { label: "Completados", value: stats.completed, color: "text-zinc-400" },
                  { label: "Fallidos", value: stats.failed, color: "text-red-400" },
                  { label: "Retrasados", value: stats.delayed, color: "text-yellow-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-zinc-500">{label}</span>
                    <span className={`font-bold ${value > 0 ? color : "text-zinc-600"}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Health */}
      {health && (
        <div className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
          <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-300 flex items-center gap-3 mb-6">
            <span>💚</span> Salud del Juego
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Usuarios activos (24h)", value: health.activeUsers24h },
              { label: "Trabajos fallidos", value: health.totalFailedJobs },
              { label: "Trabajos en espera", value: health.totalWaitingJobs },
              { label: "Recursos globales", value: health.globalResources?.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</div>
                <div className="text-2xl font-black text-white">{value ?? "—"}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-[10px] text-zinc-600 font-mono">
            Server: {health.serverTime ? new Date(health.serverTime).toLocaleString() : "—"}
          </div>
        </div>
      )}
    </div>
  )
}
