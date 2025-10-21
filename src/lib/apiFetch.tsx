import { cookies } from 'next/headers'
import { useAuth } from './auth';
import Cookies from "js-cookie";


export async function apiFetch(url: string, options: RequestInit = {}) {

    const cookieStore = cookies()
    const refreshToken = (await cookieStore).get('refresh_token')?.value

    if (refreshToken == undefined) {
        throw new Error("Unauthorized");
    }

    let currentOptions: RequestInit = {
        ...options,
        body: options.body ? String(options.body) : undefined
    };

    //servidor
    let res = await fetch(`http://localhost:4000/${url}`, currentOptions);
    if (res.status === 401) {
        //local (control propio)
        const refreshRes = await fetch("http://localhost:3000/api/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refresh_token: refreshToken }),
        });


        if(refreshRes.status === 401) {
            throw new Error("Unauthorized");
        } else {
            const refreshData = await refreshRes.json();
            cookieStore.set('auth_token', refreshData['token']);
        }

        //servidor
        res = await fetch(`http://localhost:4000/${url}`, currentOptions);
    }

    return res;
}