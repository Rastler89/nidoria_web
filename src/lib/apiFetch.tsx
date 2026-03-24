import { cookies } from 'next/headers'

export async function apiFetch(url: string, options: RequestInit = {}) {
    const cookieStore = await cookies(); // Agregado await aquí para consistencia
    const refreshToken = cookieStore.get('refresh_token')?.value

    const dbHost = process.env.DB_HOST;
    const local = process.env.NEXT_PUBLIC_API_URL;

    async function clearCookies() {
        const store = await cookies();
        store.delete('auth_token');
        store.delete('refresh_token');
        store.delete('user_data');
    }

    if (refreshToken === undefined) {
        await clearCookies();
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    let currentOptions: RequestInit = {
        ...options,
        body: options.body ? String(options.body) : undefined
    };

    // Primer intento al servidor
    let res = await fetch(`${dbHost}/${url}`, currentOptions);

    if (res.status === 401) {
        // Intento de refrescar el token
        const refreshRes = await fetch(`${local}/api/auth/refresh`, {
            method: "POST",
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshRes.status === 401) {
            await clearCookies();
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        } else {
            const refreshData = await refreshRes.json();
            cookieStore.set('auth_token', refreshData['token']);

            // Actualizar headers con el nuevo token
            const headers = new Headers(currentOptions.headers || {});
            headers.set('Authorization', `Bearer ${refreshData['token']}`);
            currentOptions.headers = headers;

            // Re-intento tras refrescar el token
            res = await fetch(`${dbHost}/${url}`, currentOptions);

            if (res.status === 401) {
                await clearCookies();
                return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
            }
        }
    }

    return res; // Ahora este return está dentro de la función
}