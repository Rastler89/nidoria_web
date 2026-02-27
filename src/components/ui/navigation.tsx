"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./button"
import { NidoriaIcon } from "./nidoria-icon"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { AccessibilityMenu } from "@/components/accessibility-menu"
import { Mail, User } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()

  const isActive = (path: string) => pathname === path

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
          <div className="flex items-center gap-6">
            {!loading && user ? (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/construcciones"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/dashboard/construcciones") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Construcciones
                </Link>
                <Link
                  href="/dashboard/investigaciones"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/dashboard/investigaciones") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Investigaciones
                </Link>
                <Link
                  href="/dashboard/misiones"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/dashboard/misiones") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Exploraciones
                </Link>
                <Link
                  href="/dashboard/ejercito"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/dashboard/ejercito") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Unidades
                </Link>
                <Link
                  href="/dashboard/ranking"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/dashboard/ranking") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Ranking
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/explore"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/explore") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Explorar
                </Link>
                <Link
                  href="/wiki"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    isActive("/wiki") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Wiki
                </Link>
              </div>
            )}

            <div className="flex items-center gap-3">
              <AccessibilityMenu />
              {!loading && (
                user ? (
                  <>
                    <Button variant="ghost" size="icon" asChild title="Correos">
                      <Link href="/dashboard/correos">
                        <Mail className="h-5 w-5" />
                      </Link>
                    </Button>
                    <div className="flex items-center gap-2 border-l pl-4 ml-2">
                      <Button variant="ghost" size="sm" asChild className="gap-2">
                        <Link href="/dashboard/perfil">
                           <User className="h-4 w-4" />
                           <span>{user.username}</span>
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => logout()}>
                        Cerrar sesión
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">Iniciar sesión</Link>
                    </Button>
                    <Button size="sm" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                      <Link href="/register">Pre-regístrate</Link>
                    </Button>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
