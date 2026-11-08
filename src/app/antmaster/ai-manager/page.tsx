"use client"

import { useState, useRef, useEffect } from "react"
import { adminFetch } from "@/lib/admin-api"

export default function AiManagerPage() {
  const [bots, setBots] = useState<any[]>([])
  const [selectedBot, setSelectedBot] = useState<any | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [iterations, setIterations] = useState(100)
  const [delay, setDelay] = useState(1000)
  const terminalRef = useRef<HTMLDivElement>(null)

  const addLog = (msg: string, type = "info") => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  const stressTest = async () => {
    addLog("🚀 Iniciando stress test...", "thinking")
    for (let i = 0; i < iterations; i++) {
      try {
        await adminFetch("antmaster/api/summary")
        addLog(`✅ Iteración ${i + 1}/${iterations} completada`)
      } catch (e: any) {
        addLog(`❌ Iteración ${i + 1}/${iterations} fallida: ${e.message}`, "error")
      }
      await new Promise((r) => setTimeout(r, delay))
    }
    addLog("🏁 Stress test finalizado", "success")
  }

  return (
    <div className="flex h-[calc(100vh-120px)] -m-8">
      {/* Bot List Sidebar */}
      <aside className="w-72 bg-[#0c0c0e]/80 backdrop-blur-md border-r border-white/5 flex flex-col p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <h2 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2">
            <span>🌐</span> Bots Activos
          </h2>
          <button className="text-cyan-500 hover:text-cyan-300 transition-colors text-lg">+</button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {bots.length === 0 && (
            <p className="text-zinc-600 text-xs text-center py-10">Ningún bot operando...</p>
          )}
        </div>
        <div className="border-t border-white/5 pt-5 space-y-3">
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Configuración de Test</div>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                value={iterations}
                onChange={(e) => setIterations(Number(e.target.value))}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 outline-none focus:border-cyan-500/50"
                title="Iteraciones"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 outline-none focus:border-cyan-500/50"
                title="Delay (ms)"
              />
            </div>
          </div>
          <button
            onClick={stressTest}
            className="w-full bg-gradient-to-r from-red-600/20 to-red-900/20 hover:from-red-600/40 hover:to-red-900/40 text-red-400 font-bold py-3 px-4 rounded-xl border border-red-500/30 transition-all text-[9px] uppercase tracking-widest flex justify-center items-center gap-2"
          >
            🚀 Stress Test ({iterations})
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col p-8 bg-[#050505]/95 overflow-hidden">
        {/* Terminal */}
        <div className="flex-1 bg-[#050507] rounded-3xl border border-white/10 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-zinc-900 to-[#0c0c0e] px-5 py-3 border-b border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-mono text-cyan-500/70 font-bold uppercase tracking-widest flex items-center gap-2">
              <span>💻</span> bot-core.log
            </span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
          </div>
          <div
            ref={terminalRef}
            className="flex-1 p-5 font-mono text-xs overflow-y-auto space-y-1 custom-scrollbar"
          >
            {logs.length === 0 ? (
              <p className="text-zinc-700 italic">Terminal lista. Usa Stress Test o conecta un bot para comenzar.</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-zinc-400">
                  <span className="text-zinc-600">{log}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
