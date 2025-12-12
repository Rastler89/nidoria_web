"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function WikiPage() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-foreground mb-3">Wiki de Nidoria</h1>
                    <p className="text-lg text-muted-foreground">Aprende todo sobre el mundo de las hormigas</p>
                </div>

                {/* WIKI navigation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Link 
                        href="/wiki/unidades"
                        className={cn(
                            "p-6 rounded-2xl border-2 transition-all hover:scale-105",
                            isActive("/wiki/unidades")
                             ? "border-primary bg-primary/10"
                             : "border-border bg-card hover:border-primary/50",
                        )}
                    >
                        <div className="text-4xl mb-3">🐜</div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Unidades</h2>
                        <p className="text-muted-foreground">
                            Descubre los diferentes tipos de hormigas soldados y sus características
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}