import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { revealPendingScript } from "@/components/layout/revealPendingScript";
import { siteUrl } from "@/components/layout/SocialMetaTags";
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

// Base para resolver URLs de la metadata (site.url). Title, description, canonical, Open Graph
// y Twitter son de la página principal: están en page.tsx (así la 404 no los hereda).
// El favicon lo toma Next automáticamente de src/app/icon.svg.
export const metadata: Metadata = {
  metadataBase: siteUrl,
};

export const viewport: Viewport = {
  themeColor: "#2E4998",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // suppressHydrationWarning: el script inline agrega data-reveal-pending a <html> antes de hidratar
    // (a propósito). Solo alcanza a los atributos de <html>, no a sus hijos.
    <html lang="es-UY" className={lilGrotesk.variable} suppressHydrationWarning>
      <head>
        {/* Antes del primer pintado: oculta los [data-reveal] hasta que ScrollReveal los procese (ver revealPendingScript.ts) */}
        <script dangerouslySetInnerHTML={{ __html: revealPendingScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
