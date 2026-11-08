"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { section: "General", items: [
    { href: "/antmaster", label: "Dashboard", icon: "chart-line" },
  ]},
  { section: "Gestión de Juego", items: [
    { href: "/antmaster/anthills", label: "Hormigueros", icon: "home" },
    { href: "/antmaster/constructions", label: "Construcciones", icon: "hammer" },
    { href: "/antmaster/investigations", label: "Investigaciones", icon: "flask" },
    { href: "/antmaster/ants", label: "Tipos Hormigas", icon: "bug" },
    { href: "/antmaster/resources", label: "Recursos", icon: "box" },
    { href: "/antmaster/requirements", label: "Requerimientos", icon: "list-check" },
  ]},
  { section: "Social", items: [
    { href: "/antmaster/titles", label: "Títulos", icon: "medal" },
  ]},
  { section: "Mantenimiento", items: [
    { href: "/antmaster/tools", label: "Herramientas", icon: "wrench" },
    { href: "/antmaster/analysis", label: "Análisis", icon: "chart-pie" },
  ]},
  { section: "Sistema", items: [
    { href: "/antmaster/ai-manager", label: "IA Manager", icon: "robot" },
    { href: "/antmaster/users", label: "Usuarios", icon: "users" },
    { href: "/antmaster/queues", label: "Colas Redis", icon: "server" },
  ]},
]

const iconMap: Record<string, string> = {
  "chart-line": "📈",
  "home": "🏠",
  "hammer": "🔨",
  "flask": "🔬",
  "bug": "🐛",
  "box": "📦",
  "list-check": "📋",
  "medal": "🏅",
  "wrench": "🔧",
  "chart-pie": "📊",
  "robot": "🤖",
  "users": "👥",
  "server": "🖥️",
}

export default function AntMasterLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if ((user as any).role !== "admin") {
        router.push("/dashboard")
      } else {
        setAuthorized(true)
      }
    }
  }, [user, loading, router])

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      <aside className="w-[260px] bg-[#0c0c0e] border-r border-white/5 flex flex-col fixed h-screen z-40 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <Link href="/antmaster" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 tracking-tighter flex items-center gap-3">
            <span className="text-amber-500 text-2xl">🐜</span>
            <span>ANTMASTER</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-1">
          {navItems.map((group) => (
            <div key={group.section}>
              <div className="px-6 mt-4 mb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                {group.section}
              </div>
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-6 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500/10 to-transparent text-amber-400 border-r-2 border-amber-400"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="mr-3 w-5 text-center">{iconMap[item.icon] || "•"}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => { router.push("/antmaster"); }}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-xl text-sm font-semibold transition text-zinc-300"
          >
            <span className="mr-2">🔙</span> Volver al Juego
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <header className="bg-[#0c0c0e]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {navItems.flatMap(g => g.items).find(i => i.href === pathname)?.label || "Panel de Control"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-white">{(user as any)?.username || "Admin"}</div>
              <div className="text-[10px] text-amber-500 uppercase font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Super Administrador
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-900/40">
              👤
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  )
}
