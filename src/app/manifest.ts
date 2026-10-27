import type { MetadataRoute } from "next";

/**
 * Manifiesto de la PWA de Nidoria.
 *
 * Next sirve este archivo en `/manifest.webmanifest` y lo enlaza solo desde el
 * layout raíz. Los iconos viven en `public/icons/` y se generan a partir del
 * logo del proyecto (`public/nidoria2.png`) sobre el fondo del tema oscuro.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Nidoria",
    short_name: "Nidoria",
    description:
      "Gestiona tu colonia de hormigas en tiempo real: recolecta recursos, construye estructuras y defiéndete de amenazas.",
    lang: "es",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#1c1512",
    theme_color: "#1c1512",
    categories: ["games", "strategy", "entertainment"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Mi colonia",
        short_name: "Colonia",
        description: "Ir al panel de tu colonia",
        url: "/dashboard",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Wiki",
        short_name: "Wiki",
        description: "Consultar la wiki del juego",
        url: "/wiki",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
