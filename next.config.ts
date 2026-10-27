import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // El navegador debe comprobar siempre si hay una versión nueva del
        // service worker; si no, una copia vieja puede quedarse durante días.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // El antiguo borrador de registro ahora vive en /register
      { source: "/register/real", destination: "/register", permanent: false },
    ];
  },
};

export default nextConfig;
