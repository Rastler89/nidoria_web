"use client"

import { useEffect, useState } from "react"
import { adminFetch } from "@/lib/admin-api"

export default function AnalysisPage() {
  const [health, setHealth] = useState<any>(null)
  const [techTree, setTechTree] = useState<any>(null)

  useEffect(() => {
    adminFetch("antmaster/api/analysis/health").then(setHealth)
    adminFetch("antmaster/api/analysis/tech-tree").then(setTechTree)
  }, [])

  return (
    <div className="space-y-8">
      {/* Health */}
      <div className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
        <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-300 flex items-center gap-3 mb-6">
          <span>💚</span> Salud del Juego
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Usuarios activos (24h)", value: health?.activeUsers24h },
            { label: "Trabajos fallidos", value: health?.totalFailedJobs },
            { label: "Trabajos en espera", value: health?.totalWaitingJobs },
            { label: "Recursos globales", value: health?.globalResources?.toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</div>
              <div className="text-2xl font-black text-white">{value ?? "—"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Tree */}
      <div className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
        <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-300 flex items-center gap-3 mb-6">
          <span>🌳</span> Árbol Tecnológico
        </h3>
        {techTree ? (
          <pre className="bg-black/60 rounded-2xl p-6 text-xs font-mono text-zinc-300 overflow-x-auto border border-white/5 max-h-[500px] overflow-y-auto">
            {JSON.stringify(techTree, null, 2)}
          </pre>
        ) : (
          <p className="text-zinc-500 text-sm">Cargando datos del árbol tecnológico...</p>
        )}
      </div>
    </div>
  )
}
