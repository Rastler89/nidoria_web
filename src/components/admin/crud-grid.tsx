"use client"

import { useEffect, useState } from "react"
import { adminFetch } from "@/lib/admin-api"

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface CrudGridProps {
  title: string
  endpoint: string
  icon: string
  accentColor: string
  columns: Column[]
  formFields?: { key: string; label: string; type?: string }[]
}

export function CrudGrid({ title, endpoint, icon, accentColor, columns, formFields }: CrudGridProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState<Record<string, any>>({})

  const load = async () => {
    setLoading(true)
    const res = await adminFetch(endpoint)
    setData(Array.isArray(res) ? res : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditItem(null)
    setForm({})
    setShowForm(true)
  }

  const openEdit = (item: any) => {
    setEditItem(item)
    setForm(item)
    setShowForm(true)
  }

  const save = async () => {
    if (editItem) {
      await adminFetch(`${endpoint}/${editItem.id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      })
    } else {
      await adminFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(form),
      })
    }
    setShowForm(false)
    load()
  }

  const remove = async (id: number) => {
    if (!confirm("¿Eliminar este elemento?")) return
    await adminFetch(`${endpoint}/${id}`, { method: "DELETE" })
    load()
  }

  const colorMap: Record<string, string> = {
    amber: "from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border-amber-500/30",
    purple: "from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 border-purple-500/30",
    red: "from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 border-red-500/30",
    green: "from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 border-green-500/30",
    blue: "from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 border-blue-500/30",
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#121215]/50 border border-white/5 p-6 rounded-3xl backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 bg-${accentColor}-500/10 rounded-2xl flex items-center justify-center text-${accentColor}-500 text-xl border border-${accentColor}-500/20`}>
            <span>{icon}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-1">Gestión del catálogo</p>
          </div>
        </div>
        <button
          onClick={openNew}
          className={`bg-gradient-to-r ${colorMap[accentColor] || colorMap.amber} px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all border flex items-center gap-2 text-white`}
        >
          <span>+</span> Nuevo
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-[#121215] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-6">{editItem ? "Editar" : "Nuevo"} Elemento</h3>
            <div className="space-y-4">
              {(formFields || columns).map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    {field.label || field.key}
                  </label>
                  <input
                    type={(field as any).type || "text"}
                    value={form[field.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 focus:border-amber-500/50 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl border border-white/5 transition-all text-sm">
                Cancelar
              </button>
              <button onClick={save} className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 rounded-xl border border-amber-500/30 transition-all text-sm">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-zinc-500 py-12">Cargando...</div>
        ) : data.length === 0 ? (
          <div className="col-span-full text-center text-zinc-500 py-12">No hay datos</div>
        ) : data.map((item) => (
          <div key={item.id} className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-mono text-zinc-600">#{item.id}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)} className="text-xs text-amber-500 hover:text-amber-400">✏️</button>
                <button onClick={() => remove(item.id)} className="text-xs text-red-500 hover:text-red-400">🗑️</button>
              </div>
            </div>
            {columns.map((col) => (
              <div key={col.key} className="mb-1">
                <span className="text-[10px] text-zinc-500 uppercase">{col.label}: </span>
                <span className="text-white text-sm font-semibold">
                  {col.render ? col.render(item[col.key], item) : item[col.key] ?? "—"}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
