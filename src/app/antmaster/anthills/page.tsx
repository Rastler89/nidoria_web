"use client"

import { useEffect, useState } from "react"
import { adminFetch } from "@/lib/admin-api"

interface Anthill {
  id: number
  name: string
  eggs: number
  larva: number
  ants: number
  antsBusy: number
  owner: { id: number; username: string }
  resources: { resource: { name: string }; stock: number }[]
  antsTotal: { ant: { name: string }; total: number; busy: number }[]
}

export default function AnthillsPage() {
  const [anthills, setAnthills] = useState<Anthill[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    adminFetch("antmaster/api/anthills").then((data) => {
      setAnthills(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-zinc-500 text-center py-12">Cargando hormigueros...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Hormigueros</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {anthills.map((hill) => (
          <div
            key={hill.id}
            className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all"
          >
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">{hill.name || `Hormiguero #${hill.id}`}</h3>
                  <p className="text-xs text-zinc-500 mt-1">Dueño: {hill.owner?.username || "—"}</p>
                </div>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/30">
                  #{hill.id}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Huevos", value: hill.eggs, icon: "🥚" },
                  { label: "Larvas", value: hill.larva, icon: "🐛" },
                  { label: "Hormigas", value: hill.ants, icon: "🐜" },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-black/40 rounded-xl p-3 border border-white/5">
                    <div className="text-lg">{icon}</div>
                    <div className="text-lg font-black text-white">{value ?? 0}</div>
                    <div className="text-[10px] text-zinc-500 uppercase">{label}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setExpanded(expanded === hill.id ? null : hill.id)}
                className="w-full text-xs font-bold text-zinc-400 hover:text-white bg-black/40 hover:bg-black/60 rounded-xl py-2 border border-white/5 transition-colors"
              >
                {expanded === hill.id ? "▲ Ocultar detalles" : "▼ Ver detalles"}
              </button>

              {expanded === hill.id && (
                <div className="space-y-4 pt-2 border-t border-white/5">
                  {hill.resources?.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Recursos</div>
                      <div className="space-y-1">
                        {hill.resources.map((r, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-zinc-400">{r.resource?.name || "—"}</span>
                            <span className="text-white font-bold">{r.stock}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {hill.antsTotal?.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Hormigas</div>
                      <div className="space-y-1">
                        {hill.antsTotal.map((a, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-zinc-400">{a.ant?.name || "—"}</span>
                            <span className="text-white font-bold">{a.total} <span className="text-zinc-500">({a.busy} ocupadas)</span></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
