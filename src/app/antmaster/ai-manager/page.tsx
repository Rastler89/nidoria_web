"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { adminFetch } from "@/lib/admin-api"
import { useSocket } from "@/context/SocketContext"

interface BotStats {
  totalActions: number
  success: number
  failures: number
  unexpectedErrors: number
}

interface BotResources {
  eggs?: number
  larva?: number
  ants?: number
  antsBusy?: number
  resources?: { type: string; stock: number }[]
}

interface BotHistoryItem {
  name: string
  status: number
  expected: boolean
  url: string
  thinking?: string
  timestamp?: number
}

interface BotState {
  username: string
  userId?: number | null
  token?: boolean
  resources?: BotResources | null
  stats?: BotStats
  personality?: string
  goal?: string
  isRunning?: boolean
  isWaiting?: boolean
  level?: number
  xp?: number
  xpNeeded?: number
  foodTrend?: string
  lastThinking?: string
  history?: BotHistoryItem[]
}

interface LogEntry {
  botName: string
  message: string
  type: string
  timestamp: number
}

const PERSONALITIES = ["Aleatorio", "Explorador", "Seguridad", "Cauto", "Industrioso"]

const FORCE_ACTIONS = [
  { label: "Recursos", action: "Recursos" },
  { label: "Misión", action: "Misión" },
  { label: "Construir", action: "Construir" },
  { label: "Investigar", action: "Investigar" },
  { label: "Reclutar", action: "Reclutar" },
  { label: "Perfil", action: "Perfil" },
  { label: "Salud", action: "Salud" },
  { label: "Refresh", action: "Refresh" },
]

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString("es-ES", { hour12: false })
}

function logColor(type: string) {
  switch (type) {
    case "success":
      return "text-green-400"
    case "warn":
      return "text-amber-400"
    case "error":
      return "text-red-400"
    case "thinking":
      return "text-cyan-400"
    default:
      return "text-zinc-400"
  }
}

function statusColor(expected: boolean, status: number) {
  if (expected) return "text-green-400"
  if (status >= 500) return "text-red-400"
  return "text-amber-400"
}

