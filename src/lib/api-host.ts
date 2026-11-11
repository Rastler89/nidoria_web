const DEV_FALLBACK = "http://127.0.0.1:4000"

let warnedMissingHost = false

declare global {
  interface Window {
    __NIDORIA_CONFIG__?: { apiHost?: string }
  }
}

function readRuntimeHost(): string | undefined {
  if (typeof window === "undefined") {
    return undefined
  }

  const host = window.__NIDORIA_CONFIG__?.apiHost
  return typeof host === "string" && host.trim() ? host : undefined
}

/**
 * URL base de la API para el navegador.
 *
 * Prioridad:
 *  1. `window.__NIDORIA_CONFIG__.apiHost`, generado en runtime por
 *     `docker-entrypoint.sh` a partir de `DB_HOST`.
 *  2. `NEXT_PUBLIC_DB_HOST`, horneado en build (fallback opcional).
 *  3. `http://127.0.0.1:4000`, solo en desarrollo/pruebas.
 *
 * En producción no se usa localhost: si faltan las dos primeras, la web queda
 * sin destino y se avisa por consola en vez de llamar a la máquina del jugador.
 */
export function getApiHost(): string {
  const runtimeHost = readRuntimeHost()
  const configured = (runtimeHost ?? process.env.NEXT_PUBLIC_DB_HOST ?? "")
    .trim()
    .replace(/\/+$/, "")

  if (configured) {
    return configured
  }

  if (process.env.NODE_ENV !== "production") {
    return DEV_FALLBACK
  }

  if (typeof window !== "undefined" && !warnedMissingHost) {
    warnedMissingHost = true
    console.error(
      "[api-host] Sin URL de API: define DB_HOST en el contenedor o NEXT_PUBLIC_DB_HOST en el build.",
    )
  }

  return ""
}

/** Construye una URL absoluta contra la API del navegador. */
export function apiUrl(path: string): string {
  return `${getApiHost()}/${path.replace(/^\/+/, "")}`
}
