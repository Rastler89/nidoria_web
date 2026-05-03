"use client"
import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Stats } from "@/components/stats"
import { useSocket } from "@/context/SocketContext"
import useSWR from "swr"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Input } from "@/components/ui/input"

const fetcher = (url: string) => fetch(url).then(r => r.json());

const formatTime = (seconds: number) => {
    if (!seconds) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);

    return parts.join(" ");
};

export default function UnidadesPage() {
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null)
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
    const { data: socketData } = useSocket()
    const { data: availableUnits, mutate } = useSWR('/api/ants', fetcher)

    const handleQuantityChange = (antId: number, val: string) => {
        const num = parseInt(val) || 0;
        setQuantities(prev => ({ ...prev, [antId]: Math.max(1, num) }));
    }

    const handleRecruit = async (antId: number) => {
        const quantity = quantities[antId] || 1;
        try {
            const res = await fetch('/api/ants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ antId, quantity })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Error al reclutar");
            }

            toast({
                title: "Reclutamiento iniciado",
                description: `Se han puesto en marcha ${quantity} unidades.`,
            });

            mutate();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "No se pudo iniciar el reclutamiento.",
                variant: "destructive"
            })
        }
    }

    const typeIcons: { [key: string]: string } = {
        ARTILLERY: "🏹",
        LIGHT: "🏃",
        WEIGHT: "🛡️",
        SPECIAL: "✨"
    };

    const typeNames: { [key: string]: string } = {
        ARTILLERY: "Artillería",
        LIGHT: "Ligera",
        WEIGHT: "Pesada",
        SPECIAL: "Especial"
    };

    const getOwnedCount = (code: string) => {
        const unit = socketData?.army?.find((a: any) => a.type === code || a.name.toLowerCase().includes(code.toLowerCase()));
        // El socket devuelve name y type (LIGHT, etc). Comparamos por nombre si no coincide el type.
        const unitByCode = socketData?.army?.find((a: any) => a.code === code);
        return unitByCode?.total || 0;
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background pb-12">
                <Navigation />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Stats />

                    {/* Banner Visual */}
                    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 border border-border shadow-lg">
                        <Image
                            src="/ant-colony-workers-building-tunnels.png"
                            alt="Barracones de la Colonia"
                            fill
                            className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2">
                                Cuartel de Reclutamiento
                            </h1>
                            <p className="text-white/90 text-lg max-w-2xl drop-shadow-sm">
                                Entrena y especializa a tus hormigas. Convierte obreras en poderosas guerreras para defender el nido o conquistar nuevos territorios.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold gradient-text">⚔️ Unidades Militares</h2>
                            <p className="text-muted-foreground">Gestiona el ejército de tu imperio</p>
                        </div>
                        <Link href="/dashboard">
                            <Button variant="outline" className="bg-background">
                                ← Volver al Centro de Comando
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Panel de Reclutamiento */}
                        <div className="xl:col-span-2 space-y-6">
                            <Card className="game-panel border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                                        🎖️ Unidades Disponibles
                                    </CardTitle>
                                    <CardDescription>Selecciona las unidades que deseas entrenar</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {availableUnits?.filter((u: any) => u.requirementsMet).map((u: any) => (
                                        <div
                                            key={`unit-${u.ant.id}`}
                                            className={`tech-node p-6 cursor-pointer transition-all hover:bg-accent/5 ${selectedUnit === u.ant.id ? "ring-2 ring-primary bg-accent/10" : "bg-card/50"
                                                }`}
                                            onClick={() => setSelectedUnit(u.ant.id)}
                                        >
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-2xl">{typeIcons[u.ant.type]}</span>
                                                        <h4 className="font-bold text-xl">{u.ant.name}</h4>
                                                        <Badge variant="outline" className="text-xs uppercase">
                                                            {typeNames[u.ant.type]}
                                                        </Badge>
                                                        {socketData?.army?.find((a: any) => a.name === u.ant.name) && (
                                                            <Badge variant="secondary" className="bg-primary/20 text-primary">
                                                                Posees: {socketData.army.find((a: any) => a.name === u.ant.name).total}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Ataque: <span className="text-red-400 font-bold">{u.ant.attack}</span> | 
                                                        Defensa: <span className="text-blue-400 font-bold">{u.ant.defense}</span> | 
                                                        Carga: <span className="text-yellow-400 font-bold">{u.ant.capacity}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
                                                <div>
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Coste por Unidad</p>
                                                    <div className="flex gap-2 text-sm flex-wrap">
                                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                                                            🍯 {u.cost.FOOD?.toLocaleString()}
                                                        </span>
                                                        {u.cost.WOOD > 0 && (
                                                            <span className="bg-secondary/10 text-secondary px-2 py-1 rounded text-xs font-medium">
                                                                🪵 {u.cost.WOOD?.toLocaleString()}
                                                            </span>
                                                        )}
                                                        {u.cost.LEAVES > 0 && (
                                                            <span className="bg-green-500/10 text-green-600 px-2 py-1 rounded text-xs font-medium">
                                                                🍃 {u.cost.LEAVES?.toLocaleString()}
                                                            </span>
                                                        )}
                                                        <span className="bg-orange-500/10 text-orange-600 px-2 py-1 rounded text-xs font-medium">
                                                            🐜 {u.cost.ANTS?.toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground">Cantidad:</span>
                                                        <Input 
                                                            type="number" 
                                                            min="1" 
                                                            className="w-20 h-8" 
                                                            value={quantities[u.ant.id] || 1}
                                                            onChange={(e) => handleQuantityChange(u.ant.id, e.target.value)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="w-full md:w-auto interactive-button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRecruit(u.ant.id);
                                                        }}
                                                        disabled={!u.resourcesMet}
                                                    >
                                                        Reclutar ({formatTime(u.cost.time * (quantities[u.ant.id] || 1))})
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Unidades Bloqueadas */}
                            <Card className="game-panel opacity-90">
                                <CardHeader>
                                    <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                                        🔒 Unidades de Elite
                                    </CardTitle>
                                    <CardDescription>Requieren investigaciones avanzadas o edificios específicos</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {availableUnits?.filter((u: any) => !u.requirementsMet).map((u: any) => (
                                        <div key={`locked-${u.ant.id}`} className="tech-node locked p-6 bg-muted/20 border-dashed border-2 border-muted">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="grayscale opacity-50 text-2xl">{typeIcons[u.ant.type]}</span>
                                                        <h4 className="font-bold text-xl text-muted-foreground">{u.ant.name}</h4>
                                                        <Badge variant="outline" className="text-xs">Bloqueado</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                                                <p className="text-xs text-destructive font-bold flex items-center gap-2 mb-2">
                                                    🚫 Requiere:
                                                </p>
                                                <ul className="list-disc list-inside ml-4 space-y-1">
                                                    {u.requirements.map((req: any) => (
                                                        <li key={req.id} className="text-sm text-muted-foreground">
                                                            <span className="font-semibold">{req.requiredName}</span> - Nivel: {req.requiredLevel}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Panel Lateral: Ejército Actual */}
                        <div className="space-y-6">
                            <Card className="game-panel sticky top-24">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        🚩 Ejército Actual
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {socketData?.army?.length > 0 ? (
                                        <div className="space-y-3">
                                            {socketData.army.map((unit: any, idx: number) => (
                                                <div key={`owned-${idx}`} className="p-3 bg-secondary/5 border border-border rounded-lg flex justify-between items-center">
                                                    <div>
                                                        <p className="font-bold">{unit.name}</p>
                                                        <p className="text-xs text-muted-foreground uppercase">{typeNames[unit.type] || unit.type}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-primary">{unit.total}</p>
                                                        {unit.busy > 0 && <p className="text-[10px] text-orange-400">Ocupadas: {unit.busy}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground italic">
                                            No tienes unidades especializadas aún.
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-border mt-4">
                                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                            <h3 className="font-bold text-sm mb-2">Total Población</h3>
                                            <div className="flex justify-between items-end mb-1">
                                                <span className="text-2xl font-bold text-primary">
                                                    {(socketData?.stats?.eggs || 0) + (socketData?.stats?.larva || 0) + (socketData?.stats?.ants || 0) + (socketData?.army?.reduce((acc: number, u: any) => acc + u.total, 0) || 0)}
                                                </span>
                                                <span className="text-muted-foreground text-sm">/ {socketData?.popMax || 50}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary transition-all duration-500" 
                                                    style={{ width: `${Math.min(100, (((socketData?.stats?.eggs || 0) + (socketData?.stats?.larva || 0) + (socketData?.stats?.ants || 0) + (socketData?.army?.reduce((acc: number, u: any) => acc + u.total, 0) || 0)) / (socketData?.popMax || 50)) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
