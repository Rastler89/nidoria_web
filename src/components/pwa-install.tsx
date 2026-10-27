"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

const DISMISS_KEY = "nidoria:pwa-install-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

/**
 * Botón flotante "Instalar Nidoria".
 *
 * Solo aparece cuando el navegador ofrece instalar la app
 * (`beforeinstallprompt`, Chromium) y no se ha descartado antes. En iOS/Safari
 * ese evento no existe: allí se instala desde Compartir → "Añadir a inicio".
 */
export function PwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => setDeferredPrompt(null);

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!deferredPrompt) return null;

  const install = async () => {
    const promptEvent = deferredPrompt;
    // Se oculta enseguida: el evento solo se puede usar una vez.
    setDeferredPrompt(null);

    await promptEvent.prompt();
    await promptEvent.userChoice.catch(() => null);
  };

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setDeferredPrompt(null);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 print:hidden">
      <div className="flex items-center gap-1 rounded-full border border-primary/30 bg-card/95 p-1 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          onClick={install}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 dark:text-accent dark:hover:bg-accent/10"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Instalar Nidoria
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Ocultar la invitación a instalar"
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
