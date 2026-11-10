const DEV_FALLBACK = "http://127.0.0.1:4000"

let warnedMissingHost = false

/**
 * URL base de la API para el navegador.
 *
 * Next inlina `NEXT_PUBLIC_DB_HOST` en el bundle durante el build: el valor
 * debe llegar como build arg y cambiarlo requiere rebuild, no solo reiniciar.
 *
 * En desarrollo/pruebas se usa localhost para no depender de un `.env`. En
 * producción no hay fallback silencioso: el Dockerfile falla el build si falta
 * la variable, así que el navegador nunca apunta a 127.0.0.1 por accidente.
 */
export function getApiHost(): string {
  const configured = (process.env.NEXT_PUBLIC_DB_HOST ?? "")
    .trim()
    .replace(/\/+$/, "")

  if (configured) {
    return configured
  }

  if (process.env.NODE_ENV === "production") {
    if (!warnedMissingHost) {
      warnedMissingHost = true
      console.error(
        "[api-host] Falta NEXT_PUBLIC_DB_HOST en el build: las peticiones del navegador no tienen destino.",
      )
    }
    return ""
  }

  return DEV_FALLBACK
}

/** Construye una URL absoluta contra la API del navegador. */
export function apiUrl(path: string): string {
  return `${getApiHost()}/${path.replace(/^\/+/, "")}`
}
