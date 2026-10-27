"use client"

import { useMemo, useSyncExternalStore } from "react"
import useSWR from "swr"
import { AlertOctagon, AlertTriangle, ArrowRight, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

type BannerVariant = "info" | "warning" | "danger"

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

const STORAGE_KEY = "nidoria_dismissed_banners"
const EMPTY: string[] = []

const VARIANTS: Record<BannerVariant, { container: string; icon: typeof Info; label: string }> = {
  info: {
    container: "bg-sky-700 text-sky-50 border-sky-500/40",
    icon: Info,
    label: "Información",
  },
  warning: {
    container: "bg-amber-500 text-amber-950 border-amber-300/50",
    icon: AlertTriangle,
    label: "Aviso",
  },
  danger: {
    container: "bg-red-700 text-red-50 border-red-400/40",
    icon: AlertOctagon,
    label: "Importante",
  },
}

async function fetcher(url: string): Promise<{ banners: Banner[] }> {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) return { banners: [] }
  return res.json()
}

function bannerKey(banner: Banner) {
  return `${banner.id}:${banner.updatedAt}`
}

// Pequeño store sobre localStorage: React lo lee con useSyncExternalStore y así
// no hay setState dentro de un efecto ni desajustes de hidratación.
const listeners = new Set<() => void>()
let cachedRaw: string | null = null
let cachedList: string[] = EMPTY

function subscribe(callback: () => void) {
  listeners.add(callback)
  window.addEventListener("storage", callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", callback)
  }
}

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]"
  } catch {
    return "[]"
  }
}

function getServerSnapshot(): string {
  return "[]"
}

function parseDismissed(raw: string): string[] {
  if (raw === cachedRaw) return cachedList
  cachedRaw = raw
  try {
    const parsed = JSON.parse(raw)
    cachedList = Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : EMPTY
  } catch {
    cachedList = EMPTY
  }
  return cachedList
}

function dismissBanner(key: string) {
  const next = Array.from(new Set([...parseDismissed(getSnapshot()), key]))
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Sin localStorage el banner simplemente reaparecerá en la próxima visita.
  }
  listeners.forEach((listener) => listener())
}

/**
 * Franja de anuncios global. Muestra el banner vigente de mayor prioridad que
 * el visitante no haya cerrado; al cerrarlo pasa al siguiente.
 */
export function SiteBanner() {
  const rawDismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const dismissed = useMemo(() => parseDismissed(rawDismissed), [rawDismissed])

  const { data } = useSWR<{ banners: Banner[] }>("/api/banner", fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  const banner = useMemo(() => {
    const banners = data?.banners ?? []
    return banners.find((item) => !dismissed.includes(bannerKey(item))) ?? null
  }, [data, dismissed])

  if (!banner) return null

  const variant = VARIANTS[(banner.variant as BannerVariant)] ?? VARIANTS.info
  const Icon = variant.icon

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={variant.label}
      className={cn(
        "sticky top-0 z-[60] w-full border-b px-4 py-2.5 shadow-sm",
        variant.container,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden="true" />
        <p className="min-w-0 flex-1 text-sm leading-snug">
          <span className="sr-only">{variant.label}: </span>
          {banner.message}
        </p>
        {banner.linkUrl ? (
          <a
            href={banner.linkUrl}
            className="hidden shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold underline decoration-2 underline-offset-2 transition-opacity hover:opacity-80 sm:inline-flex"
          >
            {banner.linkLabel || "Ver más"}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => dismissBanner(bannerKey(banner))}
          aria-label="Cerrar aviso"
          className="shrink-0 rounded-md p-1 transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {banner.linkUrl ? (
        <div className="mx-auto mt-1 max-w-7xl pl-7 sm:hidden">
          <a
            href={banner.linkUrl}
            className="inline-flex items-center gap-1 text-xs font-semibold underline decoration-2 underline-offset-2"
          >
            {banner.linkLabel || "Ver más"}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      ) : null}
    </div>
  )
}
