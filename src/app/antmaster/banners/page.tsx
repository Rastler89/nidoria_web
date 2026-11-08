"use client"

import { useEffect, useState, type FormEvent } from "react"
import { adminFetch } from "@/lib/admin-api"

interface Banner {
  id: number
  message: string
  linkLabel: string | null
  linkUrl: string | null
  variant: string
  active: boolean
  startsAt: string | null
  endsAt: string | null
  priority: number
  createdAt: string
  updatedAt: string
}

type FormState = {
  message: string
  linkLabel: string
  linkUrl: string
  variant: string
  priority: string
  startsAt: string
  endsAt: string
  active: boolean
}

const EMPTY_FORM: FormState = {
  message: "",
  linkLabel: "",
  linkUrl: "",
  variant: "info",
  priority: "0",
  startsAt: "",
  endsAt: "",
  active: true,
}

const VARIANT_STYLES: Record<string, string> = {
  info: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  danger: "text-red-400 bg-red-500/10 border-red-500/30",
}

const VARIANT_LABELS: Record<string, string> = {
  info: "Información",
  warning: "Aviso",
  danger: "Peligro",
}

function toLocalInput(iso: string | null) {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

function getStatus(banner: Banner) {
  if (!banner.active) {
    return { label: "Inactivo", className: "text-zinc-400 bg-zinc-500/10 border-zinc-500/30" }
  }
  const now = Date.now()
  if (banner.startsAt && new Date(banner.startsAt).getTime() > now) {
    return { label: "Programado", className: "text-amber-400 bg-amber-500/10 border-amber-500/30" }
  }
  if (banner.endsAt && new Date(banner.endsAt).getTime() < now) {
    return { label: "Caducado", className: "text-red-400 bg-red-500/10 border-red-500/30" }
  }
  return { label: "Activo", className: "text-green-400 bg-green-500/10 border-green-500/30" }
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const loadBanners = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminFetch("antmaster/api/banners")
      setBanners(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los banners.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBanners() }, [])

  const resetForm = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const startEdit = (banner: Banner) => {
    setEditingId(banner.id)
    setForm({
      message: banner.message,
      linkLabel: banner.linkLabel ?? "",
      linkUrl: banner.linkUrl ?? "",
      variant: banner.variant,
      priority: String(banner.priority ?? 0),
      startsAt: toLocalInput(banner.startsAt),
      endsAt: toLocalInput(banner.endsAt),
      active: banner.active,
    })
  }

  const save = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      message: form.message.trim(),
      linkLabel: form.linkLabel.trim() || null,
      linkUrl: form.linkUrl.trim() || null,
      variant: form.variant,
      priority: Number(form.priority) || 0,
      startsAt: form.startsAt || null,
      endsAt: form.endsAt || null,
      active: form.active,
    }

    try {
      if (editingId) {
        await adminFetch(`antmaster/api/banners/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      } else {
        await adminFetch("antmaster/api/banners", {
          method: "POST",
          body: JSON.stringify(payload),
        })
      }
      resetForm()
      await loadBanners()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el banner.")
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (banner: Banner) => {
    try {
      await adminFetch(`antmaster/api/banners/${banner.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !banner.active }),
      })
      await loadBanners()
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo cambiar el estado del banner.")
    }
  }

  const remove = async (banner: Banner) => {
    if (!confirm("¿Borrar este banner? Esta acción no se puede deshacer.")) return
    try {
      await adminFetch(`antmaster/api/banners/${banner.id}`, { method: "DELETE" })
      if (editingId === banner.id) resetForm()
      await loadBanners()
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo borrar el banner.")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Banners globales</h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-1">
            Anuncios que se muestran en la cabecera del juego
          </p>
        </div>
        <button
          onClick={resetForm}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-xl border border-amber-500/30 transition-all text-[11px] uppercase tracking-widest"
        >
          + Nuevo banner
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4">
          {error}
        </div>
      )}

      <form onSubmit={save} className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-amber-400">
            {editingId ? `Editar banner #${editingId}` : "Nuevo banner"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Cancelar edición
            </button>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Mensaje *</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            maxLength={500}
            rows={2}
            placeholder="Ej: El viernes abrimos el ranking global"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 focus:border-amber-500/50 outline-none transition-all resize-y"
          />
          <p className="text-[10px] text-zinc-600 mt-1">{form.message.length}/500</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Texto del enlace</label>
            <input
              value={form.linkLabel}
              onChange={(e) => setForm({ ...form, linkLabel: e.target.value })}
              maxLength={60}
              placeholder="Ver novedades"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 focus:border-amber-500/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">URL del enlace</label>
            <input
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
              placeholder="https://nidoria.org/novedades o /register"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 focus:border-amber-500/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Color</label>
            <select
              value={form.variant}
              onChange={(e) => setForm({ ...form, variant: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:border-amber-500/50 outline-none transition-all"
            >
              {Object.entries(VARIANT_LABELS).map(([value, label]) => (
                <option key={value} value={value} className="bg-zinc-900">{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Prioridad</label>
            <input
              type="number"
              step={1}
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:border-amber-500/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Empieza</label>
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:border-amber-500/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Termina</label>
            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:border-amber-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="w-4 h-4 accent-amber-500"
          />
          Activo
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl border border-amber-500/30 transition-all text-sm"
          >
            {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear banner"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-zinc-500 py-12">Cargando banners...</div>
        ) : banners.length === 0 ? (
          <div className="text-center text-zinc-500 py-12 italic">Todavía no hay banners. Crea el primero con el formulario de arriba.</div>
        ) : banners.map((banner) => {
          const status = getStatus(banner)
          const variant = VARIANT_STYLES[banner.variant] ?? VARIANT_STYLES.info
          return (
            <div key={banner.id} className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${variant}`}>
                  {VARIANT_LABELS[banner.variant] ?? banner.variant}
                </span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${status.className}`}>
                  {status.label}
                </span>
                <span className="text-[10px] font-mono text-zinc-600">#{banner.id}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Prioridad {banner.priority}</span>
              </div>

              <p className="text-sm text-white break-words">{banner.message}</p>

              {banner.linkUrl && (
                <a
                  href={banner.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 break-all text-xs"
                >
                  {banner.linkLabel || banner.linkUrl}
                </a>
              )}

              <div className="flex flex-wrap gap-4 mt-4 text-[10px] text-zinc-500">
                <span>Empieza: {formatDate(banner.startsAt)}</span>
                <span>Termina: {formatDate(banner.endsAt)}</span>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <button
                  onClick={() => startEdit(banner)}
                  className="text-amber-400 hover:text-amber-300 text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => toggleActive(banner)}
                  className="text-amber-400 hover:text-amber-300 text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  {banner.active ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={() => remove(banner)}
                  className="text-red-500 hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  Borrar
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
