"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"

interface Unidad {
    id: string
    nombre: string
    categoria: string
    vida: number
    defensa: number
    ataque: number
    habilidadEspecial: string
    descripcion: string
    tecnica: string
    habilidad: string
    impacto: string
    imagen: string
}

const unidades: Unidad[] = [
  {
    id: "avispero_acido",
    nombre: "Avíspero Acido",
    categoria: "Artillería",
    vida: 40,
    defensa: 30,
    ataque: 65,
    habilidadEspecial: "LLuvia Fórmica",
    descripcion: "El Avispero Ácido es la unidad de artillería básica, pero esencial, de la Legión. Está compuesto por las obreras mayores de Formica rufa, conocidas en el mundo real como las Hormigas Rojas del Bosque.",
    tecnica: "Técnica de Combate: Su arma principal no es la mordida o el aguijón, sino la potente secreción de su glándula abdominal.",
    habilidad:   "Se basa directamente en su defensa real. Estas hormigas son famosas por poder rociar ácido fórmico a distancias considerables (hasta 30 cm) para defender su hormiguero o paralizar a sus presas. Este ácido es corrosivo y sirve como un eficaz agente químico de combate, justificando la reducción de defensa en el juego.",
    impacto:  "Impacto Ambiental: Son arquitectas increíbles. Sus colonias construyen enormes montículos con agujas de pino y tierra, que pueden alcanzar varios metros de altura, usándolos como una fortaleza solar. En el juego, esto simboliza la organización y el apoyo logístico detrás de esta unidad.",
    imagen: "/unidades/avispero_acido.png",
  }
]

const categorias = ["Infantería Ligera", "Infantería Pesada", "Artillería", "Especializada"]

const coloresPorCategoria: { [key: string]: string } = {
  "Infantería Ligera": "bg-blue-500/20 border-blue-500/50 text-blue-300",
  "Infantería Pesada": "bg-red-500/20 border-red-500/50 text-red-300",
  Artillería: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
  Especializada: "bg-purple-500/20 border-purple-500/50 text-purple-300",
}

export default function UnidadesPage() {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null)

    const unidadesFiltradas = categoriaSeleccionada
     ? unidades.filter((u) => u.categoria === categoriaSeleccionada)
     : unidades

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/wiki">
                        <Button variant="ghost" size="icon" className="rounded-xl">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">Unidades de Nidoria</h1>
                        <p className="text-muted-foreground mt-2">Conoce todos los tipos de hormigas soldado</p>
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Categorías</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {categorias.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoriaSeleccionada(categoriaSeleccionada === cat ? null : cat)}
                                className={`p-3 rounded-xl text-center text-sm font-medium transtion-all ${
                                    categoriaSeleccionada === cat
                                     ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105"
                                     : "bg-card border border-border text-muted-foreground hover:border-primary/50"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Units Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {unidadesFiltradas.map((unidad) => (
                        <div
                            key={unidad.id}
                            className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg"
                        >
                            {/* Unit Image */}
                            <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                                <img 
                                    src={unidad.imagen}
                                    alt={unidad.nombre}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Unit Info */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground">{unidad.nombre}</h3>
                                        <p className="text-sm text-primary font-medium">{unidad.categoria}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-lg text-xs font-semibold border ${coloresPorCategoria[unidad.categoria]}`}
                                    >
                                        {unidad.categoria}
                                    </span>
                                </div>

                                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{unidad.descripcion}</p>
                                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{unidad.tecnica}</p>
                                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{unidad.impacto}</p>

                                {/* Stats */}
                                <div className="grid grid-cols-4 gap-3 mb-6">
                                    <div className="bg-accent/10 rounded-xl p-3 text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Vida</div>
                                        <div className="text-lg font-bold text-foreground">{unidad.vida}</div>
                                    </div>
                                    <div className="bg-accent/10 rounded-xl p-3 text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Defensa</div>
                                        <div className="text-lg font-bold text-foreground">{unidad.defensa}</div>
                                    </div>
                                    <div className="bg-accent/10 rounded-xl p-3 text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Ataque</div>
                                        <div className="text-lg font-bold text-foreground">{unidad.ataque}</div>
                                    </div>
                                    <div className="bg-accent/10 rounded-xl p-3 text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Velocidad</div>
                                        <div className="text-lg font-bold text-foreground">15</div>
                                    </div>
                                </div>

                                {/* Special Ability */}
                                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                                    <h4 className="font-bold text-primary mb-2 text-sm">Habilidad Especial</h4>
                                    <p className="text-sm text-muted-foreground">{unidad.habilidadEspecial}</p>
                                    <p className="text-sm text-muted-foreground">{unidad.habilidad}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}