"use client"

import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  email: string
  username: string
}

interface RegisterResult {
  ok: boolean
  error?: string
  details?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  refreshToken?: string | null
  refresh: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, username: string, password: string) => Promise<RegisterResult>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = Cookies.get("auth_token")
    const savedUser = Cookies.get("user_data")
    const savedRefreshToken = Cookies.get("refresh_token")
    if (savedToken && savedUser) {
      setToken(savedToken)
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Failed to parse user data", e)
      }
    }
    if (savedRefreshToken) {
      setRefreshToken(savedRefreshToken)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call to your NestJS backend
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        const { token: authToken, user: userData, refreshToken: refreshToken} = data

        Cookies.set("auth_token", authToken, { expires: 7 })
        Cookies.set("user_data", JSON.stringify(userData), { expires: 7 })
        Cookies.set("refresh_token", String(refreshToken), { expires: 7 })

        setToken(authToken)
        setUser(userData)
        setRefreshToken(refreshToken)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (email: string, username: string, password: string): Promise<RegisterResult> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        return {
          ok: false,
          error: data.error || "No se pudo completar el registro.",
          details: data.details,
        }
      }

      // El registro no inicia sesión: la cuenta debe verificarse por correo
      // antes de poder entrar (el backend exige `verified`).
      return { ok: true }
    } catch (error) {
      console.error("Register error:", error)
      return { ok: false, error: "Error de conexión con el servidor." }
    }
  }

  const refresh = async () => {
    try {
      if (!refreshToken) return

      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        const { token: newToken } = data
        Cookies.set("auth_token", newToken)
        setToken(newToken)
      } else {
        logout()
      }
    } catch (error) {
      console.error("Refresh token error:", error)
      logout()
    }
  }

  const logout = () => {
    Cookies.remove("auth_token")
    Cookies.remove("user_data")
    Cookies.remove("refresh_token")
    setToken(null)
    setRefreshToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, refresh, login, register, logout, loading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
