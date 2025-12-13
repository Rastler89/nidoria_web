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
        habilidadEspecial: "<b>Lluvia Fórmica</b>: Ataque de área que reduce la defensa de las unidades impactadas por 2 turnos.",
        descripcion: "El Avispero Ácido es la unidad de artillería básica, pero esencial, de la Legión. Está compuesto por las obreras mayores de Formica rufa, conocidas en el mundo real como las Hormigas Rojas del Bosque.",
        tecnica: "Técnica de Combate: Su arma principal no es la mordida o el aguijón, sino la potente secreción de su glándula abdominal.",
        habilidad: "Se basa directamente en su defensa real. Estas hormigas son famosas por poder rociar ácido fórmico a distancias considerables (hasta 30 cm) para defender su hormiguero o paralizar a sus presas. Este ácido es corrosivo y sirve como un eficaz agente químico de combate, justificando la reducción de defensa en el juego.",
        impacto: "Impacto Ambiental: Son arquitectas increíbles. Sus colonias construyen enormes montículos con agujas de pino y tierra, que pueden alcanzar varios metros de altura, usándolos como una fortaleza solar. En el juego, esto simboliza la organización y el apoyo logístico detrás de esta unidad.",
        imagen: "/unidades/avispero_acido.png",
    }, {
        id: "bomba_melosa",
        nombre: "Bomba Melosa",
        categoria: "Artillería",
        vida: 35,
        defensa: 25,
        ataque: 60,
        habilidadEspecial: "<b>Sacrificio de Colapso</b>: Al morir, inflige 50 de daño de área y aplica un efecto de 'Ralentización' al enemigo.",
        descripcion: "La Bomba Melosa es una unidad de último recurso, venerada por su sacrificio en batalla. Estas obreras, de la especie Camponotus saundersi, poseen una habilidad defensiva que se convierte en una estrategia ofensiva devastadora en el juego.",
        tecnica: "Técnica de Combate: Su estrategia se llama autotisis. Estas hormigas obreras tienen glándulas mandibulares extremadamente grandes que se extienden por casi todo su cuerpo. Están llenas de una secreción defensiva pegajosa y tóxica.",
        habilidad: "Se basa directamente en la autotisis. Cuando la hormiga se siente amenazada de muerte, contrae violentamente sus músculos abdominales hasta que su cuerpo se rompe. Este acto libera la sustancia pegajosa tóxica en un chorro que inmoviliza y repele a los atacantes, justificando el daño de área y el efecto de 'Ralentización' (por el pegamento viscoso).",
        impacto: "Costo y Valor: Su bajo PV refleja su naturaleza inherentemente frágil y su destino: estas unidades no están destinadas a sobrevivir a un enfrentamiento. Su alto ATQ y efecto de área al morir representan la gran potencia de su carga química. El término 'Melosa' hace referencia a la sustancia interna que, aunque tóxica, es altamente viscosa y similar a un jarabe.",
        imagen: "/unidades/bomba_melosa.png",
    }, {
        id: "cazador_nomada",
        nombre: "Cazador Nómada",
        categoria: "Artillería",
        vida: 45,
        defensa: 35,
        ataque: 55,
        habilidadEspecial: "<b>Aguijón de Fuego</b>: 20% de probabilidad de infligir daño por quemadura durante 3 turnos (Daño en el Tiempo, DoT).",
        descripcion: "Los Cazadores Nómadas forman la vanguardia de las operaciones de asedio. Su capacidad para coordinar ataques masivos y su veneno cáustico los convierten en una amenaza persistente. Son reclutados de la especie invasora Solenopsis invicta, apodada con razón la 'Hormiga de Fuego'.",
        tecnica: "Técnica de Combate: A diferencia de muchas otras especies que solo muerden, las Solenopsis invicta utilizan sus mandíbulas para agarrar a la víctima y luego rotan su abdomen para inyectar repetidamente veneno con su aguijón.",
        habilidad: "El nombre 'Hormiga de Fuego' proviene de la intensa y duradera sensación de ardor que produce su veneno. Este veneno es alcaloide (solenopsina) y causa pústulas estériles, lo que se traduce directamente en el juego como un efecto de Daño en el Tiempo (DoT) o 'quemadura', que persiste más allá del ataque inicial. El veneno es tan efectivo que un pequeño porcentaje de ataques continuará causando estragos.",
        impacto: "Comportamiento Nómada: Su nombre de unidad refleja su naturaleza invasora y colonizadora. Son maestras en formar balsas vivientes al entrelazarse cuando hay inundaciones, una demostración de resistencia y coordinación colectiva.",
        imagen: "/unidades/cazador_nomada.png",
    }, {
        id: "francotirador_viscoso",
        nombre: "Francotirador Viscoso",
        categoria: "Artillería",
        vida: 50,
        defensa: 40,
        ataque: 60,
        habilidadEspecial: "<b>Tiro Paralizante</b>: 15% de probabilidad de aturdir al objetivo por un turno con su veneno neurotóxico.",
        descripcion: "El Francotirador Viscoso es el especialista de largo alcance de la legión, capaz de inmovilizar objetivos clave con una precisión mortal. Esta unidad toma su poder del veneno rápido y potente de la Myrmecia pilosula, un grupo conocido por su agresividad e impresionante capacidad visual.",
        tecnica: "Técnica de Combate: Las hormigas del género Myrmecia poseen una de las visiones más agudas entre todas las hormigas, lo que justifica su rol de 'Francotirador'. Aunque son grandes y agresivas, su ataque principal es a corta distancia, utilizando un aguijón para inyectar su veneno. Adaptamos esto al juego como un ataque de artillería de largo alcance y alta precisión.",
        habilidad: "El veneno de Myrmecia es potente y, en el mundo real, puede ser peligroso para los humanos (causando reacciones anafilácticas severas). El componente neurotóxico del veneno es el que inspira la habilidad Tiro Paralizante, ya que interfiere con el sistema nervioso de la víctima, causando un 'aturdimiento' o inmovilización temporal.",
        impacto: "Agresividad y Tamaño: Su alto PV y DEF, en comparación con otras unidades de artillería, reflejan el tamaño inusualmente grande y la naturaleza extremadamente territorial de estas hormigas.",
        imagen: "/unidades/francotirador_viscoso.png",
    }, {
        id: "catapulta_semillas",
        nombre: "Catapulta de Semillas",
        categoria: "Artillería",
        vida: 55,
        defensa: 45,
        ataque: 50,
        habilidadEspecial: "<b>Impacto Contundente</b>: Ataque que ignora el 30% de la armadura base del objetivo.",
        descripcion: "La Catapulta de Semillas es el ariete de la artillería, especializada en romper defensas fortificadas. Esta unidad está formada por los soldados mayores (Majors) de Pheidole megacephala, una especie conocida mundialmente por su naturaleza invasiva y sus cabezas desproporcionadamente grandes.",
        tecnica: "Técnica de Combate: Si bien las hormigas de este género son conocidas como hormigas cosechadoras (algunas especies usan sus mandíbulas para triturar semillas), la casta Mayor de Pheidole posee mandíbulas y músculos cefálicos masivos, diseñados para triturar objetos duros. Su poder reside en la fuerza bruta de su mordida.",
        habilidad: "Se inspira en esta tremenda fuerza de trituración. En lugar de lanzar químicos o venenos, lanzan proyectiles pequeños y densos con una potencia tremenda (como semillas o pequeños guijarros). El impacto es tan violento que, al igual que una trituradora, ignora o rompe una porción de la armadura (DEF) del enemigo. Su robustez se refleja en su PV y DEF, notablemente más altos que otras unidades de Artillería química.",
        impacto: "Dualidad de Castas: El nombre de la unidad se burla ligeramente de su función original (procesar semillas), reorientándola a una función militar: usar esa misma capacidad de trituración como un arma de asalto.",
        imagen: "/unidades/catapulta_semillas.png",
    }, {
        id: "cazador_nomada",
        nombre: "Cazador Nómada",
        categoria: "Artillería",
        vida: 45,
        defensa: 35,
        ataque: 55,
        habilidadEspecial: "Aguijón de Fuego",
        descripcion: "",
        tecnica: "",
        habilidad: "",
        impacto: "",
        imagen: "/unidades/bomba_melosa.png",
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
                                className={`p-3 rounded-xl text-center text-sm font-medium transtion-all ${categoriaSeleccionada === cat
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
                                    <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: unidad.habilidadEspecial }}></p>
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