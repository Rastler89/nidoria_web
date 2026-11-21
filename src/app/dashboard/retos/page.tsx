"use client";
import { useState } from "react";
import useSWR from "swr";
import { ProtectedRoute } from "@/components/protected-route";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
            {missions.map((m: any) => (
              <Card key={m.id} className="game-panel">
                <CardHeader>
                  <CardTitle>{m.title}</CardTitle>
                  <CardDescription>{m.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    Progreso: <span className="font-semibold">{m.current}/{m.target}</span> {m.completed ? "(completada)" : ""}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Recompensa: {m.rewardFood > 0 ? `+${m.rewardFood} comida ` : ""}{m.rewardWood > 0 ? `+${m.rewardWood} madera ` : ""}{m.rewardLead > 0 ? `+${m.rewardLead} hojas` : ""}
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
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
