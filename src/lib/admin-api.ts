import Cookies from "js-cookie"

const DB_HOST = process.env.NEXT_PUBLIC_DB_HOST || "http://127.0.0.1:4000"

export async function adminFetch(url: string, options: RequestInit = {}) {
  const token = Cookies.get("auth_token")
  const headers = new Headers(options.headers)
  headers.set("Authorization", `Bearer ${token}`)
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const res = await fetch(`${DB_HOST}/${url}`, { ...options, headers })

  if (res.status === 401) {
    Cookies.remove("auth_token")
    Cookies.remove("refresh_token")
    Cookies.remove("user_data")
    window.location.href = "/login?error=session_expired"
    throw new Error("Unauthorized")
  }

  return res.json()
}
