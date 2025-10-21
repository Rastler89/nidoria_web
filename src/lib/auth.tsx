"use client"

import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  email: string
  username: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  refreshToken?: string | null
  refresh: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, username: string, password: string) => Promise<boolean>
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
    const savedToken = localStorage.getItem("auth_token")
    const savedUser = localStorage.getItem("user_data")
    if (savedToken && savedUser) {
      setToken(savedToken)
      // In a real app, you'd validate the token with your API
      // For now, we'll simulate a user from the token
      setUser(savedUser)
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

        Cookies.set("auth_token", authToken);
        Cookies.set("user_data", userData);
        Cookies.set("refresh_token", refreshToken);

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

  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call to your NestJS backend
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        const { token: authToken, user: userData, refreshToken: refreshToken} = data

        Cookies.set("auth_token", authToken);
        Cookies.set("user_data", userData);
        Cookies.set("refresh_token", refreshToken);
        setToken(authToken)
        setUser(userData)
        setRefreshToken(refreshToken)
        return true
      }
      return false
    } catch (error) {
      console.error("Register error:", error)
      return false
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
        Cookies.set("auth_token", token);
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
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    localStorage.removeItem("refresh_token")
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
