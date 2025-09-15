'use client'

import { apiFetch } from "@/lib/apiFetch";
import { useAuth } from "@/lib/auth";
import { useResources } from "@/lib/useResources";
import { useEffect, useState } from "react";

export function Stats() {
    const { data, error, isLoading } = useResources();
    const { user, token, logout } = useAuth()

    type Resources = {
        eggs: number;
        larva: number;
        ants: number;
        resources: { type: string; stock: number }[];
    };

    const getResourceStock = (type: string) => {
        return data?.resources?.find(r => r.type === type)?.stock ?? "--";
    }

    return <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 border border-primary/30 glow-effect">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🥚 Huevos</div>
                <div className="text-2xl font-bold">{data?.eggs ?? "--"}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🐛 Larvas</div>
                <div className="text-2xl font-bold">{data?.larva ?? "--"}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🐜 Obreras</div>
                <div className="text-2xl font-bold">{data?.ants ?? "--"}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🍯 Comida</div>
                <div className="text-2xl font-bold">{getResourceStock('F')}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🪵 Madera</div>
                <div className="text-2xl font-bold">{getResourceStock('W')}</div>
              </div>
              <div className="resource-counter text-center">
                <div className="text-sm opacity-90">🍃 Hojas</div>
                <div className="text-2xl font-bold">{getResourceStock('L')}</div>
              </div>
            </div>
          </div>
}