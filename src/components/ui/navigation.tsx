"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./button"
import { NidoriaIcon } from "./nidoria-icon"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => pathname === path
console.log(user);
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <NidoriaIcon className="text-primary" size={32} />
            <span className="font-bold text-xl text-foreground">Nidoria</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/explore"
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                isActive("/explore")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              Explorar
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                    isActive("/dashboard")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  Panel
                </Link>
                <span className="text-sm text-muted-foreground">Bienvenido, {user.username}</span>
                <Button variant="outline" size="sm" className="rounded-xl bg-transparent" onClick={logout}>
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="rounded-xl" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" className="rounded-xl" asChild>
                  <Link href="/register">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
