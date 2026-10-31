"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./button"
import { NidoriaIcon } from "./nidoria-icon"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { AccessibilityMenu } from "@/components/accessibility-menu"
import { LogOut, Mail, Menu, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/** Secciones del juego, visibles con la sesión iniciada. */
const GAME_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/construcciones", label: "Construcciones" },
  { href: "/dashboard/investigaciones", label: "Investigaciones" },
  { href: "/dashboard/misiones", label: "Exploraciones" },
  { href: "/dashboard/unidades", label: "Unidades" },
  { href: "/dashboard/ranking", label: "Ranking" },
]

/** Páginas públicas para quien no ha iniciado sesión. */
const PUBLIC_LINKS = [
  { href: "/explore", label: "Explorar" },
  { href: "/wiki", label: "Wiki" },
]

export function Navigation() {
  const pathname = usePathname()
  const { user, logout, loading } = useAuth()

  const isActive = (path: string) => pathname === path
  const links = user ? GAME_LINKS : PUBLIC_LINKS

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <NidoriaIcon className="text-primary" size={32} />
            <span className="font-bold text-xl text-foreground">Nidoria</span>
          </Link>

          <div className="flex items-center gap-2 md:gap-6">
            {/* Enlaces de escritorio */}
            <div className="hidden md:flex items-center gap-6">
              {!loading &&
                links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      isActive(link.href) ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <AccessibilityMenu />

              {/* Acciones de escritorio */}
              <div className="hidden md:flex items-center gap-3">
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
                        <Link href="/register">Crear cuenta</Link>
                      </Button>
                    </>
                  )
                )}
              </div>

              {/* Menú de móvil: en pantallas pequeñas los enlaces y las
                  acciones no caben en la barra, así que se agrupan aquí. */}
              {!loading && (
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        aria-label="Abrir menú de navegación"
                      >
                        <Menu className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-60 md:hidden">
                      <DropdownMenuLabel className="truncate">
                        {user ? `Hola, ${user.username}` : "Navegación"}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {links.map((link) => (
                        <DropdownMenuItem
                          key={link.href}
                          asChild
                          className={cn(isActive(link.href) && "text-primary font-medium")}
                        >
                          <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                      ))}

                      <DropdownMenuSeparator />

                      {user ? (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard/correos">
                              <Mail />
                              Correos
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard/perfil">
                              <User />
                              Perfil
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => logout()}
                            className="text-destructive focus:text-destructive"
                          >
                            <LogOut />
                            Cerrar sesión
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/login">Iniciar sesión</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/register">Crear cuenta</Link>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
