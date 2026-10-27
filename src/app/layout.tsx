import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { SocketProvider } from "@/context/SocketContext";
import { Toaster } from "@/components/ui/toaster";
import { SiteBanner } from "@/components/site-banner";
import { PwaRegister } from "@/components/pwa-register";
import { PwaInstall } from "@/components/pwa-install";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nidoria - Estrategia en tiempo real con hormigas",
  description: "Gestiona tu colonia de hormigas en tiempo real, recolecta recursos, construye estructuras y defiéndete de amenazas en un entorno dinámico y desafiante.",
  applicationName: "Nidoria",
  appleWebApp: {
    capable: true,
    title: "Nidoria",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  other: {
    // iOS antiguo (antes de 16.4) solo abre en modo app con esta meta.
    "apple-mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfbf7" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1512" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${crimsonPro.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <PwaRegister />
        <PwaInstall />
        <SiteBanner />
        <Suspense>
          <AuthProvider>
            <SocketProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster />
              </ThemeProvider>
            </SocketProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
