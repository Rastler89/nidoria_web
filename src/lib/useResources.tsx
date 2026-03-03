import useSWR from "swr";

const fetcher = async (url: string) => { const res = await fetch(url); if (res.status === 401) { window.location.href = '/login'; throw new Error('Unauthorized'); } return res.json(); };

export function useResources() {
    return useSWR('/api/resources',fetcher);
}