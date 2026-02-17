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

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <NidoriaIcon className="text-primary" size={32} />
            <span className="font-bold text-xl text-foreground">Nidoria</span>
          </Link>

          {/* Navigation Links - Only Pre-register for now */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Button size="sm" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link href="/register">Pre-regístrate</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
