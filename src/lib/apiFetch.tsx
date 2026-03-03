import { cookies } from 'next/headers'
import { useAuth } from './auth';
import Cookies from "js-cookie";

export async function apiFetch(url: string, options: RequestInit = {}) {

    const cookieStore = cookies()
    const refreshToken = (await cookieStore).get('refresh_token')?.value

    const dbHost = process.env.DB_HOST;
    const local = process.env.NEXT_PUBLIC_API_URL;

    async function clearCookies() {
        const store = await cookies();
        store.delete('auth_token');
        store.delete('refresh_token');
        store.delete('user_data');
    }

    if (refreshToken == undefined) {
        await clearCookies();
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    let currentOptions: RequestInit = {
        ...options,
        body: options.body ? String(options.body) : undefined
    };

    //servidor
    let res = await fetch(`${dbHost}/${url}`, currentOptions);
    if (res.status === 401) {
        //local (control propio)
        const refreshRes = await fetch(local+"/api/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if(refreshRes.status === 401) {
            await clearCookies();
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        } else {
            const refreshData = await refreshRes.json();
            (await cookieStore).set('auth_token', refreshData['token']);

            // update authorization header with new token
            const headers = new Headers(currentOptions.headers || {});
            headers.set('Authorization', `Bearer ${refreshData['token']}`);
            currentOptions.headers = headers;
            }
        }

        //servidor retry
        res = await fetch(`${dbHost}/${url}`, currentOptions);
        if (res.status === 401) {
            await clearCookies();
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
    }

    return res;
}
