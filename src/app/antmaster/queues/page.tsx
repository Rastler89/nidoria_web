"use client"

import { useEffect, useState } from "react"
import { adminFetch } from "@/lib/admin-api"

export default function QueuesPage() {
  const [queues, setQueues] = useState<any>(null)

  useEffect(() => {
    adminFetch("antmaster/api/queues-stats").then(setQueues)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Colas Redis / BullMQ</h2>
        <button
          onClick={() => adminFetch("antmaster/api/queues-stats").then(setQueues)}
          className="text-xs bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-4 py-2 rounded-full border border-amber-500/30 transition-all"
        >
          ↻ Sincronizar
        </button>
      </div>

      <div className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
        <iframe
          src={`${process.env.NEXT_PUBLIC_DB_HOST || "http://127.0.0.1:4000"}/queues`}
          className="w-full h-[600px] rounded-2xl border border-white/5 bg-white/5"
          title="Bull Board"
        />
        <p className="text-[10px] text-zinc-600 text-center mt-4">
          Panel de Bull Board embebido desde el servidor NestJS
        </p>
      </div>

      {queues && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(queues).map(([name, stats]: [string, any]) => (
            <div key={name} className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 border border-white/5 rounded-2xl p-5 text-center space-y-2">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{name}</div>
              <div className="space-y-1">
                {[
                  ["waiting", "🔵", "text-blue-400"],
                  ["active", "🟢", "text-green-400"],
                  ["completed", "✅", "text-zinc-400"],
                  ["failed", "❌", "text-red-400"],
                  ["delayed", "🟡", "text-yellow-400"],
                ].map(([key, emoji, color]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span>{emoji} {key}</span>
                    <span className={`font-bold ${(stats as any)[key] > 0 ? color : "text-zinc-700"}`}>{(stats as any)[key]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
