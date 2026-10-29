"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, Share, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DISMISS_KEY = "nidoria:pwa-install-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type InstallState =
  | { mode: "native" }
  | { mode: "ios"; browser: string | null }
  | null;

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * iOS Safari nunca dispara `beforeinstallprompt`: la app solo se puede añadir
 * desde Compartir → "Añadir a pantalla de inicio". Se detecta el dispositivo
 * (incluido iPadOS, que se anuncia como Mac) para mostrar esas instrucciones.
 */
function isIOS(): boolean {
  const ua = window.navigator.userAgent;

  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Macintosh") && window.navigator.maxTouchPoints > 1)
  );
}

/** Navegadores de iOS que no crean una app real al añadir a inicio. */
const IOS_BROWSERS: Array<{ name: string; test: RegExp }> = [
  { name: "Instagram", test: /Instagram/i },
  { name: "Facebook", test: /FBAN|FBAV|FB_IAB/i },
  { name: "TikTok", test: /BytedanceWebview|musical_ly|TikTok/i },
  { name: "Chrome", test: /CriOS/i },
  { name: "Firefox", test: /FxiOS/i },
  { name: "Edge", test: /EdgiOS/i },
  { name: "Opera", test: /OPiOS/i },
  { name: "LinkedIn", test: /LinkedInApp/i },
];

/**
 * Nombre del navegador iOS cuando no es Safari. En el resto de navegadores de
 * iPhone (y en las webs embebidas de Instagram, Facebook, TikTok…) la opción
 * "Añadir a pantalla de inicio" crea un marcador, no una app independiente:
 * hay que abrir la página en Safari.
 */
function iosNonSafariBrowser(): string | null {
  const ua = window.navigator.userAgent;

  return IOS_BROWSERS.find((browser) => browser.test.test(ua))?.name ?? null;
}

/**
 * Botón flotante "Instalar Nidoria".
 *
 *  - Chromium/Android: usa el diálogo nativo (`beforeinstallprompt`).
 *  - iOS: no existe instalación programática, así que abre una hoja con los
 *    pasos de Safari (Compartir → Añadir a pantalla de inicio). Si la página
 *    se abrió en otro navegador o dentro de una app (Instagram, TikTok…), se
 *    avisa de que primero hay que pasarla a Safari.
 *
 * No aparece si la app ya está instalada o si se descartó antes.
 */
export function PwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [install, setInstall] = useState<InstallState>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (isStandalone()) return;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;

    if (isIOS()) {
      setInstall({ mode: "ios", browser: iosNonSafariBrowser() });
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setInstall({ mode: "native" });
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setInstall(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!install) return null;

  const startInstall = async () => {
    if (install.mode === "ios") {
      setHelpOpen(true);
      return;
    }

    const promptEvent = deferredPrompt;
    // Se oculta enseguida: el evento solo se puede usar una vez.
    setDeferredPrompt(null);
    setInstall(null);

    if (!promptEvent) return;

    await promptEvent.prompt();
    await promptEvent.userChoice.catch(() => null);
  };

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setDeferredPrompt(null);
    setInstall(null);
    setHelpOpen(false);
  };

  const copyLink = async () => {
    try {
      await window.navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const iosBrowser = install.mode === "ios" ? install.browser : null;

  return (
    <>
      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-[calc(1rem+env(safe-area-inset-left))] z-40 print:hidden">
        <div className="flex items-center gap-1 rounded-full border border-primary/30 bg-card/95 p-1 shadow-lg backdrop-blur-sm">
          <button
            type="button"
            onClick={startInstall}
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

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Instala Nidoria en tu iPhone</DialogTitle>
            <DialogDescription>
              Safari no permite instalar webs con un botón. Añádela a la
              pantalla de inicio en tres pasos.
            </DialogDescription>
          </DialogHeader>

          {iosBrowser ? (
            <div className="space-y-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
              <p>
                Estás abriendo Nidoria desde{" "}
                <strong>{iosBrowser}</strong>, que no puede añadirla como app.
                Copia el enlace y ábrelo en <strong>Safari</strong>.
              </p>
              <button
                type="button"
                onClick={copyLink}
                className="flex items-center gap-2 rounded-md border border-amber-500/40 bg-background/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-background"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {copied ? "Enlace copiado" : "Copiar enlace"}
              </button>
            </div>
          ) : null}

          <ol className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary dark:text-accent">
                1
              </span>
              <span>
                Toca el botón Compartir{" "}
                <Share className="inline h-4 w-4 align-text-bottom" aria-hidden="true" />{" "}
                en la barra de Safari.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary dark:text-accent">
                2
              </span>
              <span>
                Desliza el menú y elige{" "}
                <strong>&laquo;Añadir a pantalla de inicio&raquo;</strong>.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary dark:text-accent">
                3
              </span>
              <span>
                Confirma con <strong>Añadir</strong>. Nidoria se abrirá a
                pantalla completa, como una app.
              </span>
            </li>
          </ol>

          <p className="text-xs text-muted-foreground">
            La opción solo aparece en Safari y con la página cargada por HTTPS.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
