"use client";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type Mission = {
  id: number;
  key: string;
  title: string;
  description: string;
  conditionType: string;
  target: number;
  rewardFood: number;
  rewardWood: number;
  rewardLead: number;
  active: boolean;
  sortOrder: number;
};

const empty: Omit<Mission, "id"> = {
  key: "",
  title: "",
  description: "",
  conditionType: "HAVE_ANTS",
  target: 1,
  rewardFood: 0,
  rewardWood: 0,
  rewardLead: 0,
  active: true,
  sortOrder: 0,
};

export default function AntmasterMissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      const data = await adminFetch("/antmaster/api/missions");
      setMissions(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setMsg(e?.message || "Error cargando misiones");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setMsg("");
    try {
      if (editingId) {
        await adminFetch(`/antmaster/api/missions/${editingId}`, { method: "PATCH", body: JSON.stringify(form) });
      } else {
        await adminFetch("/antmaster/api/missions", { method: "POST", body: JSON.stringify(form) });
      }
      setMsg("Guardado.");
      setForm(empty);
      setEditingId(null);
      load();
    } catch (e: any) {
      setMsg(e?.message || "Error al guardar.");
    }
  };

  const edit = (m: Mission) => { setEditingId(m.id); setForm({ key: m.key, title: m.title, description: m.description, conditionType: m.conditionType, target: m.target, rewardFood: m.rewardFood, rewardWood: m.rewardWood, rewardLead: m.rewardLead, active: m.active, sortOrder: m.sortOrder }); };
  const del = async (id: number) => {
    if (!confirm("Eliminar mision?")) return;
    try {
      await adminFetch(`/antmaster/api/missions/${id}`, { method: "DELETE" });
      load();
    } catch (e: any) {
      setMsg(e?.message || "Error al eliminar");
    }
  };

  return (
    <div className="p-6 space-y-6 text-zinc-100">
      <h1 className="text-2xl font-bold">Misiones (starter)</h1>
      {msg && <p className="text-amber-400 text-sm">{msg}</p>}
      <div className="grid gap-3 max-w-xl bg-zinc-900 p-4 rounded-lg border border-zinc-800">
        <input className="bg-zinc-800 p-2 rounded" placeholder="key (unica)" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
        <input className="bg-zinc-800 p-2 rounded" placeholder="Titulo" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="bg-zinc-800 p-2 rounded" placeholder="Descripcion" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select className="bg-zinc-800 p-2 rounded" value={form.conditionType} onChange={(e) => setForm({ ...form, conditionType: e.target.value })}>
          <option value="HAVE_ANTS">Tener X hormigas</option>
          <option value="HAVE_FOOD_STOCK">Tener X comida (stock)</option>
          <option value="HAVE_WOOD_STOCK">Tener X madera (stock)</option>
          <option value="HAVE_LEAD_STOCK">Tener X hojas (stock)</option>
          <option value="HAVE_CONSTRUCTIONS_COMPLETED">Tener X construcciones completadas</option>
        </select>
        <input className="bg-zinc-800 p-2 rounded" type="number" placeholder="Objetivo" value={form.target} onChange={(e) => setForm({ ...form, target: Number(e.target.value) })} />
        <div className="grid grid-cols-3 gap-2">
          <input className="bg-zinc-800 p-2 rounded" type="number" placeholder="Recompensa comida" value={form.rewardFood} onChange={(e) => setForm({ ...form, rewardFood: Number(e.target.value) })} />
          <input className="bg-zinc-800 p-2 rounded" type="number" placeholder="Recompensa madera" value={form.rewardWood} onChange={(e) => setForm({ ...form, rewardWood: Number(e.target.value) })} />
          <input className="bg-zinc-800 p-2 rounded" type="number" placeholder="Recompensa hojas" value={form.rewardLead} onChange={(e) => setForm({ ...form, rewardLead: Number(e.target.value) })} />
        </div>
        <input className="bg-zinc-800 p-2 rounded" type="number" placeholder="Orden" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Activa</label>
        <div className="flex gap-2">
          <button className="bg-amber-600 px-4 py-2 rounded" onClick={save}>{editingId ? "Actualizar" : "Crear"}</button>
          {editingId && <button className="bg-zinc-700 px-4 py-2 rounded" onClick={() => { setEditingId(null); setForm(empty); }}>Cancelar</button>}
        </div>
      </div>
      <div className="space-y-2">
        {missions.map((m) => (
          <div key={m.id} className="bg-zinc-900 p-3 rounded border border-zinc-800 flex justify-between items-center">
            <div><strong>{m.title}</strong> ({m.key}) - obj {m.target} - recompensa F{m.rewardFood}/W{m.rewardWood}/L{m.rewardLead} {m.active ? "" : "[inactiva]"}</div>
            <div className="flex gap-2">
              <button className="text-amber-400" onClick={() => edit(m)}>Editar</button>
              <button className="text-red-400" onClick={() => del(m.id)}>Borrar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
