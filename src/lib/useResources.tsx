import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useResources() {
    return useSWR('api/resources',fetcher);
}