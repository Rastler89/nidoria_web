# 🐜 Nidoria Web — Cliente Web

Cliente web del juego **Nidoria**, construido con **Next.js** (App Router). Consume la API de [`nidoria`](https://github.com/Rastler89/nidoria) vía REST y tiempo real por Socket.IO.

Este es el segundo repo del proyecto; el backend está en [`nidoria`](https://github.com/Rastler89/nidoria).

---

## 🧰 Stack

- [Next.js](https://nextjs.org/) 16 (App Router, Turbopack)
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- Componentes UI: [Radix UI](https://www.radix-ui.com/) (estilo shadcn)
- [SWR](https://swr.vercel.app/) — fetching/caché de datos
- [Socket.IO Client](https://socket.io/) — tiempo real

---

## 🚀 Arranque rápido

Requisitos: Node 20+ y la API de `nidoria` corriendo (por defecto en `http://localhost:4000`).

```bash
# 1. Dependencias
npm install

# 2. Variables de entorno
cp .env.example .env    # y completar valores

# 3. Desarrollo
npm run dev             # http://localhost:3000
```

Build de producción:

```bash
npm run build
npm start
```

---

## 🧪 Tests y calidad

```bash
npm test          # unit tests (Vitest)
npm run test:watch# watch
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
```

---

## 🏗️ Estructura

- **`src/app/`** — App Router: `page.tsx` (landing), `login/`, `register/`, `dashboard/`, `explore/`, `wiki/`.
- **`src/app/api/`** — route handlers de Next que actúan de **proxy** hacia la API NestJS (auth, ants, constructions, investigations, resources, ranking, misiones, pre-register).
- **`src/lib/`**
  - `apiFetch.tsx` — fetch **server-side** (usa cookies de Next); renueva el token ante un 401.
  - `api-client.tsx` — fetch **client-side** (usa `js-cookie`); Authorization Bearer + refresh + logout forzado.
  - `auth.tsx` — contexto y gestión de sesión (`useAuth`).
  - `useResources.tsx` — hook SWR.
  - `utils.ts` — `cn()` (clsx + tailwind-merge).
- **`src/context/SocketContext.tsx`** — conexión Socket.IO con JWT; escucha `anthill_update` y `auth_error`.
- **`src/components/`** — `ui/` (Radix + CVA), `protected-route.tsx`, `theme-provider.tsx`, etc.

### Variables de entorno

Ver [.env.example](./.env.example). `DB_HOST` (server), `NEXT_PUBLIC_DB_HOST` (browser + Socket.IO), `NEXT_PUBLIC_API_URL` (refresh server-side), `LOGIN_ENABLED`.

---

## 📦 Deploy

Hay `Dockerfile` y `docker-compose.yml`. Para la beta sobre un VPS con Docker, ver la checklist en la raíz del proyecto (CORS, variables de producción, etc.).
