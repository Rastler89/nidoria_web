import { cookies } from 'next/headers'


export async function apiFetch(url: string, options: RequestInit = {}) {

    const cookieStore = cookies()
    const refreshToken = (await cookieStore).get('refresh_token')?.value

console.log(refreshToken);
    //servidor
    let res = await fetch(`http://localhost:4000/${url}`, options);

    if (res.status === 401) {
        //local (control propio)
        const refreshRes = await fetch("http://localhost:3000/api/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!refreshRes.ok) {
            throw new Error("Unauthorized");
        }
        //servidor
        res = await fetch(`http://localhost:4000/${url}`, options);
    }

    return res;
}