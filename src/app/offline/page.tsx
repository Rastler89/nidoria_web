import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sin conexión - Nidoria",
  robots: { index: false, follow: false },
};

/**
 * Página de respaldo que sirve el service worker cuando no hay red y la URL
 * pedida no está en caché. Se precarga en la instalación del worker, así que
 * debe poder renderizarse sin datos remotos.
 */
export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background ant-texture flex items-center justify-center px-4 py-16">
      <div className="glass-card w-full max-w-lg p-8 sm:p-12 text-center border-primary/30">
        <div className="flex justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element -- el logo debe cargarse sin optimizador cuando no hay red */}
          <img src="/nidoria2.png" alt="Nidoria" className="w-48 sm:w-56 opacity-90" />
        </div>

        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/15 flex items-center justify-center">
          <WifiOff className="w-8 h-8 text-accent" aria-hidden="true" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Sin conexión
        </h1>
        <p className="text-muted-foreground text-lg mb-2 font-serif italic">
          El túnel se ha derrumbado.
        </p>
        <p className="text-muted-foreground mb-8">
          No podemos cargar esta página sin red. Comprueba tu conexión y vuelve a
          intentarlo: tu colonia seguirá ahí.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/">Reintentar</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-xl border-primary/40 text-primary hover:bg-primary/10 hover:text-primary dark:border-accent/40 dark:bg-transparent dark:text-accent dark:hover:bg-accent/10 dark:hover:text-accent" asChild>
            <Link href="/wiki">Ver la wiki</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
