import Cookies from "js-cookie";
import { apiUrl } from "@/lib/api-host";

/**
 * Central API client for Nidoria Frontend.
 * Handles API requests, including authentication headers.
 */
export const api = {
    /**
     * Core handler for all API requests. Manages headers and token refresh logic.
     * This internally wraps the fetch logic previously in apiFetch.
     */
    async request(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any) {
        // 1. Obtener tokens de las cookies
        const token = Cookies.get("auth_token");
        const refreshToken = Cookies.get("refresh_token");

        // 2. Configurar headers iniciales
        const headers = new Headers({
            'Content-Type': 'application/json',
        });
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        const currentOptions: RequestInit = {
            method: method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        };

        let res = await fetch(apiUrl(endpoint), currentOptions);

        // 3. Si falla con 401, intentar refrescar
        if (res.status === 401 && refreshToken) {
            console.log("Token caducado, intentando refrescar...");

            try {
                // Intentamos el refresco contra tu API interna de Next o Nest directamente
                const refreshRes = await fetch(apiUrl("auth/refresh"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    const newToken = data.access_token;

                    // Guardar nuevo token
                    Cookies.set("auth_token", newToken, { expires: 7 });

                    // 5. Reintento final con el nuevo token
                    headers.set("Authorization", `Bearer ${newToken}`);
                    res = await fetch(apiUrl(endpoint), {
                        ...currentOptions,
                        headers,
                    });
                } else {
                    // El refresh token también falló
                    forceLogout();
                }
            } catch (err) {
                forceLogout();
                throw err;
            }
        } else if (res.status === 401 && !refreshToken) {
            forceLogout();
        }

        // 6. Respuesta final
        if (!res.ok) {
            // Attempt to parse error message from backend
            const error = await res.json();
            throw new Error(error.message || `HTTP error! Status: ${res.status}`);
        }
        return res.json();
    },
    
    // --- ADMIN FEATURES ---

    /**
     * Triggers the full database wipe and rebuild (HIGHLY DESTRUCTIVE).
     * Requires Admin role access.
     */
    async resetDatabase(): Promise<{ status: string, message: string }> {
        // Hitting the secure admin endpoint on the NestJS backend
        const response = await this.request('/admin/wipedb', 'POST');
        return response;
    },

    /**
     * Retrieves the current migration status from the backend.
     * Requires Admin role access.
     */
    async getMigrationStatus(): Promise<{ status: string }> {
        const response = await this.request('/admin/migration-status', 'POST');
        // El backend responde { status: "Success", data: { status } }.
        return { status: response.data?.status ?? response.status };
    },

    /**
     * Enables a specific user account.
     * Requires Admin role access.
     * @param userId The ID of the user to enable.
     */
    async enableUser(userId: string): Promise<{ status: string, message: string }> {
        const response = await this.request(`/admin/users/${userId}/enable`, 'POST', { enable: true });
        return response;
    }
};

// [Utility functions kept outside the main API object]
function forceLogout() {
    console.log('entro');
    Cookies.remove("auth_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_data");
    if (typeof window !== "undefined") {
        window.location.href = "/login?error=session_expired";
    }
}