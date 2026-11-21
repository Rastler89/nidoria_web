"use client";
import { useState } from "react";
import useSWR from "swr";
import { ProtectedRoute } from "@/components/protected-route";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function RetosPage() {
  const { data, mutate, isLoading } = useSWR("/api/missions", fetcher);
  const [claiming, setClaiming] = useState<number | null>(null);

  const missions = Array.isArray(data) ? data : [];

  const claim = async (id: number) => {
    setClaiming(id);
    try {
      const res = await fetch(`/api/missions/${id}/claim`, { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "No se pudo reclamar");
      toast({ title: "Recompensa reclamada", description: "Se añadieron los recursos a tu colonia." });
      mutate();
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Error al reclamar", variant: "destructive" });
    } finally {
      setClaiming(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-12">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Misiones iniciales</h1>
            <p className="text-muted-foreground">Completa objetivos para recibir recursos de impulso.</p>
          </div>
          {isLoading && <p className="text-muted-foreground">Cargando...</p>}
          {!isLoading && missions.length === 0 && (
            <Card className="game-panel"><CardContent className="pt-6 text-muted-foreground">No hay misiones disponibles.</CardContent></Card>
          )}
          <div className="grid gap-4">
            {missions.map((m: any) => {
              const pct = m.target > 0 ? Math.min(100, Math.floor((m.current / m.target) * 100)) : 0;
              const missing = Math.max(0, Number(m.target) - Number(m.current));
              return (
                <Card key={m.id} className={`game-panel ${m.completed && !m.claimed ? "border-amber-500/60 ring-1 ring-amber-500/30" : ""}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {m.title}
                      {m.completed && !m.claimed && <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">Lista para reclamar</span>}
                    </CardTitle>
                    <CardDescription>{m.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progreso: <span className="font-semibold">{m.current}/{m.target}</span></span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                      {!m.completed && <p className="text-xs text-muted-foreground">Te faltan {missing} para completar.</p>}
                      {m.completed && !m.claimed && <p className="text-xs text-amber-400 font-medium">Recompensa disponible. ¡Reclámala!</p>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Recompensa: {m.rewardFood > 0 ? `+${m.rewardFood} comida ` : ""}{m.rewardWood > 0 ? `+${m.rewardWood} madera ` : ""}{m.rewardLead > 0 ? `+${m.rewardLead} hojas` : ""}{!m.rewardFood && !m.rewardWood && !m.rewardLead ? "Sin recompensa" : ""}
                    </div>
                    {m.claimed ? (
                      <Button disabled variant="outline">Reclamada</Button>
                    ) : (
                      <Button disabled={!m.completed || claiming === m.id} onClick={() => claim(m.id)}>
                        {claiming === m.id ? "Reclamando..." : "Reclamar recompensa"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
