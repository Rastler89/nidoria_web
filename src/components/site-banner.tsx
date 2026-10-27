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

const VARIANTS: Record<
  BannerVariant,
  { glow: string; icon: string; labelColor: string; iconComponent: typeof Info; label: string }
> = {
  info: {
    glow: "from-primary/15",
    icon: "text-primary",
    labelColor: "text-primary",
    iconComponent: Info,
    label: "Información",
  },
  warning: {
    glow: "from-accent/15",
    icon: "text-accent",
    labelColor: "text-accent",
    iconComponent: AlertTriangle,
    label: "Aviso",
  },
  danger: {
    glow: "from-destructive/20",
    icon: "text-destructive",
    labelColor: "text-destructive",
    iconComponent: AlertOctagon,
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
  const Icon = variant.iconComponent

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={variant.label}
      className="relative w-full overflow-hidden border-b border-border bg-card/60 backdrop-blur-sm"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-r via-transparent to-transparent",
          variant.glow,
        )}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-7xl items-start gap-3 px-4 py-2.5 sm:items-center sm:px-6 lg:px-8">
        <Icon className={cn("mt-0.5 h-4 w-4 shrink-0 sm:mt-0", variant.icon)} aria-hidden="true" />
        <p className="min-w-0 flex-1 text-sm leading-snug text-foreground/90">
          <span
            className={cn(
              "mr-2 align-baseline text-[10px] font-bold uppercase tracking-[0.2em]",
              variant.labelColor,
            )}
          >
            {variant.label}
          </span>
          {banner.message}
          {banner.linkUrl ? (
            <a
              href={banner.linkUrl}
              className="ml-2 inline-flex items-center gap-1 whitespace-nowrap font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {banner.linkLabel || "Ver más"}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null}
        </p>
        <button
          type="button"
          onClick={() => dismissBanner(bannerKey(banner))}
          aria-label="Cerrar aviso"
          className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
