import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AuthProvider } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nidoria - Estrategia en tiempo real con hormigas",
  description: "Gestiona tu colonia de hormigas en tiempo real, recolecta recursos, construye estructuras y defiéndete de amenazas en un entorno dinámico y desafiante.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,200..900;1,200..900&display=swap');
      </style>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <Suspense>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
