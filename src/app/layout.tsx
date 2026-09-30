import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";

// Lil Grotesk (fuente variable, pesos 100–900), la misma del sitio original.
// next/font/local la sirve desde el propio sitio y la precarga automáticamente.
const lilGrotesk = localFont({
  src: "./fonts/LilGrotesk-Variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-lil-grotesk",
});

// Metadata provisoria. En la etapa de SEO se completan acá:
// metadataBase, title, description, alternates.canonical, openGraph, twitter, robots.
// El favicon ya lo toma Next automáticamente de src/app/icon.svg.
export const metadata: Metadata = {
  title: "Nueva versión (en desarrollo)",
};

export const viewport: Viewport = {
  themeColor: "#2E4998",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-UY" className={lilGrotesk.variable}>
      <body>{children}</body>
    </html>
  );
}
