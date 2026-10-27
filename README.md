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

## 📱 PWA (instalable + offline)

La web es una PWA: se puede instalar desde el navegador y mantiene una copia de las últimas páginas visitadas para abrir sin conexión.

- **`src/app/manifest.ts`** — manifiesto (`/manifest.webmanifest`): nombre, colores del tema e iconos.
- **`public/icons/`** — iconos 192/512, *maskable* y `apple-touch-icon`, generados a partir de `public/nidoria2.png`.
- **`public/sw.js`** — service worker. Navegaciones *network-first* con copia en caché y fallback a `/offline`; `/_next/static/` *cache-first*; imágenes y fuentes *stale-while-revalidate*. Nunca cachea `/api/` ni peticiones de otro origen, y recorta las cachés en cada activación para que no crezcan entre despliegues.
- **`src/components/pwa-register.tsx`** — registra el worker **solo en producción** (en `next dev` estorbaría al HMR), busca actualizaciones al volver a la pestaña y cada 30 minutos, y avisa con un toast cuando hay una versión nueva (recarga sola si la pestaña está en segundo plano).
- **`src/components/pwa-install.tsx`** — botón flotante «Instalar Nidoria», visible solo cuando el navegador ofrece la instalación (`beforeinstallprompt`).
- **`src/app/offline/page.tsx`** — página de respaldo sin conexión.

Para probarlo hay que compilar y servir en producción (`npm run build && npm start`); en desarrollo el worker no se registra. Al cambiar la estrategia de caché de `public/sw.js`, subir `CACHE_VERSION` para invalidar las cachés antiguas.

---

## 📦 Deploy

Hay `Dockerfile` y `docker-compose.yml`. Para la beta sobre un VPS con Docker, ver la checklist en la raíz del proyecto (CORS, variables de producción, etc.).
