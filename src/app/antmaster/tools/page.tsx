"use client"

import { useState } from "react"
import { adminFetch } from "@/lib/admin-api"

export default function ToolsPage() {
  const [queueName, setQueueName] = useState("cria")
  const [jobName, setJobName] = useState("")
  const [payload, setPayload] = useState("{}")
  const [result, setResult] = useState<string | null>(null)

  const triggerJob = async () => {
    try {
      const data = JSON.parse(payload)
      const res = await adminFetch("antmaster/api/tools/trigger-job", {
        method: "POST",
        body: JSON.stringify({ queueName, jobName, data }),
      })
      setResult(JSON.stringify(res, null, 2))
    } catch (e: any) {
      setResult(`Error: ${e.message}`)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-amber-500 mb-6 flex items-center gap-3">
          <span className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">⚡</span>
          Inyector de Trabajos (Redis)
        </h3>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Cola Destino</label>
            <select
              value={queueName}
              onChange={(e) => setQueueName(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:border-amber-500/50 outline-none transition-all"
            >
              {["cria", "construccion", "investigation", "ataques", "exploraciones", "consumo", "reclutamiento"].map((q) => (
                <option key={q} value={q} className="bg-zinc-900">{q}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Nombre del Job</label>
            <input
              type="text"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              placeholder="ej. produce_eggs"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 focus:border-amber-500/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Payload (JSON)</label>
            <textarea
              rows={5}
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-zinc-200 placeholder-zinc-700 focus:border-amber-500/50 outline-none transition-all"
            />
          </div>
          <button
            onClick={triggerJob}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 rounded-xl border border-amber-500/30 transition-all flex justify-center items-center gap-2"
          >
            ⚡ Inyectar Job
          </button>
          {result && (
            <pre className="bg-black/60 rounded-xl p-4 text-xs font-mono text-green-400 overflow-x-auto border border-white/5">
              {result}
            </pre>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-amber-500 mb-6 flex items-center gap-3">
          <span className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">🔧</span>
          Herramientas Rápidas
        </h3>
        <p className="text-zinc-500 text-sm">Más herramientas disponibles próximamente.</p>
      </div>
    </div>
  )
}
