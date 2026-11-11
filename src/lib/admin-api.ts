import Cookies from "js-cookie"
import { apiUrl } from "@/lib/api-host"

function clearSession() {
  Cookies.remove("auth_token")
  Cookies.remove("refresh_token")
  Cookies.remove("user_data")
}

/**
 * Pide un access token nuevo al proxy de Next (`/api/auth/refresh`).
 *
 * Se usa el route handler y no la API directamente para no depender de CORS y
 * para que el refresh token no viaje en una petición cross-origin.
 *
 * Devuelve `null` si no hay refresh token o si el backend lo rechaza.
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = Cookies.get("refresh_token")
  if (!refreshToken) {
    return null
  }

  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (!res.ok) {
      return null
    }

    const data = await res.json().catch(() => ({}))
    const token = data?.token
    if (typeof token !== "string" || !token) {
      return null
    }

    Cookies.set("auth_token", token, { expires: 7 })
    return token
  } catch {
    return null
  }
}

async function send(url: string, options: RequestInit, token?: string) {
  const headers = new Headers(options.headers)
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  return fetch(apiUrl(url), { ...options, headers })
}

/**
 * Petición autenticada a los endpoints de AntMaster.
 *
 * Ante un 401 no expulsa al usuario de inmediato: el access token dura 1 h y
 * lo normal es que solo haya caducado. Primero intenta refrescarlo y repetir
 * la petición; solo si el refresh también falla cierra la sesión.
 */
export async function adminFetch(url: string, options: RequestInit = {}) {
  let res = await send(url, options, Cookies.get("auth_token"))

  if (res.status === 401) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      res = await send(url, options, refreshed)
    }

    if (res.status === 401) {
      clearSession()
      window.location.href = "/login?error=session_expired"
      throw new Error("Unauthorized")
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  return res.json()
}
