# Nidoria Web — Guía del repo

Cliente web del juego **Nidoria**: **Next.js 16** (App Router, Turbopack), **React 19**, **Tailwind v4**, componentes **Radix UI** (shadcn-style), **SWR** para datos y **socket.io-client** para tiempo real.

## Comandos

```bash
npm install
npm run dev      # next dev --turbopack → http://localhost:3000
npm run build    # next build --turbopack
npm run start
```

No hay scripts de lint ni test todavía; TypeScript se valida con `npx tsc --noEmit`.

## Estructura

- `src/app/` — App Router: `page.tsx` (landing), `login/`, `register/`, `dashboard/`, `explore/`, `wiki/`.
- `src/app/api/` — **route handlers de Next** que actúan de proxy hacia la API NestJS (auth, ants, constructions, investigations, resources, ranking, misiones, pre-register).usan `apiFetch` del lado servidor.
- `src/lib/`
  - `apiFetch.tsx` — fetch **server-side** (usa `next/headers` cookies); envía el refresh token y reintenta ante 401 contra `${NEXT_PUBLIC_API_URL}/api/auth/refresh`.
  - `api-client.tsx` — fetch **client-side** (usa `js-cookie`); token en `Authorization: Bearer`, refresh contra `${NEXT_PUBLIC_DB_HOST}/auth/refresh`, logout forzado redirige a `/login?error=session_expired`.
  - `auth.tsx` — contexto/gestión de sesión (`useAuth`).
  - `useResources.tsx` — hook SWR hacia `/api/resources`.
- `src/context/SocketContext.tsx` — conexión Socket.IO con `auth: { token }` (transporte websocket); escucha `anthill_update` (merge de estado + toast) y `auth_error`. Fallback del host: `NEXT_PUBLIC_DB_HOST` o `http://localhost:4000`.
- `src/components/` — `ui/` (Radix + CVA + tailwind-merge), `protected-route.tsx`, `theme-provider.tsx`, `stats.tsx`, `accessibility-menu.tsx`.

## Variables de entorno (`.env`)

- `DB_HOST` — host de la API usado por los route handlers server-side.
- `NEXT_PUBLIC_DB_HOST` — host de la API para el navegador (fetch cliente + Socket.IO).
- `NEXT_PUBLIC_API_URL` — usado por el refresh server-side.
- `LOGIN_ENABLED` — flag para habilitar/deshabilitar login.

## Convenciones

- Componentes cliente llevan `'use client'`; el `fetch` con cookies de Next solo funciona en route handlers o server components.
- Estilos con Tailwind v4 + `cn()` de `src/lib/utils.ts` (clsx + tailwind-merge); UI con Radix + class-variance-authority. Seguir el patrón existente en `src/components/ui/`.
- El backend vecino está en `../nidoria` (puerto 4000). Antes de asumir un shape de respuesta, verificar el endpoint real allí; si se cambia el contrato, actualizar ambos lados.
- No romper el manejo de refresh/401 de los dos `apiFetch`; cualquier cambio de auth debe tocarse en ambos.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
