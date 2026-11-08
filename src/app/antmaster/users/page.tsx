"use client"

import { useEffect, useState } from "react"
import { adminFetch } from "@/lib/admin-api"

interface User {
  id: number
  username: string
  email: string
  role: string
  verified: string | null
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    setLoading(true)
    const data = await adminFetch("antmaster/api/users")
    setUsers(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

  const updateRole = async (id: number, role: string) => {
    await adminFetch(`antmaster/api/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    })
    loadUsers()
  }

  const deleteUser = async (id: number) => {
    if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return
    await adminFetch(`antmaster/api/users/${id}`, { method: "DELETE" })
    loadUsers()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Gestión de Usuarios</h2>
        <button
          onClick={loadUsers}
          className="text-xs bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold px-4 py-2 rounded-full border border-amber-500/30 transition-all"
        >
          ↻ Recargar
        </button>
      </div>

      <div className="bg-gradient-to-b from-[#18181b]/80 to-[#09090b]/90 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black/40 border-b border-white/5 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">ID</th>
                <th className="px-8 py-5">Usuario</th>
                <th className="px-8 py-5">Email</th>
                <th className="px-8 py-5">Rol</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-12 text-center text-zinc-500">Cargando...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-8 py-12 text-center text-zinc-500">No hay usuarios</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-4 text-zinc-400 font-mono text-sm">{user.id}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/20 flex items-center justify-center text-amber-500 text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-semibold">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-zinc-400 text-sm">{user.email}</td>
                  <td className="px-8 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${
                        user.role === "admin"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                          : "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
                      }`}
                    >
                      <option value="user" className="bg-zinc-900">user</option>
                      <option value="admin" className="bg-zinc-900">admin</option>
                      <option value="moderator" className="bg-zinc-900">moderator</option>
                    </select>
                  </td>
                  <td className="px-8 py-4">
                    {user.verified ? (
                      <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">Verificado</span>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-500/10 px-2 py-1 rounded-full border border-zinc-500/30">Pendiente</span>
                    )}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
