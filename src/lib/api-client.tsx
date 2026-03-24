import Cookies from "js-cookie";

export async function apiFetch(url: string, options: RequestInit = {}) {
    const dbHost = process.env.NEXT_PUBLIC_DB_HOST; // Asegúrate de usar NEXT_PUBLIC para el cliente

    // 1. Obtener tokens de las cookies
    let token = Cookies.get("auth_token");
    const refreshToken = Cookies.get("refresh_token");

    // 2. Configurar headers iniciales
    const headers = new Headers(options.headers);
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const currentOptions: RequestInit = {
        ...options,
        headers,
    };

    // 3. Primer intento
    let res = await fetch(`${dbHost}/${url}`, currentOptions);
    // 4. Si falla con 401, intentar refrescar
    if (res.status === 401 && refreshToken) {
        console.log("Token caducado, intentando refrescar...");

        try {
            // Intentamos el refresco contra tu API interna de Next o Nest directamente
            const refreshRes = await fetch(`${dbHost}/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }), // Ajusta según pida tu NestJS
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                const newToken = data.token;

                // Guardar nuevo token
                Cookies.set("auth_token", newToken, { expires: 7 });

                // 5. Reintento final con el nuevo token
                headers.set("Authorization", `Bearer ${newToken}`);
                res = await fetch(`${dbHost}/${url}`, {
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

    return res;
}

// Función auxiliar para limpiar y redirigir
function forceLogout() {
    console.log('entro');
    Cookies.remove("auth_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user_data");
    if (typeof window !== "undefined") {
        window.location.href = "/login?error=session_expired";
    }
}