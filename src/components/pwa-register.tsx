"use client";

import { useEffect } from "react";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";

/** Cada cuánto se busca una versión nueva del service worker (30 min). */
const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000;

/**
 * Registra el service worker de la PWA (`public/sw.js`) y se ocupa de que la
 * pestaña no se quede en una versión vieja:
 *
 *  - Registro solo en producción: en desarrollo el worker cachearía los assets
 *    de Turbopack y estorbaría al HMR.
 *  - Comprueba si hay worker nuevo al volver a la pestaña y cada 30 minutos.
 *  - Cuando una versión nueva toma el control avisa con un toast; si la pestaña
 *    está en segundo plano recarga directamente.
 *
 * No renderiza nada.
 */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // El primer `claim` tras instalar no es una actualización: solo interesa a
    // partir de la segunda versión, cuando ya había un worker controlando.
    let hadController = Boolean(navigator.serviceWorker.controller);
    let reloading = false;
    let updateNotified = false;

    const reload = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };

    const onControllerChange = () => {
      if (!hadController) {
        hadController = true;
        return;
      }

      if (document.visibilityState === "hidden") {
        reload();
        return;
      }

      if (updateNotified) return;
      updateNotified = true;

      toast({
        title: "Nueva versión de Nidoria",
        description:
          "Ya está disponible la última versión. Recarga para aplicarla.",
        duration: 20000,
        action: (
          <ToastAction onClick={reload}>
            Recargar
          </ToastAction>
        ),
      });
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );

    let stopWatching = () => {};

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        const checkForUpdate = () => {
          if (document.visibilityState !== "visible") return;
          registration.update().catch(() => {
            // Sin red o servidor caído: se reintentará en la próxima comprobación.
          });
        };

        document.addEventListener("visibilitychange", checkForUpdate);
        const interval = window.setInterval(
          checkForUpdate,
          UPDATE_CHECK_INTERVAL_MS,
        );

        stopWatching = () => {
          document.removeEventListener("visibilitychange", checkForUpdate);
          window.clearInterval(interval);
        };
      } catch (error) {
        console.warn("[pwa] No se pudo registrar el service worker", error);
      }
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
      window.removeEventListener("load", register);
      stopWatching();
    };
  }, []);

  return null;
}
