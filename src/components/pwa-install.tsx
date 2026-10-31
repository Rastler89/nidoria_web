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

/**
 * Navegador con el que se abre la web en iOS. `isSafari` decide si la web se
 * puede añadir a la pantalla de inicio como app.
 */
interface IosBrowser {
  isSafari: boolean;
  name: string | null;
}

type InstallState =
  | { mode: "native" }
  | {
      mode: "ios";
      browser: IosBrowser;
      device: string;
      /** Se cerró la invitación: en iOS queda el botón compacto. */
      dismissed: boolean;
    }
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

function iosDeviceName(): string {
  const ua = window.navigator.userAgent;

  if (
    /iPad/.test(ua) ||
    (ua.includes("Macintosh") && window.navigator.maxTouchPoints > 1)
  ) {
    return "iPad";
  }

  return /iPod/.test(ua) ? "iPod" : "iPhone";
}

/**
 * En iOS todos los navegadores usan WebKit, pero solo Safari puede crear una
 * app independiente al añadir la web a la pantalla de inicio. El resto de
 * navegadores (Chrome, Edge, Firefox, Opera…) y las webs embebidas de
 * Instagram, WhatsApp, Gmail, TikTok… abren la hoja de compartir sin esa
 * acción, así que hay que avisar y ofrecer el enlace para abrirlo en Safari.
 */
const IOS_NON_SAFARI: Array<{ name: string; test: RegExp }> = [
  { name: "Instagram", test: /Instagram/i },
  { name: "Facebook", test: /FBAN|FBAV|FB_IAB|FBIOS/i },
  { name: "Messenger", test: /Messenger/i },
  { name: "WhatsApp", test: /WhatsApp/i },
  { name: "Telegram", test: /Telegram/i },
  { name: "TikTok", test: /BytedanceWebview|musical_ly|TikTok/i },
  { name: "X", test: /\bTwitter\b/i },
  { name: "Discord", test: /Discord/i },
  { name: "Slack", test: /Slack/i },
  { name: "Gmail", test: /\bGSA\// },
  { name: "LinkedIn", test: /LinkedInApp/i },
  { name: "Reddit", test: /Reddit/i },
  { name: "Pinterest", test: /Pinterest/i },
  { name: "Snapchat", test: /Snapchat/i },
  { name: "LINE", test: /\bLine\// },
  { name: "Chrome", test: /CriOS/i },
  { name: "Firefox", test: /FxiOS/i },
  { name: "Edge", test: /EdgiOS/i },
  { name: "Opera", test: /OPiOS/i },
  { name: "Yandex", test: /YaBrowser/i },
  { name: "DuckDuckGo", test: /DuckDuckGo/i },
];

function detectIosBrowser(): IosBrowser {
  const ua = window.navigator.userAgent;
  const known = IOS_NON_SAFARI.find((browser) => browser.test.test(ua));

  if (known) {
    return { isSafari: false, name: known.name };
  }

  // Safari real: "Version/x.x Mobile/… Safari/604.1". Las webviews de apps que
  // no se identifican con un token conocido omiten "Safari/", así que tampoco
  // pueden instalar la app.
  const isSafari = /Safari\//.test(ua) && /Version\//.test(ua);

  return { isSafari, name: null };
}

/** Copia al portapapeles con respaldo para Safari antiguo (sin Clipboard API). */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (window.navigator.clipboard?.writeText) {
      await window.navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Sin permiso o sin contexto seguro: se prueba el método clásico.
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Botón flotante "Instalar Nidoria".
 *
 *  - Chromium/Android: usa el diálogo nativo (`beforeinstallprompt`).
 *  - iOS: no existe instalación programática, así que abre una hoja con los
 *    pasos de Safari (Compartir → Añadir a pantalla de inicio). Si la página
 *    se abrió en otro navegador o dentro de una app (Instagram, WhatsApp,
 *    Gmail…), se avisa de que primero hay que pasarla a Safari y se ofrece
 *    copiar el enlace.
 *
 * En iOS la guía no desaparece del todo al cerrarla: queda un botón compacto,
 * porque sin ella no hay forma de instalar la app.
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

    const dismissedBefore = window.localStorage.getItem(DISMISS_KEY) === "1";

    if (isIOS()) {
      // Aunque se haya cerrado antes, la guía sigue disponible: es la única
      // vía para instalar en iOS.
      setInstall({
        mode: "ios",
        browser: detectIosBrowser(),
        device: iosDeviceName(),
        dismissed: dismissedBefore,
      });
      return;
    }

    if (dismissedBefore) return;

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

  const isIos = install.mode === "ios";
  const iosBrowser = isIos ? install.browser : null;
  const canInstallOnIos = iosBrowser?.isSafari ?? false;
  const device = isIos ? install.device : null;

  const startInstall = async () => {
    if (install.mode === "ios") {
      setCopied(false);
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
    setHelpOpen(false);
    // En iOS se deja el botón compacto; en Android la instalación sigue
    // disponible desde el menú del navegador.
    setInstall((current) =>
      current?.mode === "ios" ? { ...current, dismissed: true } : null,
    );
  };

  const copyLink = async () => {
    setCopied(await copyToClipboard(window.location.href));
  };

  const compact = install.mode === "ios" && install.dismissed;

  return (
    <>
      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-[calc(1rem+env(safe-area-inset-left))] z-40 print:hidden">
        {compact ? (
          <button
            type="button"
            onClick={startInstall}
            aria-label="Cómo instalar Nidoria"
            title="Cómo instalar Nidoria"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-card/95 text-primary shadow-lg backdrop-blur-sm transition-colors hover:bg-primary/10 dark:text-accent dark:hover:bg-accent/10"
          >
            <Download className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : (
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
        )}
      </div>

      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Instala Nidoria en tu {device ?? "iPhone"}</DialogTitle>
            <DialogDescription>
              {canInstallOnIos
                ? "Safari no permite instalar webs con un botón. Añádela a la pantalla de inicio en tres pasos."
                : "En iOS solo Safari puede añadir la web como app. Abre Nidoria en Safari y repite estos pasos."}
            </DialogDescription>
          </DialogHeader>

          {canInstallOnIos ? null : (
            <div className="space-y-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
              <p>
                Estás abriendo Nidoria desde{" "}
                <strong>{iosBrowser?.name ?? "un navegador que no es Safari"}</strong>,
                que no puede añadirla como app.
              </p>
              <p>
                Toca el botón de opciones (<strong>⋯</strong> o{" "}
                <strong>&laquo;aA&raquo;</strong>) y elige{" "}
                <strong>&laquo;Abrir en Safari&raquo;</strong>.
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
          )}

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
            Si no la ves, desliza la hoja de compartir hasta el final y toca
            &laquo;Editar acciones&raquo;.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