export default function AiManagerPage() {
  const { socket } = useSocket()
  const [bots, setBots] = useState<BotState[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [stressRunning, setStressRunning] = useState(false)
  const [form, setForm] = useState({
    username: "",
    password: "Password123!",
    iterations: "50",
    delay: "800",
    personality: "Aleatorio",
    isResume: false,
  })

  const terminalRef = useRef<HTMLDivElement>(null)
  const selectedBot = bots.find((bot) => bot.username === selected) ?? null

  const loadBots = async () => {
    try {
      const data = await adminFetch("ai/players")
      const list: BotState[] = Array.isArray(data) ? data : []
      setBots(list)
      setSelected((prev) => prev ?? list[0]?.username ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los bots.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBots()
  }, [])

  useEffect(() => {
    if (!socket) return

    const onLog = (entry: LogEntry) => {
      setLogs((prev) => [...prev.slice(-299), entry])
    }

    const onState = (payload: any) => {
      const { botName, ...state } = payload
      const username = state.username || botName
      if (!username) return

      setBots((prev) => {
        const rest = prev.filter((bot) => bot.username !== username)
        return [{ ...state, username }, ...rest]
      })
      setSelected((prev) => prev ?? username)
    }

    socket.on("log", onLog)
    socket.on("state", onState)

    return () => {
      socket.off("log", onLog)
      socket.off("state", onState)
    }
  }, [socket])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  const startBot = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setStarting(true)

    try {
      const baseUrl = (process.env.NEXT_PUBLIC_DB_HOST || "http://127.0.0.1:4000").replace(/\/+$/, "")
      const payload = {
        baseUrl,
        iterations: Math.max(1, Number(form.iterations) || 1),
        delay: Math.max(0, Number(form.delay) || 0),
        username: form.username.trim() || undefined,
        password: form.password || undefined,
        isResume: form.isResume,
        personality: form.personality,
      }

      const res = await adminFetch("ai/start", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      setSelected(res.username)
      setLogs((prev) => [
        ...prev,
        {
          botName: res.username,
          message: `Bot lanzado (${payload.iterations} iteraciones, ${payload.delay}ms)`,
          type: "info",
          timestamp: Date.now(),
        },
      ])
      await loadBots()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo lanzar el bot.")
    } finally {
      setStarting(false)
    }
  }

  const stopBot = async (username: string) => {
    try {
      await adminFetch(`ai/stop/${encodeURIComponent(username)}`, { method: "POST" })
      await loadBots()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo detener el bot.")
    }
  }

  const deleteBot = async (username: string) => {
    if (!confirm(`¿Eliminar el bot ${username}?`)) return
    try {
      await adminFetch(`ai/delete/${encodeURIComponent(username)}`, { method: "POST" })
      setBots((prev) => prev.filter((bot) => bot.username !== username))
      setSelected((prev) => (prev === username ? null : prev))
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el bot.")
    }
  }

  const forceAction = async (username: string, action: string) => {
    try {
      await adminFetch(`ai/force/${encodeURIComponent(username)}/${encodeURIComponent(action)}`, {
        method: "POST",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo ejecutar la acción.")
    }
  }

  const stressTest = async () => {
    const iterations = Math.max(1, Number(form.iterations) || 1)
    const delay = Math.max(0, Number(form.delay) || 0)
    setStressRunning(true)
    setLogs((prev) => [
      ...prev,
      {
        botName: "stress",
        message: `Stress test: ${iterations} peticiones a /antmaster/api/summary`,
        type: "info",
        timestamp: Date.now(),
      },
    ])

    for (let i = 0; i < iterations; i++) {
      try {
        await adminFetch("antmaster/api/summary")
        setLogs((prev) => [
          ...prev,
          {
            botName: "stress",
            message: `Iteración ${i + 1}/${iterations} OK`,
            type: "success",
            timestamp: Date.now(),
          },
        ])
      } catch (err) {
        setLogs((prev) => [
          ...prev,
          {
            botName: "stress",
            message: `Iteración ${i + 1}/${iterations} falló: ${err instanceof Error ? err.message : "error"}`,
            type: "error",
            timestamp: Date.now(),
          },
        ])
      }
      if (i < iterations - 1) await new Promise((resolve) => setTimeout(resolve, delay))
    }

    setStressRunning(false)
  }

  const resourceStock = (type: string) =>
    selectedBot?.resources?.resources?.find((resource) => resource.type === type)?.stock ?? "--"

  return (
    <div className="flex h-[calc(100vh-120px)] -m-8">
      <aside className="w-80 bg-[#0c0c0e]/80 backdrop-blur-md border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2">
            <span>🌐</span> Bots activos
          </h2>
          <p className="text-[10px] text-zinc-500 mt-1">{bots.length} registrados en esta API</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {loading ? (
            <p className="text-zinc-600 text-xs text-center py-10">Cargando bots...</p>
          ) : bots.length === 0 ? (
            <p className="text-zinc-600 text-xs text-center py-10">Ningún bot operando...</p>
          ) : (
            bots.map((bot) => (
              <button
                key={bot.username}
                onClick={() => setSelected(bot.username)}
                className={`w-full text-left rounded-2xl border px-4 py-3 transition-all ${
                  selected === bot.username
                    ? "border-cyan-500/40 bg-cyan-500/10"
                    : "border-white/5 bg-black/20 hover:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-white truncate">{bot.username}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      bot.isRunning
                        ? "text-green-400 bg-green-500/10 border-green-500/30"
                        : "text-zinc-400 bg-zinc-500/10 border-zinc-500/30"
                    }`}
                  >
                    {bot.isRunning ? "ACTIVO" : "PARADO"}
                  </span>
                </div>
                <div className="mt-1 text-[10px] text-zinc-500">
                  {bot.goal ?? "AUDITAR"} · {bot.personality ?? "—"} · Nv {bot.level ?? 1}
                </div>
              </button>
            ))
          )}
        </div>

        <form onSubmit={startBot} className="border-t border-white/5 p-4 space-y-3">
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
            Lanzar bot
          </div>

          <input
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            placeholder="Usuario (vacío = bot_XXXX)"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 outline-none focus:border-cyan-500/50"
          />
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Contraseña"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 outline-none focus:border-cyan-500/50"
          />

          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={form.iterations}
              onChange={(event) => setForm({ ...form, iterations: event.target.value })}
              title="Iteraciones"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 outline-none focus:border-cyan-500/50"
            />
            <input
              type="number"
              min={0}
              value={form.delay}
              onChange={(event) => setForm({ ...form, delay: event.target.value })}
              title="Delay (ms)"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 outline-none focus:border-cyan-500/50"
            />
          </div>

          <select
            value={form.personality}
            onChange={(event) => setForm({ ...form, personality: event.target.value })}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none focus:border-cyan-500/50"
          >
            {PERSONALITIES.map((personality) => (
              <option key={personality} value={personality} className="bg-zinc-900">
                {personality}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-[10px] text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isResume}
              onChange={(event) => setForm({ ...form, isResume: event.target.checked })}
              className="w-3.5 h-3.5 accent-cyan-500"
            />
            Reanudar sesión existente
          </label>

          {!form.isResume && (
            <p className="text-[9px] text-amber-500/80 leading-relaxed">
              Un bot nuevo se registra, pero necesita verificación y cuenta activa. Para probar ya,
              marca “Reanudar” con una cuenta existente.
            </p>
          )}

          {error && (
            <p className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={starting}
            className="w-full bg-gradient-to-r from-cyan-600/30 to-cyan-900/30 hover:from-cyan-600/50 hover:to-cyan-900/50 disabled:opacity-50 text-cyan-300 font-bold py-2.5 px-4 rounded-xl border border-cyan-500/30 transition-all text-[9px] uppercase tracking-widest"
          >
            {starting ? "Lanzando..." : "🚀 Iniciar bot"}
          </button>

          <button
            type="button"
            onClick={stressTest}
            disabled={stressRunning}
            className="w-full bg-gradient-to-r from-red-600/20 to-red-900/20 hover:from-red-600/40 hover:to-red-900/40 disabled:opacity-50 text-red-400 font-bold py-2.5 px-4 rounded-xl border border-red-500/30 transition-all text-[9px] uppercase tracking-widest"
          >
            {stressRunning ? "Ejecutando..." : `🧪 Stress test (${form.iterations})`}
          </button>
        </form>
      </aside>

      <main className="flex-1 flex flex-col p-8 bg-[#050505]/95 overflow-hidden gap-4">
        {selectedBot ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="font-mono">{selectedBot.username}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      selectedBot.isRunning
                        ? "text-green-400 bg-green-500/10 border-green-500/30"
                        : "text-zinc-400 bg-zinc-500/10 border-zinc-500/30"
                    }`}
                  >
                    {selectedBot.isRunning ? "ACTIVO" : "PARADO"}
                  </span>
                </h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                  {selectedBot.goal ?? "AUDITAR"} · {selectedBot.personality ?? "—"} · Nivel{" "}
                  {selectedBot.level ?? 1} · XP {selectedBot.xp ?? 0}/{selectedBot.xpNeeded ?? 100}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => stopBot(selectedBot.username)}
                  disabled={!selectedBot.isRunning}
                  className="text-[10px] font-bold px-4 py-2 rounded-xl border border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Detener
                </button>
                <button
                  onClick={() => deleteBot(selectedBot.username)}
                  className="text-[10px] font-bold px-4 py-2 rounded-xl border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
              {[
                { label: "Acciones", value: selectedBot.stats?.totalActions ?? 0 },
                { label: "Éxitos", value: selectedBot.stats?.success ?? 0 },
                { label: "Fallos", value: selectedBot.stats?.failures ?? 0 },
                { label: "Críticos", value: selectedBot.stats?.unexpectedErrors ?? 0 },
                { label: "Huevos", value: selectedBot.resources?.eggs ?? "--" },
                { label: "Obreras", value: selectedBot.resources?.ants ?? "--" },
                { label: "Comida", value: resourceStock("FOOD") },
                { label: "Madera", value: resourceStock("WOOD") },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/5 bg-black/30 px-3 py-3">
                  <div className="text-[9px] uppercase tracking-widest text-zinc-500">{stat.label}</div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {FORCE_ACTIONS.map((item) => (
                <button
                  key={item.action}
                  onClick={() => forceAction(selectedBot.username, item.action)}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/10 text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {selectedBot.lastThinking && (
              <div className="text-[11px] text-cyan-300/80 bg-cyan-500/5 border border-cyan-500/20 rounded-xl px-4 py-2">
                🧠 {selectedBot.lastThinking}
              </div>
            )}

            <div className="flex-1 bg-[#050507] rounded-3xl border border-white/10 flex flex-col overflow-hidden min-h-0">
              <div className="bg-gradient-to-r from-zinc-900 to-[#0c0c0e] px-5 py-3 border-b border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-mono text-cyan-500/70 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span>💻</span> bot-core.log
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLogs([])}
                    className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Limpiar
                  </button>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                  </div>
                </div>
              </div>
              <div
                ref={terminalRef}
                className="flex-1 p-5 font-mono text-xs overflow-y-auto space-y-1 custom-scrollbar"
              >
                {logs.length === 0 ? (
                  <p className="text-zinc-700 italic">
                    Terminal lista. Lanza un bot o usa una acción forzada para ver actividad.
                  </p>
                ) : (
                  logs.map((log, index) => (
                    <div key={`${log.timestamp}-${index}`} className="flex gap-2">
                      <span className="text-zinc-600 shrink-0">{formatTime(log.timestamp)}</span>
                      <span className="text-zinc-500 shrink-0">[{log.botName}]</span>
                      <span className={logColor(log.type)}>{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="max-h-40 overflow-y-auto custom-scrollbar rounded-2xl border border-white/5 bg-black/20">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-black/40 text-[9px] uppercase tracking-widest text-zinc-500">
                  <tr>
                    <th className="px-4 py-2">Acción</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2">Resultado</th>
                    <th className="px-4 py-2">Ruta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(selectedBot.history ?? []).slice(-8).reverse().map((item, index) => (
                    <tr key={`${item.timestamp ?? index}-${index}`}>
                      <td className="px-4 py-2 text-zinc-300">{item.name}</td>
                      <td className={`px-4 py-2 font-mono ${statusColor(item.expected, item.status)}`}>
                        {item.status}
                      </td>
                      <td className={`px-4 py-2 ${item.expected ? "text-green-400" : "text-amber-400"}`}>
                        {item.expected ? "OK" : "Fallo"}
                      </td>
                      <td className="px-4 py-2 text-zinc-500 font-mono">{item.url}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <p className="text-4xl mb-4">🤖</p>
              <p className="text-zinc-400 text-sm">
                No hay ningún bot seleccionado. Lanza uno desde el panel izquierdo.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
