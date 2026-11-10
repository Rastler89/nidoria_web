/**
 * URL base de la API usada por los route handlers y componentes de servidor.
 *
 * Se lee en runtime desde `DB_HOST` (variable privada: no se inlina en el
 * bundle del navegador). No hay fallback a localhost para que un despliegue
 * mal configurado falle de forma visible en vez de llamar a la máquina local.
 */
export function getServerApiHost(): string {
  return (process.env.DB_HOST ?? "").trim().replace(/\/+$/, "")
}

/** Construye una URL absoluta contra la API desde el servidor. */
export function serverApiUrl(path: string): string {
  return `${getServerApiHost()}/${path.replace(/^\/+/, "")}`
}
