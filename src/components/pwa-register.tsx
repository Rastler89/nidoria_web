"use client";

import { useEffect } from "react";

/**
 * Registra el service worker de la PWA (`public/sw.js`).
 *
 * Solo en producción: en desarrollo el worker cachearía los assets de Turbopack
 * y estorbaría al HMR. No renderiza nada.
 */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch((error: unknown) => {
          console.warn("[pwa] No se pudo registrar el service worker", error);
        });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
